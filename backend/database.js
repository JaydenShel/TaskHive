const { Client } = require('pg');

//Create client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

//Connect to Heruko postgres database
client.connect()
    .then(() => {
        console.log('Successfully connected to the Heroku Postgres database!');
    })
    .catch(err => {
        console.error('Database connection error:', err.stack);
    });

// Handles both single and multiple queries while preserving parameter passing
const queryDatabase = async (queryOrQueries, params) => {
    try {
        if (typeof queryOrQueries === "string") {
            //Single query case
            const result = await client.query(queryOrQueries, params);
            return result.rows;
        } else if (Array.isArray(queryOrQueries)) {
            //Multiple queries case
            const results = await Promise.all(
                queryOrQueries.map(({ query, params }) => client.query(query, params))
            );
            return results.map(result => result.rows);
        } else {
            throw new Error("Invalid query format");
        }
    } catch (error) {
        console.error("Problem executing query:", error);
        throw error;
    }
};


// Define the queries for creating tables
const schemaQueries = [
    { query: `CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(16) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );` },

    { query: `CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );` },

    { query: `CREATE TABLE IF NOT EXISTS columns (
        id SERIAL PRIMARY KEY,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        position INTEGER NOT NULL CHECK (position >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );` },

    { query: `CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
        column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        due_date TIMESTAMP,
        priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );` }
];

// Execute table creation using queryDatabase function
(async () => {
    try {
        await queryDatabase(schemaQueries);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
})();

module.exports = queryDatabase;