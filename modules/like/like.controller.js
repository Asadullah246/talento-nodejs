const Comment = require('../comment/comment.model');
const Post = require('../post/post.model');

const likePost = async (req, res, next) => {
    try {
        const { postId } = req.body; // Get postId from request parameters
        const userId = req.tokenPayLoad._id; // Get userId from token payload

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ status: false, message: 'Post not found' });
        }

        // Check if the user already liked the post
        const index = post.likes.indexOf(userId);
        if (index !== -1) {
            // User already liked the post, remove the like
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).send({ status: true, message: 'Post unliked successfully' });
        } else {
            // User has not liked the post, add the like
            post.likes.push(userId);
            await post.save();
            return res.status(200).send({ status: true, message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error('Error liking post:', error);
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const { commentId } = req.body; // Get commentId from request parameters
        const userId = req.tokenPayLoad._id; // Get userId from token payload

        // Check if the comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ status: false, message: 'Comment not found' });
        }

        // Check if the user already liked the comment
        const index = comment.likes.indexOf(userId);
        if (index !== -1) {
            // User already liked the comment, remove the like
            comment.likes.splice(index, 1);
            await comment.save();
            return res.status(200).send({ status: true, message: 'Comment unliked successfully' });
        } else {
            // User has not liked the comment, add the like
            comment.likes.push(userId);
            await comment.save();
            return res.status(200).send({ status: true, message: 'Comment liked successfully' });
        }
    } catch (error) {
        console.error('Error liking comment:', error);
        next(error);
    }
};

module.exports = {
    likePost,
    likeComment
};
