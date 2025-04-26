//api/login.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const queryDatabase = require("../database")
const bcrypt = require("bcrypt")

//Secret key for signing the JWT
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

router.post('/', async (req, res) => {
    const {username, password} = req.body;

    //Ensure the password is proper length
    if (password.length < 8 || password.length > 16) {
        res.status(200).json({message: "Improper Length"})
    }

    //Handle query to find row with username, and verify password
    try {
        //Retrieve the hashed password given the username
        const result = await queryDatabase('SELECT id, password FROM credentials WHERE username = $1', [username])

        //Ensure result exists
        if (!result || result.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const hashedPassword = result[0].password

        //Compare the hash
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password", error: "Incorrect Password"})
        }

        //Generate JWT and return message and token
        const token = jwt.sign({ user_id: result[0].id, username: username}, SECRET_KEY, { expiresIn: '1h' });

        //Create a secure cookie to store JWT token
        res.cookie("token", token, {
            httpOnly: true, //XSS protection
            secure: process.env.NODE_ENV === 'production', //Man-in-the-middle protection
            sameSite: 'None', //CSRF protection
            path: '/', //Cookie available site-wide
            expires: new Date(Date.now() + 3600000), //1hr Expiration (User is logged out)
        });

        return res.status(200).json({ message: 'Login successful!', username});
    } catch(error) {
        console.error("Login Error:", error);
        return res.status(401).json({message: 'Internal Server Error'});
    }
    }
)

module.exports = router;
