const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        commentContent: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to User model
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post', // Reference to Post model
            required: true
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment' // Reference to Comment model for nested replies
            }
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to Comment model for nested replies
            }
        ]
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
