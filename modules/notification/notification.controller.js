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
        const { notificationId } = req.params; // Get notification ID from request parameters

        // Update the notification to mark it as read
        await Notification.findByIdAndUpdate(notificationId, { read: true });

        res.status(200).send({ status: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};
const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Get the logged-in user ID from token

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
    const { recipient, sender, notificationType, post, comment, community, message } = req.body;
    console.log("Request body:", req.body);

    // Validate notification type
    if (!['like', 'comment', 'follow', 'invitation'].includes(notificationType)) {
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
    markAllNotificationsAsRead
};


