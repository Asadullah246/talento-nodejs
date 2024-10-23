const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const { getNotifications } = require('./notification.controller');

const notificationRouter = express.Router();

notificationRouter.get('/getNotifications', checkToken, getNotifications);

module.exports = {
    notificationRouter
};
