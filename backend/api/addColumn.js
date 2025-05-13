const express = require("express");
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { boardId, name } = req.body;

    console.log("Incoming addColumn request:", { boardId, name });

    if (!boardId || !name) {
        return res.status(400).json({ message: "Missing boardId or name." });
    }

    try {
        const positionRes = await queryDatabase(
            `SELECT COALESCE(MAX(position), -1) + 1 AS position FROM columns WHERE board_id = $1`,
            [boardId]
        );

        const position = positionRes?.[0]?.position ?? 0;
        console.log("Position result:", positionRes);

        const result = await queryDatabase(
            `INSERT INTO columns (board_id, name, position) VALUES ($1, $2, $3) RETURNING *`,
            [boardId, name, position]
        );

        console.log("Insert result:", result);

        if (!result?.length) {
            return res.status(500).json({ message: "Failed to create column." });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Add Column Error:", error);
        res.status(500).json({ message: "Failed to add column.", error: error.message });
    }
});

module.exports = router;
