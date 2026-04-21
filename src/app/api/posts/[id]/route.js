import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// DELETE - Delete a post (admin only)
export async function DELETE(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update a post (admin only)
export async function PATCH(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const post = await Post.findByIdAndUpdate(id, body, { new: true });
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post updated', post });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
