import dbConnect from '@/lib/db';
import Setting from '@/lib/models/Setting';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - Get settings
export async function GET(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await dbConnect();

        const confessionSetting = await Setting.findOne({ key: 'confessionMode' });

        return NextResponse.json({
            confessionMode: confessionSetting?.value || false,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update settings (admin only)
export async function PATCH(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const body = await request.json();
        const { confessionMode } = body;

        if (typeof confessionMode === 'boolean') {
            await Setting.findOneAndUpdate(
                { key: 'confessionMode' },
                { value: confessionMode, updatedBy: user.userId },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ message: 'Settings updated', confessionMode });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
