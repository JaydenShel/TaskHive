const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken")
const queryDatabase = require("../database")

router.get('/', async (req, res) => {
    //Retrieve the auth token from the cookie
    const token = req.cookies.token;

    //If no token exists, return 401 unauthorized
    if(!token){
        res.status(401);
    }
    else{
        try{
           //Retrieve decrypted token
            const decoded_token = jwt.verify(token, process.env.SECRET_KEY)

            //Verify the token by comparing with the username at current id
            const result = await queryDatabase('SELECT CASE WHEN username = $1 AND id = $2 THEN TRUE ELSE FALSE END AS condition_met FROM credentials WHERE username = $1', [decoded_token.username, decoded_token.user_id]);

            //If the expected username does not match the expected id, return unauthorized and log user out
            if(!result[0].condition_met){
                return res.status(401).json({message: "Invalid Token. Logging out"})
            }
            else{
                return res.status(200).json({message: "Token Verified"})
            }
        }
        catch(error){
            return res.status(400).json({message: error})
        }
    }
})

module.exports = router;