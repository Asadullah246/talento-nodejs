

const multer = require('multer') ;
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

// Check if environment variables are available
const hasCredentials = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET &&  process.env.DO_SPACES_ENDPOINT && process.env.DO_SPACES_BUCKET
// && process.env.DO_SPACES_REGION
 ;

if (!hasCredentials) {
  console.warn('Warning: DigitalOcean Spaces credentials are missing. Demo mode activated.');
}

aws.config.update({
  accessKeyId: process.env.DO_SPACES_KEY || 'DEMO_KEY',
  secretAccessKey: process.env.DO_SPACES_SECRET || 'DEMO_SECRET',
  // region: process.env.DO_SPACES_REGION || 'demo-region',
});

const s3 = new aws.S3({
  endpoint: new aws.Endpoint(process.env.DO_SPACES_ENDPOINT || 'https://demo.spaces.endpoint'),
});

const upload = multer({
  storage: hasCredentials ? multerS3({
    s3: s3,
    bucket: process.env.DO_SPACES_BUCKET || 'demo-bucket',
    acl: 'public-read',
    key: function (req, file, cb) {
    //   cb(null, `community-images/${uuidv4()}-${file.originalname}`);
      cb(null, `images/${uuidv4()}-${file.originalname}`);
    },
  }) : multer.memoryStorage(), // Use memory storage for demo mode
});
// console.log("Multer configuration complete");

module.exports = {
    upload
};

// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// // Set up multer storage to save files in a local folder, e.g., "uploads/"
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the directory where files will be stored
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename with UUID to avoid conflicts
//     const uniqueName = `${uuidv4()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// // Initialize multer with the defined storage
// const upload = multer({ storage });

// // Create the "uploads" folder if it doesn't exist
// const fs = require('fs');
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// console.log("Multer configuration complete");

// // Export the configured upload instance
// module.exports = {
//   upload
// };



