const Post = require('../post/post.model');
const Comment = require('./comment.model');

const createComment = async (req, res, next) => {
    try {
        const { postId, commentContent } = req.body;
        console.log(postId, commentContent);
        const userId = req.tokenPayLoad._id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ status: false, message: 'Post not found' });
        }

        // Create a new comment
        const comment = await Comment.create({
            commentContent: commentContent,
            user: userId,
            post: postId
        });

        // Push the comment ID to the post's comments array
        post.comments.push(comment._id);
        await post.save(); // Save the post to reflect changes

        res.status(201).send({ status: true, comment });
    } catch (error) {
        next(error);
    }
};

// Update a comment (only by the comment owner)
const updateComment = async (req, res, next) => {
    try {
        const { commentId, newContent } = req.body;
        const userId = req.tokenPayLoad._id;

        // Find the comment and ensure the user is the owner
        const comment = await Comment.findOne({ _id: commentId, user: userId });
        if (!comment) {
            return res
                .status(403)
                .send({ status: false, message: 'Unauthorized to update this comment' });
        }

        // Update the comment content
        comment.commentContent = newContent;
        await comment.save();

        res.status(200).send({ status: true, comment });
    } catch (error) {
        next(error);
    }
};

// reply to comment
const replyToComment = async (req, res, next) => {
    try {
        const { commentId, replyContent } = req.body;
        console.log(commentId, replyContent);
        const userId = req.tokenPayLoad._id;

        // Find the parent comment
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).send({ status: false, message: 'Comment not found' });
        }

        // Create a reply (as a new comment)
        const replyComment = await Comment.create({
            commentContent: replyContent,
            user: userId,
            post: parentComment.post // Associate reply with the same post as parent
        });

        // Add the reply comment's _id to the parent comment's replies array
        parentComment.replies.push(replyComment._id);
        await parentComment.save();

        res.status(201).send({ status: true, replyComment });
    } catch (error) {
        next(error);
    }
};

const deleteCommentFromPost = async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const userId = req.tokenPayLoad._id;

        // Find the comment and ensure the user is the owner
        const comment = await Comment.findOne({ _id: commentId, user: userId });
        console.log(comment, '??');

        if (!comment) {
            return res.status(403).send({
                status: false,
                message: 'Unauthorized to delete this comment or comment not found'
            });
        }

        // Find the associated post and remove the comment ID from its comments array
        await Post.updateOne(
            { _id: comment.post },
            { $pull: { comments: commentId } } // Remove the comment from the post's comments array
        );

        // Remove all replies associated with this comment
        await Comment.deleteMany({ _id: { $in: comment.replies } });

        // Delete the comment itself
        await Comment.deleteOne({ _id: commentId });

        res.status(200).send({
            status: true,
            message: 'Comment and its associated replies deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment and its replies:', error);
        next(error);
    }
};

const deleteReplyOfComment = async (req, res, next) => {
    try {
        const { commentId, replyId } = req.body; // commentId: parent comment, replyId: reply to be deleted
        const userId = req.tokenPayLoad._id;

        // Find the reply and ensure the user is the owner
        const reply = await Comment.findOne({ _id: replyId, user: userId });

        if (!reply) {
            return res.status(403).send({
                status: false,
                message: 'Unauthorized to delete this reply or reply not found'
            });
        }

        // Find the parent comment and remove the reply ID from its replies array
        await Comment.updateOne(
            { _id: commentId },
            { $pull: { replies: replyId } } // Remove the reply from the replies array of the parent comment
        );

        // Delete the reply itself
        await Comment.deleteOne({ _id: replyId });

        res.status(200).send({ status: true, message: 'Reply deleted successfully' });
    } catch (error) {
        console.error('Error deleting reply:', error);
        next(error);
    }
};
module.exports = {
    createComment,
    updateComment,
    deleteCommentFromPost,
    replyToComment,
    deleteReplyOfComment
};
