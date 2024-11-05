const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createCommunity,
    addModerator,
    inviteUserToCommunity,
    acceptCommunityInvitation,
    removeModerator,
    getMyCommunities,
    getAdminOrModeratorCommunities
} = require('./community.controller');
// const {upload} = require('../../config/multerConfig');

const communityRouter = express.Router();

// writes the routers community here

communityRouter.post('/createCommunity',
    //  checkToken,
    //   upload.single('communityPicture'),
       createCommunity);
communityRouter.post('/addModerator', checkToken, addModerator);
communityRouter.post('/removeModerator', checkToken, removeModerator);
//invited user to community
communityRouter.post('/inviteUserToCommunity', checkToken, inviteUserToCommunity);
communityRouter.post('/acceptCommunityInvitation', checkToken, acceptCommunityInvitation);
communityRouter.get('/getMyCommunities', checkToken, getMyCommunities);
communityRouter.get('/getAdminOrModeratorCommunities', checkToken, getAdminOrModeratorCommunities);

module.exports = {
    communityRouter
};
