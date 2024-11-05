


const app = require('./app'); // app instance import
const connectDB = require('./config/dbConnect');
require('dotenv').config(); // env file access
const PORT = process.env.PORT || 5000;

// db connection

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log('db connected');
    } catch (err) {
        console.log(err.message);
    } finally {
        console.log(`server running at http://localhost:${PORT}`);
    }
});
