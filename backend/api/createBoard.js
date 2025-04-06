const express = require("express")
const router = express.Router()
const queryDatabase = require("../database")

router.post('/', async (req, res) => {
    const {boardName} = req.body
    console.log(boardName)

    //queryDatabase("SELECT id FROM credentials WHERE username = 'das'");
    //queryDatabase("INSERT INTO boards (name, createdBy, createdAt) VALUES ($1, $2, $3)", [boardName])

    return res.status(200)
})

module.exports = router