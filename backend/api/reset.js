const express = require("express")
const router = express.Router()
const queryDatabase = require('../database')

router.post("/",async (req, res) => {
    // Query to reset the users password
    const [password, newpassword] = req.body
    queryDatabase('', {})


    return res.status(400)
})

module.exports = router