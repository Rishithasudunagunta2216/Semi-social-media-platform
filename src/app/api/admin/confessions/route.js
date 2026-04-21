import dbConnect from '@/lib/db';
import Confession from '@/lib/models/Confession';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - List all confessions for admin moderation (shows targets and senders)
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'pending'; 
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query = {};
        if (filter === 'pending') {
            query.is_approved = false;
            query.is_rejected = false;
        } else if (filter === 'approved') {
            query.is_approved = true;
        } else if (filter === 'rejected') {
            query.is_rejected = true;
        }

        const total = await Confession.countDocuments(query);
        const confessions = await Confession.find(query)
            .populate('studentId', 'name email registrationNumber') // Admins see sender info
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
        console.error('Admin get confessions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
