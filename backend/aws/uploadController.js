const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();

// ✅ Load bucket and region from .env
const BUCKET_NAME = process.env.S3_BUCKET || 'profile-images';
const REGION = process.env.AWS_REGION || 'us-east-1';

// ✅ AWS v2 S3 Client Config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY || 'S3RVER',
    secretAccessKey: process.env.AWS_SECRET_KEY || 'S3RVER',
    region: REGION
});

const s3 = new AWS.S3();

// ✅ Multer + S3 uploader
const upload = multer({
    storage: multerS3({
        s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const username = req.user?.username || "user";
            const fileName = `avatars/${username}-${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    })
});

// ✅ POST /upload-image
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file || !req.file.location) {
        return res.status(400).json({ message: 'Upload failed.' });
    }
    res.status(200).json({ imageUrl: req.file.location });
});

module.exports = router;
