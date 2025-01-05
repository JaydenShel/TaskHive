const express = require("express")
const router = express.Router();

router.post('/', (req, res) => {
    //const {selectedUsername, selectedPassword} = req.body;
    //Query the database, create a new column with username, password
    try{
        return res.status(200).json({message: "Account Creation Successful"})
    }
    //Catch any errors, store as a message in response
    catch(error){
        return res.status(401).json({message: error});
    }
})

module.exports = router;
