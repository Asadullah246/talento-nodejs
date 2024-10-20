const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
