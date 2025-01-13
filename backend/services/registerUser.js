// services/userService.js
const bcrypt = require("bcrypt");
const queryDatabase = require("../database");

async function registerUser(username, password) {
    const created_at = new Date();

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert into the database
    try {
        await queryDatabase(
            "INSERT INTO credentials (username, password, created_at) VALUES ($1, $2, $3)",
            [username, hashedPassword, created_at]
        );
    } catch (error) {
        throw new Error("Failed to register user: " + error.message);
    }
}

module.exports = registerUser;