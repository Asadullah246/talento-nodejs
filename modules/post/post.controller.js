const User = require("../user/user.model");
const Post = require("./post.model");

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
        path: "comments",
        populate: {
          path: "replies", // Populate replies within comments
          model: "Comment", // Assuming the replies are also stored in the Comment model
        },
      })
      .populate("user", "userName profilePicture") // Populate user details
      .exec();

    // Send the paginated posts as response
    res.status(200).send({
      status: true,
      message: "Posts retrieved successfully",
      posts,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving paginated posts:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

const getPostByUserId = async (req, res, next) => {
  try {
    // const { specialId } = req.query;
    const userId = req.tokenPayLoad._id;
    // if (userId !== req.tokenPayLoad._id.toString()) {
    //   res.send({
    //     status: false,

    //     message: "Invalid User !",
    //   });
    // }
    const postDb = await Post.find({ user: userId });

    if (!postDb) {
      res.send({
        status: false,
        message: "Not found any post",
      });
    } else {
      res.send({
        status: true,
        posts: postDb,
        message: "Post retrieved success",
      });
    }
  } catch ({ message }) {
    next(message);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { specialId, userId } = req.query;

    // Validate the userId
    if (userId !== req.tokenPayLoad._id.toString()) {
      return res.send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Find the post by its ID and populate the user field
    const postDb = await Post.findOne({ _id: specialId }).populate(
      "user",
      "_id userName profilePicture"
    ); // Populate user field with userName and profilePicture

    // Check if post exists
    if (!postDb) {
      return res.send({
        status: false,
        message: "Not found any post",
      });
    }

    // Send the post with the populated user details
    res.send({
      status: true,
      post: postDb,
      message: "Post retrieved successfully",
    });
  } catch ({ message }) {
    next(message);
  }
};


const getPostsById = async (req, res, next) => {
  try {
    const { specialId, userId } = req.query;

    // Validate the userId
    if (userId !== req.tokenPayLoad._id.toString()) {
      return res.send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Fetch posts with videoUrl first, then imageUrl, then others, all sorted by latest to oldest

    const postsWithVideo = await Post.find({
      user: specialId,
      videoUrl: { $exists: true, $ne: null, $ne: "" },
    }).sort({ createdAt: -1 });
    const postsWithImage = await Post.find({
      user: specialId,
      $and: [
        {
          $or: [
            { videoUrl: { $exists: false } },
            { videoUrl: null },
            { videoUrl: "" },
          ],
        },
        {
          imageUrl: { $exists: true, $ne: null, $ne: "" },
        },
      ],
    }).sort({ createdAt: -1 });

    const otherPosts = await Post.find({
      user: specialId,
      $and: [
        {
          $or: [
            { videoUrl: { $exists: false } },
            { videoUrl: null },
            { videoUrl: "" },
          ],
        },
        {
          $or: [
            { imageUrl: { $exists: false } },
            { imageUrl: null },
            { imageUrl: "" },
          ],
        },
      ],
    }).sort({ createdAt: -1 });


    // Combine all posts
    const postDb = [...postsWithVideo, ...postsWithImage, ...otherPosts];


    // get in simple way

    // const postDb = await Post.find({ user: specialId });

    // Check if posts exist
    if (postDb.length === 0) {
      return res.send({
        status: false,
        message: "Not found any post",
      });
    }

    // Send the post with the populated user details
    res.send({
      status: true,
      posts: postDb,
      message: "Post retrieved successfully",
    });
  } catch ({ message }) {
    next(message);
  }
};


// const getPost = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 50, userId } = req.query;
//     // console.log("req query", req.query);

//     // Validate if the user ID in the request matches the authenticated user's ID
//     if (userId !== req.tokenPayLoad._id.toString()) {
//       return res.status(403).send({
//         status: false,
//         message: "Invalid User!",
//       });
//     }

//     // Find the user and retrieve their postIgnoreList
//     const user = await User.findById(userId).select('postIgnoreList');
//     if (!user) {
//       return res.status(404).send({
//         status: false,
//         message: "User not found",
//       });
//     }
//     // console.log("user is", user);
//     // Calculate pagination
//     const skip = (page - 1) * limit;

//     // Fetch posts excluding those in the postIgnoreList and sorting by latest first
//     const postDb = await Post.find({ _id: { $nin: user.postIgnoreList } })
//       .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//       .skip(skip)
//       .limit(Number(limit))
//       .populate("user", "userName profilePicture");

//       // console.log("posts", postDb);
//     if (!postDb || postDb.length === 0) {
//       return res.send({
//         status: false,
//         message: "No posts found",
//       });
//     }

//     // Total posts count excluding ignored posts
//     const totalPosts = await Post.countDocuments({ _id: { $nin: user.postIgnoreList } });
//     const totalPages = Math.ceil(totalPosts / limit);

//     res.send({
//       status: true,
//       posts: postDb,
//       totalPages,
//       currentPage: Number(page),
//       message: "Posts retrieved successfully",
//     });

//   } catch (error) {
//     next(error.message);
//   }
// };


const getPost = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId } = req.query;

    // Validate if the user ID in the request matches the authenticated user's ID
    if (userId !== req.tokenPayLoad._id.toString()) {
      return res.status(403).send({
        status: false,
        message: "Invalid User!",
      });
    }

    // Find the user and retrieve their postIgnoreList
    const user = await User.findById(userId).select('postIgnoreList');
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch posts excluding those in the postIgnoreList and sorting by latest first
    const posts = await Post.find({ _id: { $nin: user.postIgnoreList } })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "userName profilePicture");

    if (!posts || posts.length === 0) {
      return res.send({
        status: false,
        message: "No posts found",
      });
    }

    // Add user-specific data (liked and shared status) for each post
    const postsWithUserInfo = posts.map(post => {
      // Check if the user has liked the post
      const userLiked = post.likes.includes(userId) ? 1 : 0;

      // Check if the user has shared the post
      const userShared = post.shared.includes(userId) ? 1 : 0;

      return {
        ...post.toObject(), // Convert Mongoose document to plain object
        userLiked,
        userShared,
      };
    });

    // Total posts count excluding ignored posts
    const totalPosts = await Post.countDocuments({ _id: { $nin: user.postIgnoreList } });
    const totalPages = Math.ceil(totalPosts / limit);

    res.send({
      status: true,
      posts: postsWithUserInfo,
      totalPages,
      currentPage: Number(page),
      message: "Posts retrieved successfully",
    });

  } catch (error) {
    next(error.message);
  }
};









