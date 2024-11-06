const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { getNotifications, createNotification, getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require('./notification.controller');

const notificationRouter = express.Router();

notificationRouter.get('/getNotifications', checkToken, getNotifications);
notificationRouter.post('/createNotification', checkToken, createNotification);
// Route to get all unread notifications
notificationRouter.get('/unread', getUnreadNotifications);

// Route to mark a specific notification as read
notificationRouter.put('/:notificationId/read', markNotificationAsRead);

// Route to mark all unread notifications as read
notificationRouter.put('/markAllAsRead', markAllNotificationsAsRead);

module.exports = { 
    notificationRouter
};
