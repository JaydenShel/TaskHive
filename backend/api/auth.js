const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken")

router.get('/', (req, res) => {
    console.log("Success")
    //Retrieve the auth token from the cookie
    const token = req.cookies.token;

    //If no token exists, return 401 unauthorized
    if(!token){
        res.status(401);
    }
    else{
        try{
            //Decode and verify the token
            const decoded_token = jwt.verify(token, process.env.SECRET_KEY)
        }
        catch(error){
            return res.status(200).json({message: error})
        }
        return res.status(200);
    }
    return res.status(200);
})

module.exports = router;