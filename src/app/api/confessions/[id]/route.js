import dbConnect from '@/lib/db';
import Confession from '@/lib/models/Confession';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PATCH - Approve or reject a confession (admin only)
export async function PATCH(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { action } = body; // 'approve' or 'reject'

        const update = {};
        if (action === 'approve') {
            update.isApproved = true;
            update.isRejected = false;
        } else if (action === 'reject') {
            update.isApproved = false;
            update.isRejected = true;
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const confession = await Confession.findByIdAndUpdate(id, update, { new: true });
        if (!confession) {
            return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Confession ${action}d`, confession });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a confession (admin only)
export async function DELETE(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        await Confession.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Confession deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
