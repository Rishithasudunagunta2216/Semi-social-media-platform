import dbConnect from '@/lib/db';
import Confession from '@/lib/models/Confession';
import Setting from '@/lib/models/Setting';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { analyzeContent } from '@/lib/ai-moderation';
import { NextResponse } from 'next/server';

// GET - List confessions with private filtering
export async function GET(request) {
    try {
        const authUser = getUserFromRequest(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const filter = searchParams.get('filter') || 'public'; // public, for_me, my_sent

        // AUTHENTICATION & PRIVACY LOGIC
        let query = { is_approved: true };

        if (filter === 'public') {
            // General confessions and NO target
            query.target_student_email = null;
        } else if (filter === 'for_me') {
            // Private confessions addressed to the logged-in student
            const dbUser = await User.findById(authUser.userId);
            query.target_student_email = dbUser?.email;
        } else if (filter === 'my_sent') {
            // Confessions the user has sent (including unapproved ones)
            query = { studentId: authUser.userId };
        }

        const total = await Confession.countDocuments(query);
        const confessions = await Confession.find(query)
            .select('-studentId') // NEVER expose the sender's ID
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            confessions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get confessions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Submit a confession (Supports Targeted Private Messages)
export async function POST(request) {
    try {
        const authUser = getUserFromRequest(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        if (authUser.role !== 'student') {
            return NextResponse.json({ error: 'Only students can submit confessions' }, { status: 403 });
        }

        await dbConnect();

        // Check if user is blocked
        const dbUser = await User.findById(authUser.userId);
        if (dbUser?.isBlocked) {
            return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 });
        }

        // CONFESSION ALLOWANCE LOGIC
        const today = new Date();
        const isFriday = today.getDay() === 5;
        const setting = await Setting.findOne({ key: 'confessionMode' });
        const modeEnabled = setting?.value === true;

        if (!isFriday && !modeEnabled) {
            return NextResponse.json(
                { error: 'Confessions are only allowed on Fridays' },
                { status: 403 }
            );
        }

        // RATE LIMITING - 1 confession per day
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const existingToday = await Confession.findOne({
            studentId: authUser.userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingToday) {
            return NextResponse.json(
                { error: 'You can only submit one confession per day' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { confession_text, target_student_email } = body;

        if (!confession_text || confession_text.trim().length === 0) {
            return NextResponse.json({ error: 'Confession text is required' }, { status: 400 });
        }

        // Validate target email if provided
        let targetEmail = null;
        if (target_student_email && target_student_email.trim()) {
            targetEmail = target_student_email.trim().toLowerCase();
            const targetExists = await User.findOne({ email: targetEmail, role: 'student' });
            if (!targetExists) {
                return NextResponse.json({ error: 'The target student email was not found in the university database' }, { status: 404 });
            }
            if (targetEmail === dbUser.email) {
                return NextResponse.json({ error: 'You cannot send a confession to yourself' }, { status: 400 });
            }
        }

        // AI moderation (async) - Wrap in try/catch to prevent 500 on AI failure
        let analysis = { spamScore: 0 };
        try {
            analysis = await analyzeContent(confession_text);
        } catch (aiError) {
            console.error('AI Moderation failed during confession submission:', aiError);
            // Fallback to minimal score so submission still works
        }

        let confession;
        try {
            confession = await Confession.create({
                studentId: authUser.userId, // Mongoose usually casts this, but let's be safe
                target_student_email: targetEmail,
                confession_text: confession_text.trim(),
                is_approved: false,
                is_anonymous: true,
                aiSpamScore: analysis.spamScore || 0,
            });
            console.log('Confession created successfully:', confession._id);
        } catch (dbError) {
            console.error('Database save failure for confession:', dbError);
            return NextResponse.json({ 
                error: 'Could not save confession to database',
                details: dbError.message 
            }, { status: 500 });
        }

        return NextResponse.json({
            message: targetEmail 
                ? 'Your private secret has been locked and sent for admin review.' 
                : 'Your anonymous confession was sent to the void and awaits review.',
            id: confession._id,
        }, { status: 201 });
    } catch (error) {
        console.error('CRITICAL ERROR in /api/confessions POST:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message 
        }, { status: 500 });
    }
}
