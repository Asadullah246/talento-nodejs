// external module imports
const express = require('express');
const app = express();
const cors = require('cors'); // cors
const { authRouter } = require('./modules/auth/auth.router');
const { userRouter } = require('./modules/user/user.router');
const { postRouter } = require('./modules/post/post.router');
// const { commentRouter } = require('./modules/comment/comment.router');
const { commentRouter } = require('./modules/commentModule/comment.router');
const { communityRouter } = require('./modules/community/community.router');
const { likeRouter } = require('./modules/like/like.router');
const { notificationRouter } = require('./modules/notification/notification.router');
require('dotenv').config(); // req for access dot env file

// application level middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// case sensitive routing
app.enable('case sensitive routing');

// home route
app.get('/', (req, res) => {
    res.send('home route');
});

// public routes

// auth router
app.use('/auth', authRouter);
// user router
app.use('/user', userRouter);
// post route
app.use('/post', postRouter);
// comment route
app.use('/comment', commentRouter);
// like router
app.use('/like', likeRouter);
// community router
app.use('/community', communityRouter);
// notification
app.use('/notification', notificationRouter);

// not found any route error : 404
app.use((req, res, next) => {
    console.log('no route found!');
    res.send({
        status: false,
        message: 'No route Found '
    });
});

// final error handling  middleware error : 500

app.use((error, req, res, next) => {
    console.log('last middleware ', error.message);
    res.status(error.status || 500).json({
        status: false,
        message: error.message
    });
});

module.exports = app;
