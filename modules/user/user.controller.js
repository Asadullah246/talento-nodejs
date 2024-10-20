const { OTP_TIME_LIMIT } = require('../../libs/variables');
const { sendVerificationCode } = require('../verification/verification.controller');
const Verification = require('../verification/verification.model');

const userOtpSend = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);
        const verification = await sendVerificationCode(email, next);
        console.log(verification);

        res.send({
            status: true,
            verification,
            message: 'user form token'
        });
    } catch ({ message }) {
        next(message);
    }
};

const userOtpVerify = async (req, res, next) => {
    try {
        const { otp, email } = req.body;

        const dbUserVerificationOtp = await Verification.findOne({ email });
        const { otp: otpUser, createdAt } = dbUserVerificationOtp;
        const currentTime = Date.now();
        console.log(currentTime - createdAt);

        const isValid = otp === otpUser && currentTime - createdAt <= OTP_TIME_LIMIT;

        if (isValid) {
            await Verification.deleteOne({ email });

            return res.send({
                status: true,
                message: 'Otp verification successful '
            });
        } else {
            return res.send({
                status: false,
                message: 'Invalid Otp '
            });
        }
    } catch ({ message }) {
        next(message);
    }
};

module.exports = {
    userOtpSend,
    userOtpVerify
};
