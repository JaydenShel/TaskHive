const express = require("express")
const router = express.Router()
const queryDatabse = require("../database")

router.get('/', async (req, res) => {
    const username = req.body

    // Fetch each board name and creation date per user id
    try{
        const boardInfo = await queryDatabse("SELECT name, created_at FROM boards B join credentials C ON B.created_by = (SELECT id FROM credentials WHERE username = $1) ORDER BY B.created_at ASC", [username])
        return res.status(200).json({boardInfo})
    }
    catch(error) {
        console.error("Error fetching boards:", error);
        return res.status(500).json({ error: "Server error fetching boards" });
    }
})



module.exports = router