const express = require("express")
const router = express.Router()

router.post('/', async (req, res) => {
    const {boardName} = req.body
    console.log(boardName)


    return res.status(200)
})

module.exports = router