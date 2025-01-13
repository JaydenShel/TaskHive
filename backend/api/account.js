const express = require("express")
const router = express.Router();
const registerUser = require('../services/registerUser')

router.post('/', async (req, res) => {
    const {selectedUsername, selectedPassword} = req.body;

    //Ensure password and username exists
    if(!selectedPassword || ! selectedPassword){
        return res.status(400).json({message: "Missing Either Username or Password."})
    }

    //Attempt to register the user
    try{
        await registerUser(selectedUsername, selectedPassword);
        return res.status(200).json({message: "Account Created!"})
    }
    //Catch any errors, store as a message in response
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Account creation failed.", error: error.message });
    }
})

module.exports = router;
