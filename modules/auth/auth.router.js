const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { signIn, signUp, getUserByToken, changePassword } = require('./auth.controller');
const authRouter = express.Router();

// writes the user router

authRouter.post('/signIn', signIn);
authRouter.post('/signUp', signUp);
authRouter.get('/getUserByToken', getUserByToken);
authRouter.put('/changePassword', checkToken, changePassword);

module.exports = {
    authRouter
};
