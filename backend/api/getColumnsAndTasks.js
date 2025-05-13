const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { boardId } = req.body;

    if (!boardId) {
        return res.status(400).json({ message: "Missing boardId." });
    }

    try {
        // These return arrays directly, not { rows: [...] }
        const columns = await queryDatabase(
            `SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC`,
            [boardId]
        );

        const tasks = await queryDatabase(
            `SELECT * FROM tasks WHERE board_id = $1`,
            [boardId]
        );

        // Attach tasks to corresponding columns
        const result = columns.map(col => ({
            ...col,
            tasks: tasks.filter(task => task.column_id === col.id)
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error("getColumnsAndTasks error:", error);
        return res.status(500).json({ message: "Failed to load board data.", error: error.message });
    }
});

module.exports = router;
