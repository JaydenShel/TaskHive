const express = require('express');
const router = express.Router();
const queryDatabase = require('../database');

router.post('/', async (req, res) => {
    const { taskId } = req.body;

    if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required.' });
    }

    try {
        // Flip the 'done' boolean
        const updateQuery = `
            UPDATE tasks
            SET done = NOT done
            WHERE id = $1
            RETURNING id, done;
        `;
        const result = await queryDatabase(updateQuery, [taskId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json({ message: 'Task status updated.', task: result[0] });
    } catch (error) {
        console.error('Error toggling task status:', error);
        return res.status(500).json({ message: 'Server error while updating task.' });
    }
});

module.exports = router;
