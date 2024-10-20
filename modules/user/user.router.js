const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { userOtpSend, userOtpVerify } = require('./user.controller');
const userRouter = express.Router();

// writes the user router

userRouter.post('/userOtpSend', userOtpSend);
userRouter.post('/userOtpVerify', userOtpVerify);

module.exports = {
    userRouter
};
