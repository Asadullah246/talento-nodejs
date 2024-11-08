const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    userOtpSend,
    userOtpVerify,
    followUser,
    unFollowUser,
    updateUser,
    getAllUsers,
    suggestUsers,
    getUnjoinedUsers,
    searchUsers,
    checkFollow,
    getUserById
} = require('./user.controller');
const { upload } = require('../../config/multerConfig');
const userRouter = express.Router();

// writes the user router

userRouter.post('/userOtpSend', userOtpSend);
userRouter.post('/userOtpVerify', userOtpVerify);
userRouter.post('/followUser', checkToken, followUser);
userRouter.post('/checkFollow', checkToken, checkFollow);
userRouter.post('/unFollowUser', checkToken, unFollowUser);
userRouter.post('/updateUser', checkToken, upload.single('fileUploads'), updateUser);
userRouter.get('/getAllUsers', checkToken, getAllUsers);
userRouter.get('/getUserById', checkToken, getUserById);
userRouter.get('/searchUsers', checkToken, searchUsers);
userRouter.get('/suggestUsers', checkToken, suggestUsers);
userRouter.get('/getUnjoinedUsers/:communityId', checkToken, getUnjoinedUsers);

module.exports = {
    userRouter
};
