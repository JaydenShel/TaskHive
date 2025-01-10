const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Success")
    return res.status(200);
})

module.exports = router;