const createPost = async (req, res, next) => {
  try {
    const { userId, description, fileType } = req.body;
    // console.log("body", req.body) ;
    console.log(req.tokenPayLoad._id.toString() === userId);
    // console.log(0);
    console.log("user ", req?.tokenPayLoad._id?.toString(), userId);

    if (userId !== req.tokenPayLoad._id.toString()) {
      res.send({
        status: false,

        message: "Invalid User !",
      });
    }

    // Check if a file was uploaded and set the URL accordingly
    let imageUrl = "";
    let videoUrl = "";

    console.log("red fiel", req?.file);
    if (req.file) {
      const fileUrl = req.file.location;
      if (fileType === "image") {
        imageUrl = fileUrl;
      } else if (fileType === "video") {
        videoUrl = fileUrl;
      }
    }

    const createPostNew = await Post.create({
      user: userId,
      description,
      imageUrl,
      videoUrl,
    });

    res.send({
      status: true,
      post: createPostNew,
      message: "user form token",
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

        message: "Invalid User !",
      });
    }

    const postDb = await Post.find({ user: userId, post: postId });
    if (!postDb) {
      res.send({
        status: false,

        message: "Invalid userId or PostId",
      });
    } else {
      await Post.findByIdAndDelete(postId);
      res.send({
        status: true,

        message: "Post deleted success",
      });
    }
  } catch ({ message }) {
    next(message);
  }
};

const sharePost = async (req, res, next) => {
  try {
    const userId = req.tokenPayLoad._id; // Current user ID
    const { postId, description } = req.body;

    // Ensure the post exists
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res
        .status(404)
        .send({ status: false, message: "Original post not found" });
    }


      // Check if the user has already shared the post
      if (originalPost.shared.includes(userId)) {
        return res.status(400).send({
          status: false,
          message: "You have already shared this post",
        });
      }



    // Create a new post, indicating it's a shared post
    const sharedPost = await Post.create({
      user: userId,
      sharedPost: postId,
      description: originalPost.description,
      imageUrl: originalPost.imageUrl,
      videoUrl: originalPost.videoUrl,
    });

     // Update the original post's "shared" field with the user ID
     await Post.findByIdAndUpdate(postId, {
      $addToSet: { shared: userId }, // Add userId to shared array, only if not already present
    });


    res.status(201).send({
      status: true,
      post: sharedPost,
      message: "Post shared successfully",
    });
  } catch (error) {
    next(error);
  }
}; 
module.exports = {
  deletePostByUserIdPostId,
  createPost,
  getPostByUserId,
  getPaginatedPosts,
  getPost,
  getPostById,
  getPostsById,
  sharePost,
};
