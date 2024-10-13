// external module imports
const express = require('express');
const app = express();
const cors = require('cors'); // cors
require('dotenv').config(); // req for access dot env file

// application level middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// case sensitive routing
app.enable('case sensitive routing');

// public routes
// home route
app.get('/', (req, res) => {
    res.send('home route');
});

// not found any route error : 404
app.use((req, res, next) => {
    console.log('no route found!');
    res.send({
        status: false,
        message: 'No route Found '
    });
});

// final error handling  middleware error : 500

app.use((error, req, res, next) => {
    console.log('last middleware ');
    res.status(error.status || 500).json({
        status: false,
        message: error.message
    });
});

module.exports = app;
