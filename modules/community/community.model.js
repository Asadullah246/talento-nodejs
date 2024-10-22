const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
    {
        communityName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        communityPicture: {
            type: String,
            required: true
        },
        communityAdmin: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to User model for nested replies
            }
        ],
        communityModerator: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to User model for nested replies
            }
        ],
        communityPeople: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to User model for nested replies
            }
        ],
        invitedPeople: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to User model for nested replies
            }
        ]
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create the Community model
const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
