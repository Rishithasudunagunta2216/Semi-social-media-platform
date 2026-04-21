import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answerText: {
        type: String,
        required: [true, 'Answer text is required'],
        maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    },
    mediaUrls: [{
        type: String,
    }],
}, {
    timestamps: true,
});

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
