const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const jwt = require("jsonwebtoken");
const router = express.Router();
const queryDatabase = require('../database')

// ✅ Load bucket and region from .env
const BUCKET_NAME = process.env.S3_BUCKET || 'profile-images';
const REGION = process.env.AWS_REGION || 'us-east-1';

// AWS config
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

router.post('/', upload.single('image'), async (req, res) => {
    const token = req.cookies.token

    try {
        //Retrieve decrypted token
        const decoded_token = jwt.verify(token, process.env.SECRET_KEY)

        const result = await queryDatabase(
            'UPDATE credentials SET profile_image_url = $1 WHERE id = $2',
            [req.file.location, decoded_token.user_id]
        );
        console.log("Rows affected:", result.rowCount);
    } catch (err) {
        res.status(400).json({message: err})
    }


    if (!req.file || !req.file.location) {
        return res.status(400).json({message: 'Upload failed.'});
    }

    res.status(200).json({imageUrl: req.file.location});
});

module.exports = router;
