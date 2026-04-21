import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        default: 'Academics',
    },
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
        maxlength: [2000, 'Question cannot exceed 2000 characters'],
    },
    // AI Moderation Fields
    spamScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
    },
    isFlagged: {
        type: Boolean,
        default: false,
        index: true,
    },
    aiReason: {
        type: String,
        default: '',
    },
    // Extended AI analysis detail
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
    },
    // Admin moderation status
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
