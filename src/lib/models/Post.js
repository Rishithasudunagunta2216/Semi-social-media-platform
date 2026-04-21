import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['fest-updates', 'previous-year-papers', 'daily-updates'],
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    mediaUrls: [{
        url: String,
        type: {
            type: String,
            enum: ['image', 'video', 'pdf'],
        },
        filename: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
