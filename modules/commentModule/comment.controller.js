const Comment = require('./comment.model');
const Post = require('../post/post.model');
const Notification = require('../notification/notification.model');

// Create a top-level comment or a reply
const createComment = async (req, res, next) => {
    try {
        const { postId, commentContent, parentCommentId } = req.body;
        const userId = req.tokenPayLoad._id;

        // Ensure the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ status: false, message: 'Post not found' });
        }

        // Create the comment (or reply if parentCommentId is provided)
        const comment = await Comment.create({
            commentContent,
            user: userId,
            post: postId,
            parentComment: parentCommentId || null // If parentCommentId is provided, it's a reply
        });

        // If it's a reply, add a notification for the original comment's author
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId).populate('user');
            await Notification.create({
                recipient: parentComment.user,
                sender: userId,
                notificationType: 'reply',
                post: postId,
                message: `replied to your comment: "${parentComment.commentContent.substring(0, 20)}..."`,
                comment: parentCommentId
            });
        } else {
            // Otherwise, it's a new comment on the post, so notify the post's author
            await Notification.create({
                recipient: post.user,
                sender: userId,
                notificationType: 'comment',
                post: postId,
                message: `commented on your post: "${post.description.substring(0, 20)}..."`,
            });
        }

        res.status(201).send({ status: true, comment });
    } catch (error) {
        next(error);
    }
};

// Update a comment
const updateComment = async (req, res, next) => {
    try {
        const { commentId, newContent } = req.body;
        const userId = req.tokenPayLoad._id;

        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, user: userId },
            { commentContent: newContent },
            { new: true }
        );

        if (!comment) {
            return res.status(403).send({ status: false, message: 'Unauthorized or comment not found' });
        }

        res.status(200).send({ status: true, comment });
    } catch (error) {
        next(error);
    }
};

// Delete a comment or reply
const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const userId = req.tokenPayLoad._id;

        // Find the comment and ensure the user is the owner
        const comment = await Comment.findOne({ _id: commentId, user: userId });
        if (!comment) {
            return res.status(403).send({
                status: false,
                message: 'Unauthorized to delete this comment or comment not found'
            });
        }

        // Delete the comment itself
        await Comment.deleteOne({ _id: commentId });

        // If it was a top-level comment, delete all its replies
        await Comment.deleteMany({ parentComment: commentId });

        res.status(200).send({ status: true, message: 'Comment and its replies deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Fetch top-level comments with pagination
const getTopLevelComments = async (req, res, next) => {
    try {
        const { specialId, page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;
        console.log("req query", req.query);

        const comments = await Comment.find({ post: specialId, parentComment: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'userName profilePicture');

        const totalComments = await Comment.countDocuments({ post: specialId, parentComment: null });
        const totalPages = Math.ceil(totalComments / limit);
console.log("setding top commetn", comments);
        res.status(200).send({
            status: true,
            comments,
            pagination: {
                currentPage: Number(page),
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};

// Fetch replies for a specific comment with pagination
const getReplies = async (req, res, next) => {
    try {
        const { specialId, page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        const replies = await Comment.find({ parentComment: specialId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'username profilePicture');

        const totalReplies = await Comment.countDocuments({ parentComment: specialId });
        const totalPages = Math.ceil(totalReplies / limit);
console.log("reply data", replies);
        res.status(200).send({
            status: true,
            replies,
            pagination: {
                currentPage: Number(page),
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};

const populateRepliesRecursively = async (comments) => {
    const populatedComments = await Comment.populate(comments, { path: 'replies' });
    for (const comment of populatedComments) {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = await populateRepliesRecursively(comment.replies);
      }
    }
    return populatedComments;
  };
  const getAllCommentsWithReplies = async (req, res, next) => {
    try {
      const { specialId, page = 1, limit = 50 } = req.query;

      // Fetch top-level comments without replies first
      let comments = await Comment.find({ post: specialId, parentComment: null })
        .limit(limit)
        .skip((page - 1) * limit);

      // Recursively populate all levels of replies
      comments = await populateRepliesRecursively(comments);

      res.status(200).json({ status: true, comments });
    } catch (error) {
      console.error('Error fetching comments with replies:', error);
      next(error);
    }
  }; 


module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getTopLevelComments,
    getReplies,
    getAllCommentsWithReplies
};
