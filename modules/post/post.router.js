const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createPost,
    getPostByUserId,
    deletePostByUserIdPostId,
    getPaginatedPosts
} = require('./post.controller');
const { upload } = require('../../config/multerConfig');
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const postRouter = express.Router();

// writes the user router

// postRouter.post('/createPost', checkToken, upload.single("file"), createPost);
postRouter.post('/createPost', checkToken, upload.single('fileUploads'), (req, res, next) => {
    console.log("Upload middleware triggered on route /createPost"); // Verifies middleware is triggered
    next();
  }, createPost);


postRouter.get('/getPostByUserId', checkToken, getPostByUserId);
postRouter.delete('/deletePostByUserIdPostId', checkToken, deletePostByUserIdPostId);
postRouter.get('/getPaginatedPosts', checkToken, getPaginatedPosts);

module.exports = {
    postRouter
};
