const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            min: [2, 'at least 3 character of name'],
            required: [true, 'user name is required ']
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            min: [6, 'password should be minimum 6 length'],
            required: true
        },

        role: {
            type: String,
            default: 'user',
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: false
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        profilePicture: {
            type: String
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
