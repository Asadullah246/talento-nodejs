// sendOTP -> if verified :
//                 user create
//             else :
//                 sendOTP -> again
//                     checkOTP -> if time wise encrypted otp check if okay then is verifed true
//                                 else false

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to send OTP via email
const sendOTP = async (email, otp) => {
    // Set up your email transport configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email service
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS // Your email password or app-specific password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

// Controller function to generate and send OTP
const createOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    otps[email] = { otp, createdAt: Date.now() };

    try {
        await sendOTP(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// Function to verify OTP
const verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otps[email];

    if (!storedData) {
        return res.status(400).json({ message: 'No OTP sent to this email' });
    }

    const { otp: storedOtp, createdAt } = storedData;

    // Check if OTP is valid and not expired (5 minutes)
    if (otp === storedOtp && Date.now() - createdAt < 5 * 60 * 1000) {
        delete otps[email]; // OTP is valid, remove it
        return res.status(200).json({ message: 'OTP verified successfully' });
    }

    res.status(400).json({ message: 'Invalid or expired OTP' });
};

module.exports = {
    createOTP,
    verifyOTP
};
