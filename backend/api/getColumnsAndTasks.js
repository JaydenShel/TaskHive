const express = require("express");
const router = express.Router();
const queryDatabase = require('../database')

router.post('/', async (req, res) => {
    const { boardId } = req.body;

    if (!boardId) {
        return res.status(400).json({ message: "Missing boardId." });
    }

    try {
        const columnsRes = queryDatabase(
            `SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC`,
            [boardId]
        );

        const tasksRes = queryDatabase(
            `SELECT * FROM tasks WHERE board_id = $1`,
            [boardId]
        );

        // Group tasks under corresponding column
        const columns = columnsRes.rows.map(col => ({
            ...col,
            tasks: tasksRes.rows.filter(task => task.column_id === col.id)
        }));

        res.status(200).json(columns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch board data.", error: error.message });
    }
});

module.exports = router;
