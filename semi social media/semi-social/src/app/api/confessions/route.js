import dbConnect from '@/lib/db';
import Confession from '@/lib/models/Confession';
import Setting from '@/lib/models/Setting';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { analyzeContent } from '@/lib/ai-moderation';
import { NextResponse } from 'next/server';

// GET - List confessions
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const pending = searchParams.get('pending') === 'true';

        let query = {};

        if (user.role === 'admin') {
            if (pending) {
                query = { isApproved: false, isRejected: false };
            }
        } else {
            // Students only see approved confessions
            query.isApproved = true;
        }

        const total = await Confession.countDocuments(query);
        const confessions = await Confession.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Remove studentId for non-admin users (anonymous)
        const sanitized = confessions.map(c => {
            if (user.role !== 'admin') {
                const { studentId, ...rest } = c;
                return rest;
            }
            return c;
        });

        return NextResponse.json({
            confessions: sanitized,
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

// POST - Submit a confession (students only, when enabled)
export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        if (user.role !== 'student') {
            return NextResponse.json({ error: 'Only students can submit confessions' }, { status: 403 });
        }

        await dbConnect();

        // Check if user is blocked
        const dbUser = await User.findById(user.userId);
        if (dbUser?.isBlocked) {
            return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 });
        }

        // Check if confession mode is enabled
        const setting = await Setting.findOne({ key: 'confessionMode' });
        if (!setting || !setting.value) {
            return NextResponse.json(
                { error: 'Confessions are currently disabled. Check back on Friday!' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { confessionText } = body;

        if (!confessionText || confessionText.trim().length === 0) {
            return NextResponse.json({ error: 'Confession text is required' }, { status: 400 });
        }

        // AI moderation
        const analysis = analyzeContent(confessionText);

        const confession = await Confession.create({
            studentId: user.userId,
            confessionText: confessionText.trim(),
            aiSpamScore: analysis.spamScore,
            aiAnalysis: {
                isSpam: analysis.isSpam,
                isOffensive: analysis.isOffensive,
                suggestedAction: analysis.suggestedAction,
            },
        });

        return NextResponse.json({
            message: 'Confession submitted. It will be reviewed by the admin.',
            confession: { id: confession._id },
        }, { status: 201 });
    } catch (error) {
        console.error('Submit confession error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
