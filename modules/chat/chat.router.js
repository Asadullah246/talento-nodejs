const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    getAllChatsList,
    getChatHistory
} = require('./chat.controller');

const chatRouter = express.Router();

chatRouter.get('/getAllChatsList', checkToken, getAllChatsList);
chatRouter.get('/getChatHistory', checkToken, getChatHistory);

module.exports = {
    chatRouter
};
