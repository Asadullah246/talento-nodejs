const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { likePost, likeComment } = require('./like.controller');

const likeRouter = express.Router();

// writes the user router
likeRouter.post('/likePost', checkToken, likePost);
likeRouter.post('/likeComment', checkToken, likeComment);

module.exports = {
    likeRouter
};
