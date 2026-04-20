import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import Answer from '@/lib/models/Answer';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { analyzeContent } from '@/lib/ai-moderation';
import { NextResponse } from 'next/server';

// GET - List questions
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
        const category = searchParams.get('category') || 'all';
        const flaggedOnly = searchParams.get('flagged') === 'true';

        const query = { isDeleted: false };
        if (category !== 'all') {
            query.category = category;
        }

        // Non-admin users only see approved questions
        if (user.role !== 'admin') {
            query.isApproved = true;
        }

        if (flaggedOnly && user.role === 'admin') {
            query.isFlagged = true;
        }

        const total = await Question.countDocuments(query);
        const questions = await Question.find(query)
            .populate('studentId', 'name email registrationNumber')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Fetch answers for each question
        const questionIds = questions.map(q => q._id);
        const answers = await Answer.find({ questionId: { $in: questionIds } })
            .populate('adminId', 'name')
            .lean();

        const answersMap = {};
        answers.forEach(a => {
            if (!answersMap[a.questionId.toString()]) {
                answersMap[a.questionId.toString()] = [];
            }
            answersMap[a.questionId.toString()].push(a);
        });

        const questionsWithAnswers = questions.map(q => ({
            ...q,
            answers: answersMap[q._id.toString()] || [],
        }));

        return NextResponse.json({
            questions: questionsWithAnswers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get questions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Submit a question (students only)
export async function POST(request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        if (user.role !== 'student') {
            return NextResponse.json({ error: 'Only students can ask questions' }, { status: 403 });
        }

        await dbConnect();

        // Check if user is blocked
        const dbUser = await User.findById(user.userId);
        if (dbUser?.isBlocked) {
            return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 });
        }

        const body = await request.json();
        const { questionText, category } = body;

        if (!questionText || questionText.trim().length === 0) {
            return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
        }

        // AI moderation analysis
        const analysis = await analyzeContent(questionText);

        const question = await Question.create({
            studentId: user.userId,
            questionText: questionText.trim(),
            category: category || 'doubts-about-faculty',
            spamScore: analysis.spamScore,
            aiReason: analysis.reasoning,
            aiAnalysis: {
                isSpam: analysis.isSpam,
                isOffensive: analysis.isOffensive,
                isHarassment: analysis.isHarassment,
                isIrrelevant: analysis.isIrrelevant,
                suggestedAction: analysis.suggestedAction,
            },
            isFlagged: analysis.spamScore >= 0.4 || analysis.isOffensive || analysis.isHarassment,
            isApproved: analysis.spamScore < 0.5 && !analysis.isOffensive && !analysis.isHarassment, // Auto-approve clean content
        });

        return NextResponse.json({
            message: analysis.spamScore >= 0.5
                ? 'Your question has been submitted and is pending review'
                : 'Question submitted successfully',
            question,
        }, { status: 201 });
    } catch (error) {
        console.error('Submit question error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
