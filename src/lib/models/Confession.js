import mongoose from 'mongoose';

const ConfessionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The intended recipient's email (for private targeted confessions)
    target_student_email: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        default: null,
    },
    // Using snake_case as requested by user for these fields
    confession_text: {
        type: String,
        required: [true, 'Confession text is required'],
        maxlength: [3000, 'Confession cannot exceed 3000 characters'],
    },
    is_approved: {
        type: Boolean,
        default: false,
        index: true,
    },
    is_anonymous: {
        type: Boolean,
        default: true,
    },
    is_rejected: {
        type: Boolean,
        default: false,
    },
    // Keeping AI fields for backend moderation consistency
    aiSpamScore: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Virtual for created_at as requested
ConfessionSchema.virtual('created_at').get(function() {
    return this.createdAt;
});

export default mongoose.models.Confession || mongoose.model('Confession', ConfessionSchema);
