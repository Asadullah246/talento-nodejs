const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createPost,
    getPostByUserId,
    deletePostByUserIdPostId,
    getPaginatedPosts,
    getPost,
    getPostById,
    getPostsById,
    sharePost,
    getPostsByIdOfCommunity
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


postRouter.post('/sharePost', checkToken, sharePost );
postRouter.get('/getPostByUserId', checkToken, getPostByUserId);
postRouter.get('/getPost', checkToken, getPost);
postRouter.get('/getPostById', checkToken, getPostById);
postRouter.get('/getPostsById', checkToken, getPostsById);
postRouter.get('/getPostsByIdOfCommunity', checkToken, getPostsByIdOfCommunity);
postRouter.delete('/deletePostByUserIdPostId', checkToken, deletePostByUserIdPostId);
postRouter.get('/getPaginatedPosts', checkToken, getPaginatedPosts);

module.exports = {
    postRouter
};
