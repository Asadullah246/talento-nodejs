const express = require('express');
const { checkToken } = require('../../middlewares/checkToken');
const {
    createCommunity,
    addModerator,
    inviteUserToCommunity,
    acceptCommunityInvitation,
    removeModerator,
    getMyCommunities,
    getAdminOrModeratorCommunities,
    getSingleCommunity,
    forYouCommunities,
    updateCommunity,
    leaveCommunity
} = require('./community.controller');
const { upload } = require('../../config/multerConfig');

const communityRouter = express.Router();

// writes the routers community here

communityRouter.post('/createCommunity',
     checkToken,
      upload.single('fileUploads'),
       createCommunity);
communityRouter.post('/addModerator', checkToken, addModerator);
communityRouter.post('/removeModerator', checkToken, removeModerator);
//invited user to community
communityRouter.post('/inviteUserToCommunity', checkToken, inviteUserToCommunity);
communityRouter.post('/acceptCommunityInvitation', checkToken, acceptCommunityInvitation);
communityRouter.post('/leaveCommunity', checkToken, leaveCommunity);
communityRouter.get('/getMyCommunities', checkToken, getMyCommunities);
communityRouter.get('/forYouCommunities', checkToken, forYouCommunities);
communityRouter.get('/getMyCommunities/:communityId', checkToken, getSingleCommunity);
communityRouter.get('/getAdminOrModeratorCommunities', checkToken, getAdminOrModeratorCommunities);
communityRouter.post('/updateCommunity', checkToken, upload.single('fileUploads'), updateCommunity);
communityRouter.get('/getSingleCommunity', checkToken, getSingleCommunity); 

module.exports = {
    communityRouter
};
