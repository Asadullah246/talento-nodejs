const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createComment,
    updateComment,
    deleteComment,
    getTopLevelComments,
    getReplies,
    getAllCommentsWithReplies,
    getCommentCount
} = require('./comment.controller');

const commentRouter = express.Router();

// Create a new comment (or reply if parentCommentId is provided)
commentRouter.post('/create', checkToken, createComment);

// Update a comment
commentRouter.put('/update', checkToken, updateComment);

// Delete a comment (and associated replies if it's a top-level comment)
commentRouter.delete('/delete', checkToken, deleteComment);

// Get top-level comments for a post with pagination
commentRouter.get('/topLevelComments', checkToken, getTopLevelComments);

// Get replies for a specific comment with pagination
commentRouter.get('/replies', checkToken, getReplies);
commentRouter.get('/getAllComments', checkToken, getAllCommentsWithReplies);
commentRouter.get('/getCommentCount', checkToken, getCommentCount ); 

module.exports = {
    commentRouter
};
