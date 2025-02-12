// services/userService.js
const bcrypt = require("bcrypt");
const queryDatabase = require("../database");

async function registerUser(username, password) {
    const created_at = new Date();

    //Hash the password, 12 salt rounds for brute force protection
    const hash = await bcrypt.hash(password, 12);


    //Insert into the database
    try {
        //Make sure username is unique

        await queryDatabase(
            "INSERT INTO credentials (username, password, created_at) VALUES ($1, $2, $3)",
            [username, hash, created_at]
        );
    } catch (error) {
        throw new Error("Failed to register user: " + error.message);
    }
}

module.exports = registerUser;