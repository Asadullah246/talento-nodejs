const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    userOtpSend,
    userOtpVerify,
    followUser,
    unFollowUser,
    updateUser
} = require('./user.controller');
const userRouter = express.Router();

// writes the user router

userRouter.post('/userOtpSend', userOtpSend);
userRouter.post('/userOtpVerify', userOtpVerify);
userRouter.post('/followUser', checkToken, followUser);
userRouter.post('/unFollowUser', checkToken, unFollowUser);
userRouter.post('/updateUser', checkToken, updateUser);

module.exports = {
    userRouter
};
