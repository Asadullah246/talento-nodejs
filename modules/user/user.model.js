const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            min: [2, 'at least 3 character of admin name'],
            required: [true, 'user name is required '],
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            min: [6, 'password should be minimum 6 length'],
            required: true
        },

        role: {
            type: String,
            default: 'user'
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
