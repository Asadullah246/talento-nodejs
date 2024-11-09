
// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;
const { OTP_TIME_LIMIT } = require("../../libs/variables");
const Community = require("../community/community.model");
const {
  sendVerificationCode,
} = require("../verification/verification.controller");
const Verification = require("../verification/verification.model");
const User = require("./user.model");
const bcrypt = require("bcrypt");

const userOtpSend = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const verification = await sendVerificationCode(email, next);
    console.log(verification);

    res.send({
      status: true,
      verification,
      message: "user form token",
    });
  } catch ({ message }) {
    next(message);
  }
};

const userOtpVerify = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const dbUserVerificationOtp = await Verification.findOne({ email });
    const { otp: otpUser, createdAt } = dbUserVerificationOtp;
    const currentTime = Date.now();
    console.log(currentTime - createdAt);

    const isValid =
      otp === otpUser && currentTime - createdAt <= OTP_TIME_LIMIT;

    if (isValid) {
      await Verification.deleteOne({ email });

      return res.send({
        status: true,
        message: "Otp verification successful ",
      });
    } else {
      return res.send({
        status: false,
        message: "Invalid Otp ",
      });
    }
  } catch ({ message }) {
    next(message);
  }
};

const followUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body; // Get the user to follow from request params
    const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

    // Ensure the user is not trying to follow themselves
    if (userId === targetUserId) {
      return res
        .status(400)
        .send({ status: false, message: "You can't follow yourself" });
    }

    // Find both the current user and the target user
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res
        .status(404)
        .send({ status: false, message: "User to follow not found" });
    }

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).send({
        status: false,
        message: "You are already following this user",
      });
    }

    // Add target user's ID to the current user's following array
    currentUser.following.push(targetUserId);
    // Add current user's ID to the target user's followers array
    targetUser.followers.push(userId);

    // Save both users
    await currentUser.save();
    await targetUser.save();

    res.status(200).send({
      status: true,
      message: `You are now following ${targetUser.userName}`,
    });
  } catch (error) {
    console.error("Error following user:", error);
    next(error);
  }
};
const checkFollow = async (req, res, next) => {
  try {
    const { targetUserId } = req.body; // Get the user to follow from request params
    const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

    // Ensure the user is not trying to follow themselves
    if (userId === targetUserId) {
      return res
        .status(400)
        .send({ status: false, message: "You can't follow yourself" });
    }

    // Find both the current user and the target user
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res
        .status(404)
        .send({ status: false, message: "User to follow not found" });
    }

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(200).send({
        status: true,
        following: 1,
        message: "You are following this user",
      });
    } else {
      return res.status(200).send({
        status: true,
        following: 0,
        message: "You are not following this user",
      });
    }
  } catch (error) {
    console.error("Error following user:", error);
    next(error);
  }
};


const unFollowUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body; // Get the user to unfollow from request body
    const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

    // Ensure the user is not trying to unfollow themselves
    if (userId === targetUserId) {
      return res.status(400).send({ status: false, message: "You can't unfollow yourself" });
    }

    // Find both the current user and the target user
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser) {
      return res.status(404).send({ status: false, message: "Current user not found" });
    }

    if (!targetUser) {
      return res.status(404).send({ status: false, message: "User to unfollow not found" });
    }

    // Check if the user is following the target user
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).send({ status: false, message: "You are not following this user" });
    }

    // Remove target user's ID from the current user's following array
    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(targetUserId)
    );

    // Remove current user's ID from the target user's followers array
    targetUser.followers = targetUser.followers.filter(
      (id) => !id.equals(userId)
    );

    // Save both users
    await Promise.all([currentUser.save(), targetUser.save()]); // Use Promise.all to save both users concurrently

    res.status(200).send({
      status: true,
      message: `You have unfollowed ${targetUser.userName}`,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    next(error);
  }
};


// const unFollowUser = async (req, res, next) => {
//   try {
//     const { targetUserId } = req.body; // Get the user to unfollow from request params
//     const userId = req.tokenPayLoad._id; // Get the current user's ID from the token payload

