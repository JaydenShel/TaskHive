const express = require("express")
const router = express.Router()
const queryDatabase = require('../database')

router.post("/",async (req, res) => {
    // Query to reset the users password
    const [password, newPassword] = req.body
    try{
        await queryDatabase('UPDATE credentials SET password=$1 WHERE password=$2', {newPassword, password})
        return res.status(200)
    }

    catch(error){
        return res.status(400).json({message: error})
    }

})

module.exports = router