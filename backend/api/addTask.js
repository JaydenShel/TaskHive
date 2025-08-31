const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { boardId, columnId, title, description, priority, dueDate, assignee } = req.body;

    console.log("Incoming addTask request:", { boardId, columnId, title, description, priority, dueDate, assignee });

    if (!boardId || !columnId || !title) {
        return res.status(400).json({ message: "Missing boardId, columnId, or title." });
    }

    try {
        // Get the highest position in the column
        const positionResult = await queryDatabase(
            `SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM tasks WHERE column_id = $1`,
            [columnId]
        );
        const nextPosition = positionResult[0]?.next_position || 0;

        const result = await queryDatabase(
            `INSERT INTO tasks (board_id, column_id, title, description, priority, due_date, assigned_to, position) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [boardId, columnId, title, description || null, priority || 'Medium', dueDate || null, assignee || null, nextPosition]
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
