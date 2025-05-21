const express = require('express');
const router = express.Router();
const queryDatabase = require('../database');
const jwt = require("jsonwebtoken");

router.get('/', async (req, res) => {
    const token = req.cookies.token;

    try {
        const decoded_token = jwt.verify(token, process.env.SECRET_KEY);

        const rows = await queryDatabase(
            'SELECT profile_image_url FROM credentials WHERE id = $1',
            [decoded_token.user_id]
        );

        const imageUrl = rows[0]?.profile_image_url;

        if (!imageUrl) {
            return res.status(404).json({ message: "No profile image found." });
        }

        res.status(200).json({ imageUrl });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

module.exports = router;
