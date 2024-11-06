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
    const { userId } = req.body;
    if (userId !== req.tokenPayLoad._id.toString()) {
      res.send({
        status: false,

        message: "Invalid User !",
      });
    }

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
const getPost= async (req, res, next) => {

    console.log("calling this");
  try {
    // const { userId } = req.body;
    const { page = 1, limit = 10, userId } = req.query;
    console.log("req query", req.query);
    console.log("user", userId,req.tokenPayLoad._id.toString() ); 
    if (userId !== req.tokenPayLoad._id.toString()) {
      res.send({
        status: false,

        message: "Invalid User !",
      });
    }



        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        const postDb = await Post.find({})
          .skip(skip)
          .limit(Number(limit))
          .populate('user', 'userName profilePicture');

    if (!postDb || postDb.length === 0) {
        return res.send({
          status: false,
          message: "Not found any post",
        });
      }
      const totalPosts = await Post.countDocuments({});
      const totalPages = Math.ceil(totalPosts / limit);

      res.send({
        status: true,
        posts: postDb,
        totalPages,
        currentPage: Number(page),
        message: "Post retrieved successfully",
      });

    // const postDb = await Post.find({});
    // if (!postDb) {
    //   res.send({
    //     status: false,
    //     message: "Not found any post",
    //   });
    // } else {
    //   res.send({
    //     status: true,
    //     posts: postDb,
    //     message: "Post retrieved success",
    //   });
    // }
  } catch ({ message }) {
    next(message);
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

module.exports = {
  deletePostByUserIdPostId,
  createPost,
  getPostByUserId,
  getPaginatedPosts,
  getPost,
};
