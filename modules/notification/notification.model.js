const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            // The user receiving the notification
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sender: {
            // The user who performed the action (e.g., liked the post)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        link: {
            type: String,
            required: false
        },
        notificationType: {
            type: String,
            enum: ['like', 'comment', 'follow','invitation',"invitationToCommunity","reply","likeOnComment"], // Types of notifications
            required: true
        },
        post: {
            // If related to a post
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        comment: {
            // If related to a comment (optional)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        community: {
            // If related to a community (optional)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        message: {
            type: String,
            required: true
        },
        read: {
            // Indicates if the notification has been read
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt
    }
);

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
