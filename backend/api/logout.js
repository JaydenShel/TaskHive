const express = require("express")
const router = express().Router

router.post('/', async (req, res) => {
    //Delete jsonwebtoken cookie
    return res.status(200).json({message: "Successfully logged out"})
})

module.exports = router