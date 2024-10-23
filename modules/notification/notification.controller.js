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

module.exports = {
    getNotifications
};
