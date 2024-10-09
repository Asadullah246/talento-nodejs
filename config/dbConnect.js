const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
            // You can add more options if needed
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
