import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        enum: ['doubts-about-faculty', 'general'],
        default: 'doubts-about-faculty',
    },
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
        maxlength: [2000, 'Question cannot exceed 2000 characters'],
    },
    aiSpamScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
    },
    aiAnalysis: {
        isSpam: { type: Boolean, default: false },
        isOffensive: { type: Boolean, default: false },
        isHarassment: { type: Boolean, default: false },
        isIrrelevant: { type: Boolean, default: false },
        suggestedAction: {
            type: String,
            enum: ['approve', 'review', 'block_user'],
            default: 'approve',
        },
        reasoning: { type: String, default: '' },
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
