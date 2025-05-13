const express = require("express");
const router = express.Router();
const queryDatabase = require('../database')

router.post('/', async (req, res) => {
    const { boardId, name } = req.body;

    if (!boardId || !name) {
        return res.status(400).json({ message: "Missing boardId or name." });
    }

    try {
        const positionRes = queryDatabase(
            `SELECT COALESCE(MAX(position), -1) + 1 AS position FROM columns WHERE board_id = $1`,
            [boardId]
        );

        const position = positionRes.rows[0].position;

        const result = queryDatabase(
            `INSERT INTO columns (board_id, name, position) VALUES ($1, $2, $3) RETURNING *`,
            [boardId, name, position]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add column.", error: error.message });
    }
});

module.exports = router;
