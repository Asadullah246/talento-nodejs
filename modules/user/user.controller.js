const { OTP_TIME_LIMIT } = require('../../libs/variables');
const { sendVerificationCode } = require('../verification/verification.controller');
const Verification = require('../verification/verification.model');
const User = require('./user.model');
const bcrypt = require('bcrypt');

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

const followUser = async (req, res, next) => {
    try {
        const { targetUserId } = req.body; // Get the user to follow from request params
        const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

        // Ensure the user is not trying to follow themselves
        if (userId === targetUserId) {
            return res.status(400).send({ status: false, message: "You can't follow yourself" });
        }

        // Find both the current user and the target user
        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).send({ status: false, message: 'User to follow not found' });
        }

        // Check if already following
        if (currentUser.following.includes(targetUserId)) {
            return res
                .status(400)
                .send({ status: false, message: 'You are already following this user' });
        }

        // Add target user's ID to the current user's following array
        currentUser.following.push(targetUserId);
        // Add current user's ID to the target user's followers array
        targetUser.followers.push(userId);

        // Save both users
        await currentUser.save();
        await targetUser.save();

        res.status(200).send({
            status: true,
            message: `You are now following ${targetUser.userName}`
        });
    } catch (error) {
        console.error('Error following user:', error);
        next(error);
    }
};

const unFollowUser = async (req, res, next) => {
    try {
        const { targetUserId } = req.body; // Get the user to unfollow from request params
        const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

        // Ensure the user is not trying to unfollow themselves
        if (userId === targetUserId) {
            return res.status(400).send({ status: false, message: "You can't unfollow yourself" });
        }

        // Find both the current user and the target user
        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).send({ status: false, message: 'User to unfollow not found' });
        }

        // Check if the user is following the target user
        if (!currentUser.following.includes(targetUserId)) {
            return res
                .status(400)
                .send({ status: false, message: 'You are not following this user' });
        }

        // Remove target user's ID from the current user's following array
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUserId
        );
        // Remove current user's ID from the target user's followers array
        // targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

        targetUser.followers = targetUser.followers.filter((id) => !id.equals(userId));

        // Save both users
        await currentUser.save();
        await targetUser.save();

        res.status(200).send({
            status: true,
            message: `You have unfollowed ${targetUser.userName}`
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Get the current user's ID from token payload
        const { userName, email, password } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }

        // Check if email is being updated and if it's unique
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).send({ status: false, message: 'Email already in use' });
            }
            user.email = email; // Update the email
        }

        // Update userName if provided
        if (userName) {
            user.userName = userName;
        }

        // Update password if provided and hash the new password
        if (password) {
            if (password.length < 6) {
                return res.status(400).send({
                    status: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            user.password = await bcrypt.hash(password, 10); // Hash the new password
        }

        // Save the updated user
        await user.save();

        res.status(200).send({ status: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        next(error); // Pass error to next middleware
    }
};

module.exports = {
    userOtpSend,
    userOtpVerify,
    followUser,
    unFollowUser,
    updateUser
};
