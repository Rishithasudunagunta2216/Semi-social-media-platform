import dbConnect from '@/lib/db';
import Confession from '@/lib/models/Confession';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PATCH - Approve or Reject a confession
export async function PATCH(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = params;
        const body = await request.json();
        const { action } = body; // 'approve' or 'reject'

        await dbConnect();

        const update = {};
        if (action === 'approve') {
            update.is_approved = true;
            update.is_rejected = false;
        } else if (action === 'reject') {
            update.is_approved = false;
            update.is_rejected = true;
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const confession = await Confession.findByIdAndUpdate(id, update, { new: true });

        if (!confession) {
            return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Confession ${action}d successfully`, confession });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove a confession
export async function DELETE(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = params;

        await dbConnect();

        const confession = await Confession.findByIdAndDelete(id);

        if (!confession) {
            return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Confession deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
