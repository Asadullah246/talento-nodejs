
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    commentContent: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);



// Create the Comment model
const Comment = mongoose.model('CommentSchema', commentSchema);

module.exports = Comment;
