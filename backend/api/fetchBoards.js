const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    // Fetch data for each board
    return res.status(200)
})



module.exports = router