const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { signIn, signUp, getUserByToken, changePassword } = require('./auth.controller');
const authRouter = express.Router();
const { upload } = require('../../config/multerConfig');

// writes the user router

authRouter.post('/signIn', signIn);
authRouter.post('/signUp', upload.single("fileUploads"), signUp);
authRouter.get('/getUserByToken', checkToken, getUserByToken);
authRouter.put('/changePassword', checkToken, changePassword);

module.exports = {
    authRouter
};
