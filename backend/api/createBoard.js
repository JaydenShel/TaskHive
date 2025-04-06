const express = require("express");
const router = express.Router();
const queryDatabase = require("../database");

router.post("/", async (req, res) => {
    const { boardName, userName } = req.body;

    try {
        //Get user ID from username
        const userResult = await queryDatabase(
            "SELECT id FROM credentials WHERE username = $1",
            [userName]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userResult[0].id;

        //Insert new board
        await queryDatabase(
            "INSERT INTO boards (name, created_by, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)",
            [boardName, userId]
        );

        return res.status(201).json({ message: "Board created successfully" });

    } catch (error) {
        console.error("Error creating board:", error);
        return res.status(500).json({ error: "Server error creating board" });
    }
});

module.exports = router;
