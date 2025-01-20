const express = require("express")
const router = express.Router();

router.post('/', async (req, res) => {
    //Delete jsonwebtoken cookie (expiration to current time)
    res.cookie("token", '', {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    })

    return res.status(200).json({message: "Successfully logged out"})
})

module.exports = router