//     // Ensure the user is not trying to unfollow themselves
//     if (userId === targetUserId) {
//       return res
//         .status(400)
//         .send({ status: false, message: "You can't unfollow yourself" });
//     }

//     // Find both the current user and the target user
//     const currentUser = await User.findById(userId);
//     const targetUser = await User.findById(targetUserId);

//     if (!targetUser) {
//       return res
//         .status(404)
//         .send({ status: false, message: "User to unfollow not found" });
//     }

//     // Check if the user is following the target user
//     if (!currentUser.following.includes(targetUserId)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "You are not following this user" });
//     }

//     // Remove target user's ID from the current user's following array
//     currentUser.following = currentUser.following.filter(
//       (id) => id.toString() !== targetUserId
//     );
//     // Remove current user's ID from the target user's followers array
//     // targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

//     targetUser.followers = targetUser.followers.filter(
//       (id) => !id.equals(userId)
//     );

//     // Save both users
//     await currentUser.save();
//     await targetUser.save();

//     res.status(200).send({
//       status: true,
//       message: `You have unfollowed ${targetUser.userName}`,
//     });
//   } catch (error) {
//     console.error("Error unfollowing user:", error);
//     next(error);
//   }
// };

const updateUser = async (req, res, next) => {
  try {
    const userId = req.tokenPayLoad._id; // Get the current user's ID from token payload
    const { userName, bio, password , fileType} = req.body;

    console.log("redbody", req.body);

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Check if email is being updated and if it's unique
    // if (email && email !== user.email) {
    //   const emailExists = await User.findOne({ email });
    //   if (emailExists) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Email already in use" });
    //   }
    //   user.email = email; // Update the email
    // }

    // Update userName if provided
    if (userName) {
      user.userName = userName;
    }
    if (bio) {
      user.bio = bio;
    }

    // Update password if provided and hash the new password
    if (password) {
      if (password.length < 6) {
        return res.status(400).send({
          status: false,
          message: "Password must be at least 6 characters long",
        });
      }

      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    let profilePic = "";

    console.log("red fiel", req?.file);

    if (req.file) {
      const fileUrl = req.file.location;
      if (fileType === "image") {
        profilePic = fileUrl;
      }
      //  else if (fileType === "video") {
      //   videoUrl = fileUrl;
      // }
    }

    user.profilePicture = profilePic;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .send({ status: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error); // Pass error to next middleware
  }
};

const ignorePost = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.tokenPayLoad._id;

  if (!userId || !postId) {
    return res.status(400).json({ message: "User ID and Post ID are required" });
  }

  try {
    // Find the user and update their postIgnoreList
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("userid", userId);
    console.log("pst id", postId);
console.log("user in out", user);
    // Check if the post is already ignored, and add it if not
    if (!user.postIgnoreList.includes(postId)) {
      console.log("working user in changing", user);
      user.postIgnoreList.push(postId);
      await user.save();
    }

    res.status(200).json({ message: "Post ignored successfully", postIgnoreList: user.postIgnoreList });
  } catch (error) {
    console.error("Error ignoring post:", error);
    res.status(500).json({ message: "An error occurred while ignoring the post" });
  }
};

// const getAllUsers = async (req, res, next) => {
//     try {
//         const userId = req.tokenPayLoad._id; // Get the logged-in user's ID

//         // Retrieve all users excluding the current user
//         const users = await User.find({
//             _id: { $ne: userId } // Exclude the current user by using $ne (not equal)
//         });

//         // Return the users in the response
//         res.status(200).send({
//             status: true,
//             users
//         });
//     } catch (error) {
//         console.error('Error retrieving users:', error);
//         next(error); // Pass error to the error handler middleware
//     }
// };

const getAllUsers = async (req, res, next) => {
  try {
    // const { userId } = req.body;
    const { page = 1, limit = 50, userId } = req.query;
    // console.log("req query", req.query);
    if (userId !== req.tokenPayLoad._id.toString()) {
      res.send({
        status: false,
        message: "Invalid User !",
      });
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const postDb = await User.find({ _id: { $ne: userId } })
      .skip(skip)
      .limit(Number(limit));
    //   .populate('user', 'userName profilePicture');

    if (!postDb || postDb.length === 0) {
      console.log("no data found");
      return res.send({
        status: false,
        message: "Not found any post",
      });
    }
    const totalPosts = await User.countDocuments({});
    const totalPages = Math.ceil(totalPosts / limit);
    console.log("sending data");
    res.send({
      status: true,
      users: postDb,
      totalPages,
      currentPage: Number(page),
      message: "Post retrieved successfully",
    });
  } catch ({ message }) {
    console.log("message", message);
    next(message);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId, specialId } = req.query;
    // console.log("que", req.query);

    // if (!ObjectId.isValid(specialId)) {
    //   return res.status(400).send({ status: false, message: "Invalid ID format" });
    // }

    // console.log("speci", ObjectId(specialId));
    // Validate the userId
    if (userId !== req.tokenPayLoad._id.toString()) {
      return res.send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Find the post by its ID and populate the user field
    const postDb = await User.findOne({ _id: specialId }) ;
// console.log("post db", postDb);
    // Check if post exists
    if (!postDb) {
      return res.send({
        status: false,
        message: "Not found any user",
      });
    }

    // Send the post with the populated user details
    res.send({
      status: true,
      user: postDb,
      message: "Post retrieved successfully",
    });
  } catch ({ message }) {
    next(message);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    console.log("query is ", query);

    // Search for users by name or other criteria
    const users = await User.find({
      userName: { $regex: query, $options: "i" },
    }).select("userName profilePicture");

    res.status(200).send({ status: true, users });
  } catch (error) {
    console.error("Error searching users:", error);
    next(error);
  }
};

const getUnjoinedUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId, specialId } = req.query;
    console.log("req, quer", req.query);
    if (!specialId) {
      return res.status(400).send({
        status: false,
        message: "Community ID is required",
      });
    }
    console.log("passed special id", specialId);
    if (userId !== req.tokenPayLoad._id.toString()) {
      return res.send({
        status: false,
        message: "Invalid User!",
      });
    }
    console.log("passed user id", userId);
    // Get the current user to retrieve their followers
    const currentUser = await User.findById(userId).select("followers");

    if (!currentUser) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    console.log("passed current user", currentUser);
    // Find the community and get lists of associated user IDs
    const community = await Community.findById(specialId);
    if (!community) {
      return res.status(404).send({
        status: false,
        message: "Community not found",
      });
    }
    console.log("passed community", community);

    // Collect IDs of users to exclude (already in the community or invited)
    const excludedUserIds = [
      ...community.communityAdmin,
      ...community.communityModerator,
      ...community.communityPeople,
      ...community.invitedPeople,
      userId, // Exclude the current user as well
    ];

    // Separate followers from non-followers in the unjoined user list
    const followers = await User.find({
      _id: { $in: currentUser.followers, $nin: excludedUserIds },
    });
    console.log("passed followers", followers);
    console.log("current followers ", currentUser.followers);
    const nonFollowers = await User.find({
      _id: { $nin: [...excludedUserIds, ...currentUser.followers] },
    });
    console.log("passed followers", followers);
    // Randomize both followers and non-followers lists
    const randomizeArray = (arr) => arr.sort(() => Math.random() - 0.5);
    const randomizedFollowers = randomizeArray(followers);
    const randomizedNonFollowers = randomizeArray(nonFollowers);

    // Combine followers first, then other users
    const combinedUsers = [...randomizedFollowers, ...randomizedNonFollowers];

    // Pagination logic (slice the combined array)
    const startIndex = (page - 1) * limit;
    const paginatedUsers = combinedUsers.slice(startIndex, startIndex + limit);

    // Calculate total pages based on combinedUsers array
    const totalPages = Math.ceil(combinedUsers.length / limit);

    //   console.log("data is ", paginatedUsers);

    res.send({
      status: true,
      communities: paginatedUsers,
      totalPages,
      currentPage: Number(page),
      message: "Unjoined users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching unjoined users:", error);
    next(error);
  }
};

