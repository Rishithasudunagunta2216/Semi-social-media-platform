import mongoose from 'mongoose';

const ConfessionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    confessionText: {
        type: String,
        required: [true, 'Confession text is required'],
        maxlength: [3000, 'Confession cannot exceed 3000 characters'],
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
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
        suggestedAction: {
            type: String,
            enum: ['approve', 'review', 'block_user'],
            default: 'approve',
        },
    },
}, {
    timestamps: true,
});

export default mongoose.models.Confession || mongoose.model('Confession', ConfessionSchema);
