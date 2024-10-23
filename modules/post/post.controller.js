const Post = require('./post.model');

// pagenation based post retrieved home page

const getPaginatedPosts = async (req, res, next) => {
    try {
        // *** Get the page number from query params, default to 1 if not provided ****

        let { page, limit } = req.body;
        // do it to int
        page = parseInt(page);
        limit = parseInt(limit);

        // Calculate how many posts to skip for pagination
        const skip = (page - 1) * limit;

        // Fetch the posts with pagination
        const posts = await Post.find({})
            .sort({ createdAt: -1 }) // Sort by most recent
            .skip(skip) // Skip the appropriate number of posts for pagination
            .limit(limit) // Limit the number of posts to 20
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies', // Populate replies within comments
                    model: 'Comment' // Assuming the replies are also stored in the Comment model
                }
            })
            .populate('user', 'userName profilePicture') // Populate user details
            .exec();

        // Send the paginated posts as response
        res.status(200).send({
            status: true,
            message: 'Posts retrieved successfully',
            posts,
            currentPage: page
        });
    } catch (error) {
        console.error('Error retrieving paginated posts:', error);
        next(error); // Pass the error to the error handling middleware
    }
};

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
    getPostByUserId,
    getPaginatedPosts
};
