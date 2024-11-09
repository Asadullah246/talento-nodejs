const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            required: true,
            maxLength: 500
        },
        imageUrl: {
            type: String
        },
        videoUrl: {
            type: String
        },
        sharedPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post' // Reference to the original post if this is a shared post
        },
        comments: [
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
        ],
        shared: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User' // Reference to the User model
            }
          ]
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
