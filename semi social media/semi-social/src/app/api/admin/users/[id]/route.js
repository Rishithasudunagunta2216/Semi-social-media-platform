import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PATCH - Block/unblock a user (admin only)
export async function PATCH(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { isBlocked } = body;

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (targetUser.role === 'admin') {
            return NextResponse.json({ error: 'Cannot block an admin' }, { status: 403 });
        }

        targetUser.isBlocked = isBlocked;
        await targetUser.save();

        return NextResponse.json({
            message: `User ${isBlocked ? 'blocked' : 'unblocked'}`,
            user: {
                id: targetUser._id,
                name: targetUser.name,
                isBlocked: targetUser.isBlocked,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
