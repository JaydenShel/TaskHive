const express = require("express");
const router = express.Router();
const queryDatabase = require("../database");

router.post('/', async (req, res) => {
    const { username } = req.body;

    try {
        // Include board ID in the response
        const boardInfo = await queryDatabase(
            `SELECT B.id, B.name, B.created_at 
             FROM boards B 
             WHERE B.created_by = (SELECT id FROM credentials WHERE username = $1) 
             ORDER BY B.created_at ASC`,
            [username]
        );

        console.log(boardInfo);
        return res.status(200).json({ boardInfo });
    } catch (error) {
        console.error("Error fetching boards:", error);
        return res.status(500).json({ error: "Server error fetching boards" });
    }
});

module.exports = router;
