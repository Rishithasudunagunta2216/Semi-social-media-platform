import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - List flagged questions (admin only)
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query = { isFlagged: true, isDeleted: false };

        const total = await Question.countDocuments(query);
        const questions = await Question.find(query)
            .populate('studentId', 'name email registrationNumber')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            questions,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Get flagged questions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
