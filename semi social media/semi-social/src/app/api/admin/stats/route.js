import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Question from '@/lib/models/Question';
import Post from '@/lib/models/Post';
import Confession from '@/lib/models/Confession';
import Setting from '@/lib/models/Setting';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - Admin dashboard stats
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const [
            totalStudents,
            blockedStudents,
            totalQuestions,
            flaggedQuestions,
            pendingQuestions,
            totalPosts,
            totalConfessions,
            pendingConfessions,
            confessionSetting,
        ] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'student', isBlocked: true }),
            Question.countDocuments({ isDeleted: false }),
            Question.countDocuments({ isFlagged: true, isDeleted: false }),
            Question.countDocuments({ isApproved: false, isDeleted: false }),
            Post.countDocuments(),
            Confession.countDocuments(),
            Confession.countDocuments({ is_approved: false, is_rejected: false }),
            Setting.findOne({ key: 'confessionMode' }),
        ]);

        // Recent flagged questions
        const recentFlagged = await Question.find({ isFlagged: true, isDeleted: false })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return NextResponse.json({
            stats: {
                totalStudents,
                blockedStudents,
                totalQuestions,
                flaggedQuestions,
                pendingQuestions,
                totalPosts,
                totalConfessions,
                pendingConfessions,
                confessionModeEnabled: confessionSetting?.value || false,
            },
            recentFlagged,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
