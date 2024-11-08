const Chat = require("./chat.model");
const User = require("../user/user.model");

const getAllChatsList = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id;

        // Get all distinct chat partners of the current user
        const chatPartners = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", userId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $last: "$$ROOT" }
                }
            },
            {
                $sort: { "lastMessage.createdAt": -1 } // Sort by last message time descending
            }
        ]);

        // Extract chat partner IDs from the aggregation
        const partnerIds = chatPartners.map((partner) => partner._id);

        // Retrieve the details of all chat partners
        const chatUsers = await User.find({ _id: { $in: partnerIds } }).select(
            "userName profilePicture isOnline"
        );

        // Create a list of chat items that contains user information and the last message
        const chatsList = chatPartners.map((partner) => {
            const userInfo = chatUsers.find(
                (user) => user._id.toString() === partner._id.toString()
            );
            return {
                chatId: partner._id,
                userName: userInfo?.userName,
                profileImage: userInfo?.profilePicture,
                isOnline: userInfo?.isOnline,
                lastMessage: partner.lastMessage.message,
                isLastMessageMine:
                    partner.lastMessage.sender.toString() === userId.toString(),
                time: partner.lastMessage.createdAt,
            };
        });

        res.status(200).send({ status: true, chats: chatsList });
    } catch (error) {
        console.error("Error fetching all chat list:", error);
        next(error);
    }
};


const getChatHistory = async (req, res, next) => {
    try {
      const {
        //  userId,
         otherUserId } = req.query;
      const userId = req.tokenPayLoad._id;

      const chatHistory = await Chat.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId }
        ]
      })
      .sort({ createdAt: 1 }) // Sort by timestamp to show messages in order
      .populate('sender', 'userName profilePicture')
      .populate('receiver', 'userName profilePicture');

      res.status(200).send({ status: true, chatHistory });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      next(error);
    }
  };


  module.exports = {
    getChatHistory,
    getAllChatsList,
};
