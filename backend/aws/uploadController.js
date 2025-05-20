const AWS = require('aws-sdk');
const multer = require('multer'); // For handling file uploads
const multerS3 = require('multer-s3');

// Configure AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Multer setup to upload to S3 directly
const upload = multer({
    storage: multerS3({
        s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now()}-${file.originalname}`);
        }
    })
});

// Express route handler
const express = require('express');
const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
    return res.status(200).json({ url: req.file.location });
});

module.exports = router;
