
const app = require('./app'); // app instance import
const connectDB = require('./config/dbConnect');
require('dotenv').config(); // env file access
const PORT = process.env.PORT || 5000;
const http = require('http');

const User = require('./modules/user/user.model');
const Chat = require('./modules/chat/chat.model');
// const Chat = require('./modules/chat/chat.model');

const socketIO = require('socket.io');

const server = http.createServer(app); // Create the server

// socket cors options
const io = socketIO(server, {
  cors: {
    origin: '*', // Allow all origins for cross-domain requests
    methods: ['GET', 'POST']
  }
});

// Store online users: { userId: socketId }
let onlineUsers = new Map();

server.listen(PORT, async () => {
  try {
    await connectDB();
    // console.log('db connected');

    // Socket.io connection
    io.on('connection', (socket) => {
    //   console.log('A user connected:', socket.id);

      // Register user
      socket.on('register', async (userId) => {
        onlineUsers.set(userId, socket.id); // Map userId to socketId
        // console.log(`User with ID ${userId} is now online`);

        // Notify all clients that the user is online
        const user = await User.findById(userId).select('userName profilePicture');
        if (user) {
            // console.log("user found", user);
          io.emit('userOnline', {
            userId,
            userName: user.userName,
            profilePicture: user.profilePicture
          });
        } else {
          console.error('User not found while registering:', userId);
        }
      });

      // Handle sending a chat message
      socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {

          console.log("sen", senderId, "rec", receiverId, "me", message);
          if (!senderId || !receiverId || !message) {
            console.error('Invalid message data');
            return;
          }

          const newChat = new Chat({
            message,
            sender: senderId,
            receiver: receiverId
          });
          await newChat.save(); // Save message to DB
        //   console.log("online users", onlineUsers);

          const receiverSocketId = onlineUsers.get(receiverId);
        //   console.log("reciver socke id", receiverSocketId);

          // If the receiver is online, emit the message
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', {
              senderId,
              message,
              createdAt: newChat.createdAt
            });
          }
        } catch (error) {
          console.log('Error sending message:', error);
        }
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        let userIdToRemove;

        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            userIdToRemove = userId;
          }
        }

        if (userIdToRemove) {
          onlineUsers.delete(userIdToRemove);
          console.log(`User with ID ${userIdToRemove} is now offline`);

          // Notify all clients that the user is offline
          io.emit('userOffline', { userId: userIdToRemove });
        }
      });
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    console.log(`server running at http://localhost:${PORT}`);
  }
});






