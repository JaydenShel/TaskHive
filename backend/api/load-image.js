const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const queryDatabase = require('../database');
const jwt = require("jsonwebtoken");

// S3 Configuration
const BUCKET_NAME = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: REGION
});

router.get('/', async (req, res) => {
    const token = req.cookies.token;

    try {
        const decoded_token = jwt.verify(token, process.env.SECRET_KEY);

        const rows = await queryDatabase(
            'SELECT profile_image_url FROM credentials WHERE id = $1',
            [decoded_token.user_id]
        );

        const fullUrl = rows[0]?.profile_image_url;
        if (!fullUrl) {
            return res.status(404).json({ message: "No profile image found." });
        }


        // Extract the S3 object key from the full URL (after the .com/)
        const s3Key = fullUrl.split('.com/')[1];

        if (!s3Key) {
            return res.status(500).json({ message: "Failed to parse S3 key." });
        }

        // Generate a pre-signed URL
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Expires: 60 * 5,
        });

        res.status(200).json({ imageUrl: signedUrl });

    } catch (err) {
        console.error("Failed to get signed image URL:", err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
