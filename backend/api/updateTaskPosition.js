const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { taskId, newColumnId, newPosition } = req.body;

    if (!taskId || newColumnId === undefined || newPosition === undefined) {
        return res.status(400).json({ message: "Missing taskId, newColumnId, or newPosition." });
    }

    try {
        // Start a transaction
        await queryDatabase('BEGIN');

        // Get current task info
        const currentTask = await queryDatabase(
            `SELECT column_id, position FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (!currentTask?.length) {
            await queryDatabase('ROLLBACK');
            return res.status(404).json({ message: "Task not found." });
        }

        const { column_id: currentColumnId, position: currentPosition } = currentTask[0];

        if (currentColumnId === newColumnId) {
            // Same column, just reorder
            if (currentPosition < newPosition) {
                // Moving down: shift tasks between current and new position up
                await queryDatabase(
                    `UPDATE tasks SET position = position - 1 
                     WHERE column_id = $1 AND position > $2 AND position <= $3`,
                    [currentColumnId, currentPosition, newPosition]
                );
            } else if (currentPosition > newPosition) {
                // Moving up: shift tasks between new and current position down
                await queryDatabase(
                    `UPDATE tasks SET position = position + 1 
                     WHERE column_id = $1 AND position >= $2 AND position < $3`,
                    [currentColumnId, newPosition, currentPosition]
                );
            }
        } else {
            // Different column
            // Shift tasks in new column down from new position
            await queryDatabase(
                `UPDATE tasks SET position = position + 1 
                 WHERE column_id = $1 AND position >= $2`,
                [newColumnId, newPosition]
            );

            // Shift tasks in old column up from old position
            await queryDatabase(
                `UPDATE tasks SET position = position - 1 
                 WHERE column_id = $1 AND position > $2`,
                [currentColumnId, currentPosition]
            );
        }

        // Update the task's position and column
        await queryDatabase(
            `UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3`,
            [newColumnId, newPosition, taskId]
        );

        await queryDatabase('COMMIT');

        res.status(200).json({ message: "Task position updated successfully." });
    } catch (error) {
        await queryDatabase('ROLLBACK');
        console.error("Update Task Position Error:", error);
        res.status(500).json({ message: "Failed to update task position.", error: error.message });
    }
});

module.exports = router;
