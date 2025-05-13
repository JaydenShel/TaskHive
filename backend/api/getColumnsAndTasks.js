const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { boardId } = req.body;

    if (!boardId) {
        return res.status(400).json({ message: "Missing boardId." });
    }

    try {
        // Get columns for this board
        const columnsRes = await queryDatabase(
            `SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC`,
            [boardId]
        );

        // Get tasks for this board
        const tasksRes = await queryDatabase(
            `SELECT * FROM tasks WHERE board_id = $1`,
            [boardId]
        );

        const columns = (columnsRes?.rows || []).map(col => ({
            ...col,
            tasks: (tasksRes?.rows || []).filter(task => task.column_id === col.id)
        }));

        return res.status(200).json(columns);
    } catch (error) {
        console.error("getColumnsAndTasks error:", error);
        return res.status(500).json({ message: "Failed to load board data.", error: error.message });
    }
});

module.exports = router;
