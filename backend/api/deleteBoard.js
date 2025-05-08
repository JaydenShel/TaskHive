const express = require('express');
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { id, username } = req.body;
    console.log("Delete request from:", username, "for board ID:", id);

    try {
        const result = await queryDatabase(
            `DELETE FROM boards 
             WHERE id = $1 
             AND created_by = (SELECT id FROM credentials WHERE username = $2)`,
            [id, username]
        );

        return res.status(200).json({ message: "Board deleted successfully" });
    } catch (err) {
        console.error("Error deleting board:", err);
        return res.status(500).json({ error: "Failed to delete board" });
    }
});

module.exports = router;
