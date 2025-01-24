const express = require("express")
const router = express.Router()

router.get('/', async (req, res) => {
    //Get the image from db

    //If fail to find image, user does not have one stored
    return res.status(200)
} )

module.exports = router