//api/login.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const queryDatabase = require("../database")

//Secret key for signing the JWT
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

router.post('/', (req, res) => {
    const {username, password} = req.body;

    //Ensure the password is proper length
    if (password.length < 8 || password.length > 16) {
        res.status(200).json({message: "Improper Length"})
    }

    //Handle query to find row with username, and verify password
    if (username === 'admin' && password === 'password123') {
        //Generate JWT and return message and token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        //Create a secure cookie to store JWT token
        res.cookie("token", token, {
            httpOnly: true, //XSS protection
            secure: true, //Man-in-the-middle protection
            sameSite: 'strict', //CSRF protection
            expires: new Date(Date.now() + 3600000), //1hr Expiration (User is logged out)
        });

        return res.status(200).json({ message: 'Login successful!', username});
    } else {
        return res.status(401).json({message: 'Invalid credentials!'});
    }
    }
)

module.exports = router;
