const nodemailer = require('nodemailer');
const Verification = require('./verification.model');
require('dotenv').config(); // env file access

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    return otp.toString();
}

const sendVerificationCode = async (email, next) => {
    try {
        const otp = generateOTP();
        console.log(otp);

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Replace with your email service
            port: 465,
            secure: true,
            host: 'smtp.gmail.com',

            auth: {
                user: process.env.EMAIL, //  owner email
                pass: process.env.EMAIL_PASSWORD //  owner email password
            }
        });
        console.log('----------');

        // Set up email data
        const mailOptions = {
            from: process.env.EMAIL, // Sender address
            to: email, // List of receivers
            subject: 'Your OTP Code from talento App',
            text: `Your OTP code is: ${otp} This code will be Invalid after 300 seconds` // Plain text body
        };
        console.log('<<<<<<<<<<');
        const dd = await transporter.sendMail(mailOptions);
        console.log(dd, '////////////');
        console.log('>>>>>>>>>>>>>>>');
        const previousOTP = await Verification.find({ email });
        console.log(previousOTP);
        if (previousOTP) {
            await Verification.deleteMany({ email });
        }

        const verificationCreate = await Verification.create({ email, otp });
        console.log(`OTP sent to ${email}: ${otp}`);
        return verificationCreate;
    } catch (err) {
        next(err.message);
    }
};

module.exports = {
    sendVerificationCode
};
