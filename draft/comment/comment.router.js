const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createComment,
    updateComment,

    replyToComment,
    deleteCommentFromPost,
    deleteReplyOfComment
} = require('./comment.controller');

const commentRouter = express.Router();

// writes the user router

commentRouter.post('/createComment', checkToken, createComment);
commentRouter.put('/updateComment', checkToken, updateComment);

// replies
commentRouter.post('/replyToComment', checkToken, replyToComment);

// delete comment from post
commentRouter.delete('/deleteCommentFromPost', checkToken, deleteCommentFromPost);
// delete reply of comment
commentRouter.delete('/deleteReplyOfComment', checkToken, deleteReplyOfComment);

module.exports = {
    commentRouter
};
