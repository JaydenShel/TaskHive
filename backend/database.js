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
            // Single query case
            const result = await client.query(queryOrQueries, params);
            return result.rows;
        } else if (Array.isArray(queryOrQueries)) {
            // Multiple queries case
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


//Create credentials table (Username, Password, ID)
queryDatabase(`
    CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(16) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

`);

module.exports = queryDatabase;