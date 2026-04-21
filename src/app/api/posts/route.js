import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - List posts by category
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
        const category = searchParams.get('category');

        const query = {};
        if (category) query.category = category;

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('createdBy', 'name')
            .sort({ isPinned: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a post (admin only)
export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const body = await request.json();
        const { title, content, category, mediaUrls, isPinned } = body;

        if (!title || !content || !category) {
            return NextResponse.json(
                { error: 'Title, content, and category are required' },
                { status: 400 }
            );
        }

        const post = await Post.create({
            title,
            content,
            category,
            mediaUrls: mediaUrls || [],
            createdBy: user.userId,
            isPinned: isPinned || false,
        });

        return NextResponse.json({ message: 'Post created', post }, { status: 201 });
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
