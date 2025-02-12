const express = require("express");
const router = express.Router();
const queryDatabase = require("../database");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        // Retrieve cookie and decode
        const token = req.cookies.token;

        // If no token exists, return 401 unauthorized
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        let decoded_token;
        try {
            decoded_token = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(403).json({ message: err });
        }

        // Extract username from decoded token
        const username = decoded_token.username;

        // Extract password and new password from request body
        const { password, newPassword, confirmPassword } = req.body;

        // Determine if password and confirm match
        if(newPassword !== confirmPassword){
            return res.status(400).json({message: "New password does not match confirm password"})
        }

        if (!password || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Query to reset the user password
        const result = await queryDatabase(
            'UPDATE credentials SET password = $1 WHERE password = $2 AND username = $3',
            [newPassword, password, username]
        );

        // Check if a row was actually updated
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;