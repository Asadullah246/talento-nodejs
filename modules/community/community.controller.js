const Community = require('./community.model');

// const createCommunity = async (req, res, next) => {
//     try {
//         const { communityName, description, communityPicture } = req.body;
//         const userId = req.tokenPayLoad._id; // User ID of the person creating the community

//         // Create a new community with the user as the communityAdmin
//         const community = await Community.create({
//             communityName,
//             description,
//             communityPicture,
//             communityAdmin: [userId], // The user who creates the community becomes the admin
//             communityModerator: [],
//             communityPeople: [userId], // The user is also part of the community
//             invitedPeople: []
//         });

//         res.status(201).send({
//             status: true,
//             message: 'Community created successfully',
//             community
//         });
//     } catch (error) {
//         console.error('Error creating community:', error);
//         next(error);
//     }
// };

 const createCommunity = async (req, res, next) => {

    console.log("calling this ");
    try {
      const { communityName, description } = req.body;
      const userId = req?.tokenPayLoad?._id; // User ID of the person creating the community

      if (!req.file) {
        return res.status(400).send({
          status: false,
          message: 'Image upload failed. Please upload an image.',
        });
      }

      const communityPictureUrl = req?.file?.location; // URL of the uploaded image

      // Create a new community with the user as the communityAdmin
      const community = await Community.create({
        communityName,
        description,
        communityPicture: communityPictureUrl,
        communityAdmin: [userId], // The user who creates the community becomes the admin
        communityModerator: [],
        communityPeople: [userId], // The user is also part of the community
        invitedPeople: [],
      });

      res.status(201).send({
        status: true,
        message: 'Community created successfully',
        community,
      });
    } catch (error) {
      console.error('Error creating community:', error);
      next(error);
    }
  }



const addModerator = async (req, res, next) => {
    try {
        const { communityId, userIdToPromote } = req.body; // Community ID and user to promote
        const userId = req.tokenPayLoad._id; // The ID of the user who is requesting to add a moderator

        // Find the community by ID
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).send({ status: false, message: 'Community not found' });
        }

        // Ensure the user is an admin of the community
        if (!community.communityAdmin.includes(userId)) {
            return res
                .status(403)
                .send({ status: false, message: 'Only admins can add moderators' });
        }

        // Ensure the user to promote is part of the community
        if (!community.communityPeople.includes(userIdToPromote)) {
            return res
                .status(400)
                .send({ status: false, message: 'User must be part of the community' });
        }

        // Check if the user is already a moderator
        if (community.communityModerator.includes(userIdToPromote)) {
            return res.status(400).send({ status: false, message: 'User is already a moderator' });
        }

        // Add the user to the communityModerator array
        community.communityModerator.push(userIdToPromote);

        // Save the community with the updated moderators list
        await community.save();

        res.status(200).send({
            status: true,
            message: `User promoted to moderator successfully`,
            community
        });
    } catch (error) {
        console.error('Error promoting user to moderator:', error);
        next(error);
    }
};

const removeModerator = async (req, res, next) => {
    try {
        const { communityId, userIdToRemove } = req.body; // Community ID and user to remove from moderator role
        const userId = req.tokenPayLoad._id; // The ID of the user who is requesting to remove a moderator

        // Find the community by ID
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).send({ status: false, message: 'Community not found' });
        }

        // Ensure the user is an admin of the community
        if (!community.communityAdmin.includes(userId)) {
            return res
                .status(403)
                .send({ status: false, message: 'Only admins can remove moderators' });
        }

        // Check if the user is a moderator
        if (!community.communityModerator.includes(userIdToRemove)) {
            return res.status(400).send({ status: false, message: 'User is not a moderator' });
        }

        // Remove the user from the communityModerator array
        community.communityModerator = community.communityModerator.filter(
            (id) => !id.equals(userIdToRemove)
        );

        // Save the community with the updated moderators list
        await community.save();

        res.status(200).send({
            status: true,
            message: `User removed from moderators successfully`,
            community
        });
    } catch (error) {
        console.error('Error removing user from moderator:', error);
        next(error);
    }
};

