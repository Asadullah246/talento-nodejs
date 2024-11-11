const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // Story expires in 24 hours
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
