const express = require("express")
const queryDatabase = require("../database")
const router = express.Router();

router.post('/', (req, res) => {
    const {selectedUsername, selectedPassword} = req.body;
    const created_at = new Date();
    //Query the database, create a new column with username, password
    try{
        queryDatabase('INSERT INTO credentials (username, password, created_at) VALUES ($1, $2, $3)', [selectedUsername, selectedPassword, created_at])
            .then()
        return res.status(200).json({message: "Account Creation Successful"})
    }
    //Catch any errors, store as a message in response
    catch(error){
        console.log(error);
        return res.status(402).json({message: error});
    }
})

module.exports = router;
