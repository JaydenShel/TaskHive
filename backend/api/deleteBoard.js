const express = require('express')
const router = express.Router()
const queryDatabase = require('../database')

router.post('/', async (req, res) => {
    const {createdAt, username} = req.body;
    console.log(createdAt)
    await queryDatabase('DELETE FROM boards WHERE created_by = (SELECT id FROM credentials C WHERE C.username = $1) AND created_at = $2', [username, createdAt])
    return res.status(400);

})

module.exports = router