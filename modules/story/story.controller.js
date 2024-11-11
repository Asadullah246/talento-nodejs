const Story = require("./story.model");
const User = require("../user/user.model");

// Function to create a new story
const createStory = async (req, res, next) => {
  try {
    const { userId, fileType } = req.body;
    const currentUserId = req.tokenPayLoad._id.toString();

    // Validate user ID
    if (userId !== currentUserId) {
      return res.status(403).send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Check if a file was uploaded and set the URL accordingly
    let imageUrl = "";
    let videoUrl = "";

    if (req.file) {
      const fileUrl = req.file.location;
      if (fileType === "image") {
        imageUrl = fileUrl;
      } else if (fileType === "video") {
        videoUrl = fileUrl;
      }
    } else {
      return res.status(400).send({ status: false, message: "No file uploaded" });
    }

    // Create a new story
    const newStory = await Story.create({
      user: userId,
      imageUrl,
      videoUrl,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    res.status(201).send({ 
      status: true,
      story: newStory,
      message: "Story created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Function to get all stories for a user
const getUserStories = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const currentUserId = req.tokenPayLoad._id.toString();

    if (userId !== currentUserId) {
      return res.status(403).send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Retrieve all stories for the user that haven't expired
    const stories = await Story.find({ user: userId, expiresAt: { $gt: Date.now() } })
      .sort({ createdAt: -1 })
      .populate("user", "userName profilePicture");

    res.status(200).send({
      status: true,
      stories,
      message: "Stories retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Function to get all active stories (for a story feed)
const getAllStories = async (req, res, next) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: Date.now() } })
      .sort({ createdAt: -1 })
      .populate("user", "userName profilePicture");

    res.status(200).send({
      status: true,
      stories,
      message: "All stories retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Function to delete expired stories (can be scheduled as a cron job)
const deleteExpiredStories = async (req, res, next) => {
  try {
    const result = await Story.deleteMany({ expiresAt: { $lte: Date.now() } });
    res.status(200).send({
      status: true,
      deletedCount: result.deletedCount,
      message: "Expired stories deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStory,
  getUserStories,
  getAllStories,
  deleteExpiredStories,
};
