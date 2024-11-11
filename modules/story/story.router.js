const express = require('express');
const { checkToken } = require('../../middlewares/checkToken'); 
const { upload } = require('../../config/multerConfig');
const {
    createStory,
    getUserStories,
    getAllStories,
    deleteExpiredStories,
} = require('./story.controller');

const storyRouter = express.Router();

// Story-related routes

// Route to create a new story (image or video upload)
storyRouter.post('/createStory', checkToken, upload.single('fileUploads'), createStory);

// Route to get all active stories for the current user
storyRouter.get('/userStories', checkToken, getUserStories);

// Route to get all active stories (for the story feed)
storyRouter.get('/allStories', checkToken, getAllStories);

// Route to delete expired stories (could be scheduled or called manually)
storyRouter.delete('/expiredStories', deleteExpiredStories);

module.exports = {
    storyRouter
};
