import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import Answer from '@/lib/models/Answer';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST - Admin answers a question
export async function POST(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const { id } = await params;
        const question = await Question.findById(id);
        if (!question || question.isDeleted) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        const body = await request.json();
        const { answerText } = body;

        if (!answerText || answerText.trim().length === 0) {
            return NextResponse.json({ error: 'Answer text is required' }, { status: 400 });
        }

        const answer = await Answer.create({
            questionId: id,
            adminId: user.userId,
            answerText: answerText.trim(),
        });

        // Auto-approve the question if it was pending
        if (!question.isApproved) {
            question.isApproved = true;
            await question.save();
        }

        return NextResponse.json({ message: 'Answer posted', answer }, { status: 201 });
    } catch (error) {
        console.error('Answer question error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Admin deletes a question
export async function DELETE(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const { id } = await params;
        const question = await Question.findById(id);
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        question.isDeleted = true;
        await question.save();

        return NextResponse.json({ message: 'Question deleted' });
    } catch (error) {
        console.error('Delete question error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Admin approves/rejects a question
export async function PATCH(request, { params }) {
    try {
        const user = getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await dbConnect();

        const { id } = await params;
        const body = await request.json();
        const { isApproved, isFlagged } = body;

        const update = {};
        if (typeof isApproved === 'boolean') update.isApproved = isApproved;
        if (typeof isFlagged === 'boolean') update.isFlagged = isFlagged;

        const question = await Question.findByIdAndUpdate(id, update, { new: true });
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Question updated', question });
    } catch (error) {
        console.error('Update question error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
