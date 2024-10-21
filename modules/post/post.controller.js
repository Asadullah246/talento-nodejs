const Post = require('./post.model');

const getPostByUserId = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (userId !== req.tokenPayLoad._id.toString()) {
            res.send({
                status: false,

                message: 'Invalid User !'
            });
        }

        const postDb = await Post.find({ user: userId });
        if (!postDb) {
            res.send({
                status: false,
                message: 'Not found any post'
            });
        } else {
            res.send({
                status: true,
                posts: postDb,
                message: 'Post retrieved success'
            });
        }
    } catch ({ message }) {
        next(message);
    }
};

const createPost = async (req, res, next) => {
    try {
        const { userId, description } = req.body;
        // console.log(req.tokenPayLoad._id.toString() === userId);
        // console.log(0);

        if (userId !== req.tokenPayLoad._id.toString()) {
            res.send({
                status: false,

                message: 'Invalid User !'
            });
        }
        // more validation for storage here
        // console.log(1);

        const createPostNew = await Post.create({ user: userId, description: description });

        res.send({
            status: true,
            post: createPostNew,
            message: 'user form token'
        });
    } catch ({ message }) {
        next(message);
    }
};

const deletePostByUserIdPostId = async (req, res, next) => {
    try {
        const { userId, postId } = req.body;

        if (userId !== req.tokenPayLoad._id.toString()) {
            res.send({
                status: false,

                message: 'Invalid User !'
            });
        }

        const postDb = await Post.find({ user: userId, post: postId });
        if (!postDb) {
            res.send({
                status: false,

                message: 'Invalid userId or PostId'
            });
        } else {
            await Post.findByIdAndDelete(postId);
            res.send({
                status: true,

                message: 'Post deleted success'
            });
        }
    } catch ({ message }) {
        next(message);
    }
};

module.exports = {
    deletePostByUserIdPostId,
    createPost,
    getPostByUserId
};
