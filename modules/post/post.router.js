const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { createPost, getPostByUserId, deletePostByUserIdPostId } = require('./post.controller');

const postRouter = express.Router();

// writes the user router

postRouter.post('/createPost', checkToken, createPost);
postRouter.get('/getPostByUserId', checkToken, getPostByUserId);
postRouter.delete('/deletePostByUserIdPostId', checkToken, deletePostByUserIdPostId);

module.exports = {
    postRouter
};