const inviteUserToCommunity = async (req, res, next) => {
    try {
        const { communityId, userIdToInvite } = req.body; // Community ID and user to invite
        const userId = req.tokenPayLoad._id; // The ID of the user who is inviting

        // Find the community by ID
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).send({ status: false, message: 'Community not found' });
        }

        // Check if the user is an admin or a moderator of the community
        const isAdminOrModerator =
            community.communityAdmin.includes(userId) ||
            community.communityModerator.includes(userId);

        if (!isAdminOrModerator) {
            return res
                .status(403)
                .send({ status: false, message: 'Only admins or moderators can invite users' });
        }

        // Ensure the user to invite is not already part of the community
        if (community.communityPeople.includes(userIdToInvite)) {
            return res
                .status(400)
                .send({ status: false, message: 'User is already a member of the community' });
        }

        // Ensure the user isn't already invited
        if (community.invitedPeople.includes(userIdToInvite)) {
            return res
                .status(400)
                .send({ status: false, message: 'User has already been invited' });
        }

        // Add the user to the invitedPeople array
        community.invitedPeople.push(userIdToInvite);

        // Save the community with the updated invitedPeople list
        await community.save();

        res.status(200).send({
            status: true,
            message: `User has been invited to the community`,
            community
        });
    } catch (error) {
        console.error('Error inviting user to community:', error);
        next(error);
    }
};

const acceptCommunityInvitation = async (req, res, next) => {
    try {
        const { communityId } = req.body; // Community ID to accept invitation from
        const userId = req.tokenPayLoad._id; // The ID of the user accepting the invitation

        // Find the community by ID
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).send({ status: false, message: 'Community not found' });
        }

        // Check if the user was invited to the community
        if (!community.invitedPeople.includes(userId)) {
            return res
                .status(400)
                .send({ status: false, message: 'You have not been invited to this community' });
        }

        // Move the user from invitedPeople to communityPeople
        // Remove the user from invitedPeople array
        community.invitedPeople = community.invitedPeople.filter(
            (id) => id.toString() !== userId.toString()
        );
        // community.invitedPeople = community.invitedPeople.filter((id) => id.toString() !== userId);
        community.communityPeople.push(userId);

        // Save the community with the updated lists
        await community.save();

        res.status(200).send({
            status: true,
            message: 'You have successfully joined the community',
            community
        });
    } catch (error) {
        console.error('Error accepting community invitation:', error);
        next(error);
    }
};

// Controller to get all communities
const getAllCommunities = async (req, res, next) => {
    try {
        const communities = await Community.find();

        res.status(200).send({ status: true, communities });
    } catch (error) {
        console.error('Error retrieving communities:', error);
        next(error);
    }
};

const getInvitedCommunities = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Extract user ID from token payload

        // Find communities where the user is in invitedPeople array
        const communities = await Community.find({ invitedPeople: userId });

        // if (!communities || communities.length === 0) {
        //     return res.status(404).send({
        //         status: false,
        //         message: 'You have no pending community invitations'
        //     });
        // }

        res.status(200).send({
            status: true,
            communities
        });
    } catch (error) {
        console.error('Error retrieving invited communities:', error);
        next(error);
    }
};

const getMyCommunities = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Extract user ID from token payload

        // Find communities where the user is in communityPeople array
        const communities = await Community.find({ communityPeople: userId });

        // if (!communities || communities.length === 0) {
        //     return res.status(404).send({
        //         status: false,
        //         message: 'You are not part of any community'
        //     });
        // }

        res.status(200).send({
            status: true,
            communities
        });
    } catch (error) {
        console.error('Error retrieving communities you belong to:', error);
        next(error);
    }
};

const getAdminOrModeratorCommunities = async (req, res, next) => {
    try {
        const userId = req.tokenPayLoad._id; // Extract user ID from token payload

        // Find communities where the user is in communityAdmin or communityModerator arrays
        const communities = await Community.find({
            $or: [{ communityAdmin: userId }, { communityModerator: userId }]
        });

        // if (!communities || communities.length === 0) {
        //     return res.status(404).send({
        //         status: false,
        //         message: 'You are not an admin or moderator of any community'
        //     });
        // }

        res.status(200).send({
            status: true,
            communities
        });
    } catch (error) {
        console.error('Error retrieving communities where you are an admin or moderator:', error);
        next(error);
    }
};

module.exports = {
    createCommunity,
    addModerator,
    removeModerator,
    inviteUserToCommunity,
    acceptCommunityInvitation,
    getAllCommunities,
    getInvitedCommunities,
    getMyCommunities,
    getAdminOrModeratorCommunities
};
