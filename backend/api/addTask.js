const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { boardId, columnId, title } = req.body;

    console.log("Incoming addTask request:", { boardId, columnId, title });

    if (!boardId || !columnId || !title) {
        return res.status(400).json({ message: "Missing boardId, columnId, or title." });
    }

    try {
        const result = await queryDatabase(
            `INSERT INTO tasks (board_id, column_id, title) VALUES ($1, $2, $3) RETURNING *`,
            [boardId, columnId, title]
        );

        if (!result?.length) {
            return res.status(500).json({ message: "Failed to create task." });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Add Task Error:", error);
        res.status(500).json({ message: "Failed to add task.", error: error.message });
    }
});

module.exports = router;