const suggestUsers = async (req, res, next) => {
  try {
    const userId = req.tokenPayLoad._id; // Get the current logged-in user ID

    // Find the current user to get their following array
    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Fetch users who are not followed by the current user and not the current user themselves
    const suggestedUsers = await User.find({
      _id: { $nin: [...currentUser.following, userId] }, // Exclude the current user and following users
    }).select("userName email profilePicture"); // Select fields you want to return

    res.status(200).send({
      status: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.error("Error suggesting users:", error);
    next(error);
  }
};
// const followingAndFollowers = async (req, res, next) => {
//   try {
//     const userId = req.tokenPayLoad._id; // Get the current logged-in user ID

//     // Find the current user and populate the following and followers arrays
//     const currentUser = await User.findById(userId)
//       .select("following followers") // Select only following and followers fields
//       .populate({
//         path: "following",
//         select: "userName profilePicture bio"
//       })
//       .populate({
//         path: "followers",
//         select: "userName profilePicture bio"
//       });

//     if (!currentUser) {
//       return res.status(404).send({ status: false, message: "User not found" });
//     }

//     // Prepare arrays for following and followers with selected fields
//     const following = currentUser.following.map(user => ({
//       userId: user._id,
//       userName: user.userName,
//       profilePicture: user.profilePicture
//     }));

//     const followers = currentUser.followers.map(user => ({
//       userId: user._id,
//       userName: user.userName,
//       profilePicture: user.profilePicture
//     }));

//     res.status(200).send({
//       status: true,
//       following,
//       followers,
//     });
//   } catch (error) {
//     console.error("Error suggesting users:", error);
//     next(error);
//   }
// };

const followingAndFollowers = async (req, res, next) => {
  try {
    // const userId = req.tokenPayLoad._id; // Get the current logged-in user ID
    const currentUserId = req.tokenPayLoad._id; // Get the current logged-in user ID
    // const {specialId}=req.query;
    const { specialId: userId } = req.query;


    // Find the current user and populate the following and followers arrays
    const currentUser = await User.findById(userId)
      .select("following followers") // Select only following and followers fields
      .populate({
        path: "following",
        select: "userName profilePicture bio"
      })
      .populate({
        path: "followers",
        select: "userName profilePicture bio"
      });
    const currentUserData = await User.findById(currentUserId);
      // .select("following followers") // Select only following and followers fields
      // .populate({
      //   path: "following",
      //   select: "userName profilePicture bio"
      // })
      // .populate({
      //   path: "followers",
      //   select: "userName profilePicture bio"
      // });

    if (!currentUser) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Prepare arrays for following and followers with selected fields
    const following = currentUser.following.map(user => ({
      userId: user._id,
      bio:user?.bio,
      userName: user.userName,
      profilePicture: user.profilePicture,
      followStatus: currentUserData.following.some(follower => follower.equals(user._id))
    }));

    const followers = currentUser.followers.map(user => ({
      userId: user._id,
      bio:user?.bio,
      userName: user.userName,
      profilePicture: user.profilePicture,
      followStatus: currentUserData.following.some(following => following.equals(user._id))
    }));
    // const following = currentUser.following.map(user => ({
    //   userId: user._id,
    //   bio:user?.bio,
    //   userName: user.userName,
    //   profilePicture: user.profilePicture,
    //   followMe: currentUserData.followers.some(follower => follower.equals(user._id))
    // }));

    // const followers = currentUser.followers.map(user => ({
    //   userId: user._id,
    //   bio:user?.bio,
    //   userName: user.userName,
    //   profilePicture: user.profilePicture,
    //   followHim: currentUserData.following.some(following => following.equals(user._id))
    // }));

    res.status(200).send({
      status: true,
      following,
      followers,
    });
  } catch (error) {
    console.error("Error suggesting users:", error);
    next(error);
  }
};



module.exports = {
  userOtpSend,
  userOtpVerify,
  followUser,
  unFollowUser,
  updateUser,
  getAllUsers,
  suggestUsers,
  getUnjoinedUsers,
  searchUsers,
  checkFollow,
  getUserById,
  followingAndFollowers,
  ignorePost
};
