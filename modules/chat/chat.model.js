
// new code =================================================

// chat.model.js

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room' // Optional for group chats or rooms
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;  


// new code end =================================================

// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema(
//     {
//         message: {
//             type: String,
//             required: true
//         },
//         sender: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User', // Reference to User model
//             required: true
//         },
//         receiver: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User', // Reference to User model
//             required: true
//         }
//     },
//     {
//         timestamps: true // Automatically adds createdAt and updatedAt fields
//     }
// );

// // Create the Chat model
// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;
