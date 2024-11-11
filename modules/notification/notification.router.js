const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { getNotifications,getNotificationsWithOutMarking, createNotification, getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require('./notification.controller');

const notificationRouter = express.Router();

notificationRouter.get('/getNotifications', checkToken, getNotifications);
notificationRouter.get('/getNotificationsWithOutMarking', checkToken, getNotificationsWithOutMarking);
notificationRouter.post('/createNotification', checkToken, createNotification);
// Route to get all unread notifications
notificationRouter.get('/unread', getUnreadNotifications);

// Route to mark a specific notification as read
notificationRouter.put('/markAsRead', markNotificationAsRead);

// Route to mark all unread notifications as read
notificationRouter.put('/markAllAsRead', checkToken, markAllNotificationsAsRead);
// notificationRouter.put('/markAllAsRead', markAllNotificationsAsRead);

module.exports = {
    notificationRouter
};
