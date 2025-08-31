const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { taskId, title, description, priority, dueDate, assignee } = req.body;

    if (!taskId) {
        return res.status(400).json({ message: "Missing taskId." });
    }

    try {
        const result = await queryDatabase(
            `UPDATE tasks 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 priority = COALESCE($3, priority),
                 due_date = COALESCE($4, due_date),
                 assigned_to = COALESCE($5, assigned_to)
             WHERE id = $6 
             RETURNING *`,
            [title, description, priority, dueDate, assignee, taskId]
        );

        if (!result?.length) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ message: "Failed to update task.", error: error.message });
    }
});

module.exports = router;
