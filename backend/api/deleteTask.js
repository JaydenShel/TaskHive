const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { taskId } = req.body;

    if (!taskId) {
        return res.status(400).json({ message: "Missing taskId." });
    }

    try {
        // Start a transaction
        await queryDatabase('BEGIN');

        // Get task info before deletion
        const taskInfo = await queryDatabase(
            `SELECT column_id, position FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (!taskInfo?.length) {
            await queryDatabase('ROLLBACK');
            return res.status(404).json({ message: "Task not found." });
        }

        const { column_id, position } = taskInfo[0];

        // Delete the task
        await queryDatabase(
            `DELETE FROM tasks WHERE id = $1`,
            [taskId]
        );

        // Reorder remaining tasks in the column
        await queryDatabase(
            `UPDATE tasks SET position = position - 1 
             WHERE column_id = $1 AND position > $2`,
            [column_id, position]
        );

        await queryDatabase('COMMIT');

        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        await queryDatabase('ROLLBACK');
        console.error("Delete Task Error:", error);
        res.status(500).json({ message: "Failed to delete task.", error: error.message });
    }
});

module.exports = router;
