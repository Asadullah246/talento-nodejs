const Notification = require('./notification.model');

const getNotifications = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token

        // Fetch all notifications for the logged-in user
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'userName profilePicture') // Populate sender details
            .sort({ createdAt: -1 }); // Sort by newest first

        // Mark all notifications as read
        await Notification.updateMany({ recipient: userId, read: false }, { read: true });

        res.status(200).send({ status: true, notifications });
    } catch (error) {
        next(error);
    }
};

const getNotificationsWithOutMarking = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token
        const { page = 1, limit = 50 } = req.query;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch unread notifications for the user, sorted by createdAt descending
        const unreadNotifications = await Notification.find({ recipient: userId, read: false })
            .sort({ createdAt: -1 });

        // Fetch read notifications for the user, sorted by createdAt descending
        const readNotifications = await Notification.find({ recipient: userId, read: true })
            .sort({ createdAt: -1 });

        // Combine unread and read notifications
        let allNotifications = [...unreadNotifications, ...readNotifications];

        // Populate sender details for each notification
        allNotifications = await Notification.populate(allNotifications, {
            path: 'sender',
            select: 'userName profilePicture'
        });

        // Apply pagination
        const paginatedNotifications = allNotifications.slice(skip, skip + Number(limit));

        // Calculate total pages
        const totalNotifications = allNotifications.length;
        const totalPages = Math.ceil(totalNotifications / limit);

        res.status(200).send({
            status: true,
            notifications: paginatedNotifications,
            totalPages,
            currentPage: Number(page),
            limit,
            message: "Notifications retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};



// const getNotificationsWithOutMarking = async (req, res, next) => {
//     try {
//         const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token
//         const { page = 1, limit = 50 } = req.query;

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Use aggregation to sort the notifications in two groups: unread first, then read
//         const notifications = await Notification.aggregate([
//             {
//                 $match: {
//                     recipient: userId
//                 }
//             },
//             {
//                 $facet: {
//                     unread: [
//                         { $match: { read: false } },
//                         { $sort: { createdAt: -1 } },
//                     ],
//                     read: [
//                         { $match: { read: true } },
//                         { $sort: { createdAt: -1 } },
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     notifications: {
//                         $concatArrays: ['$unread', '$read']
//                     }
//                 }
//             },
//             { $unwind: '$notifications' },
//             { $replaceRoot: { newRoot: '$notifications' } },
//             // Lookup to fetch sender details
//             {
//                 $lookup: {
//                     from: 'users', // Collection name for User
//                     localField: 'sender',
//                     foreignField: '_id',
//                     as: 'senderDetails'
//                 }
//             },
//             {
//                 $unwind: '$senderDetails' // Unwind to flatten the senderDetails array
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     recipient: 1,
//                     sender: 1,
//                     'senderDetails.userName': 1,
//                     'senderDetails.profilePicture': 1,
//                     link: 1,
//                     notificationType: 1,
//                     post: 1,
//                     comment: 1,
//                     community: 1,
//                     message: 1,
//                     read: 1,
//                     createdAt: 1,
//                 }
//             },
//             { $skip: skip },
//             { $limit: Number(limit) }
//         ]);

//         // Count total notifications for pagination
//         const totalNotifications = await Notification.countDocuments({ recipient: userId });
//         const totalPages = Math.ceil(totalNotifications / limit);

//         res.status(200).send({
//             status: true,
//             notifications,
//             totalPages,
//             currentPage: Number(page),
//             limit,
//             message: "Notifications retrieved successfully"
//         });
//     } catch (error) {
//         next(error);
//     }
//   };



// const getNotificationsWithOutMarking = async (req, res, next) => {
//   try {
//       const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token
//       const { page = 1, limit = 50 } = req.query;

//       // Calculate the number of documents to skip
//       const skip = (page - 1) * limit;

//       // Use aggregation to sort the notifications in two groups: unread first, then read
//       const notifications = await Notification.aggregate([
//           {
//               $match: {
//                   recipient: userId
//               }
//           },
//           {
//               $facet: {
//                   unread: [
//                       { $match: { read: false } },
//                       { $sort: { createdAt: -1 } },
//                   ],
//                   read: [
//                       { $match: { read: true } },
//                       { $sort: { createdAt: -1 } },
//                   ]
//               }
//           },
//           {
//               $project: {
//                   notifications: {
//                       $concatArrays: ['$unread', '$read']
//                   }
//               }
//           },
//           { $unwind: '$notifications' },
//           { $replaceRoot: { newRoot: '$notifications' } },
//           { $skip: skip },
//           { $limit: Number(limit) }
//       ]);

//       // Count total notifications for pagination
//       const totalNotifications = await Notification.countDocuments({ recipient: userId });
//       const totalPages = Math.ceil(totalNotifications / limit);

//       res.status(200).send({
//           status: true,
//           notifications,
//           totalPages,
//           currentPage: Number(page),
//           limit,
//           message: "Notifications retrieved successfully"
//       });
//   } catch (error) {
//       next(error);
//   }
// };


// const getNotificationsWithOutMarking = async (req, res, next) => {
//   try {
//       const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token
//       const { page = 1, limit = 50 } = req.query;

//       // Calculate the number of documents to skip
//       const skip = (page - 1) * limit;

//       // Fetch notifications for the logged-in user with pagination
//       const notifications = await Notification.find({ recipient: userId })
//           .populate('sender', 'userName profilePicture') // Populate sender details
//           .sort({ createdAt: -1 }) // Sort by newest first
//           .skip(skip)
//           .limit(Number(limit));

//       // Count total notifications for pagination
//       const totalNotifications = await Notification.countDocuments({ recipient: userId });
//       const totalPages = Math.ceil(totalNotifications / limit);

//       res.status(200).send({
//           status: true,
//           notifications,
//           totalPages,
//           currentPage: Number(page),
//           limit,
//           message: "Notifications retrieved successfully"
//       });
//   } catch (error) {
//       next(error);
//   }
// };

const getUnreadNotifications = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token

        // Fetch only unread notifications for the logged-in user
        const unreadNotifications = await Notification.find({ recipient: userId, read: false })
            .populate('sender', 'userName profilePicture')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).send({ status: true, unreadNotifications });
    } catch (error) {
        next(error);
    }
};
const markNotificationAsRead = async (req, res, next) => { 
    try {
        const { notificationId } = req.body; // Get notification ID from request parameters

        // Update the notification to mark it as read
        await Notification.findByIdAndUpdate(notificationId, { read: true });

        res.status(200).send({ status: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};
const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req?.tokenPayLoad?._id; // Get the logged-in user ID from token


        console.log("user id ", userId);

        if (!userId) {
            res.send({
              status: false,
              message: "Invalid User !",
            });
          }

        // Update all unread notifications for the user to mark them as read
        await Notification.updateMany({ recipient: userId, read: false }, { read: true });

        res.status(200).send({ status: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};



const createNotification = async (req, res, next) => {
  console.log("Creating a new notification");
  try {
    const { recipient, sender, notificationType, post, comment, community, message, link } = req.body;
    console.log("Request body:", req.body);

    // Validate notification type
    if (!['like', 'comment', 'follow', 'invitation',"invitationToCommunity"].includes(notificationType)) {
      return res.status(400).send({
        status: false,
        message: "Invalid notification type!",
      });
    }

    // Validate required fields
    if (!recipient || !sender || !notificationType || !message) {
      return res.status(400).send({
        status: false,
        message: "Recipient, sender, notification type, and message are required.",
      });
    }

    // Create the new notification
    const notification = await Notification.create({
      recipient,
      sender,
      notificationType,
      post,      // Optional, only included if provided in request
      comment,   // Optional, only included if provided in request
      community, // Optional, only included if provided in request
      message,
      link,
      read: false, // Default value, notification is unread initially
    });

    res.status(201).send({
      status: true,
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    next(error);
  }
};





module.exports = {
    getNotifications,
    createNotification,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationsWithOutMarking
};


