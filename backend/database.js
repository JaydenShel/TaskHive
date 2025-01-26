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

//Take in any query and value for said query, send to database
const queryDatabase = async (query, params) =>{
    try{
        const result = await client.query(query, params);
        return result.rows;
    }
    catch(error){
        console.error("Problem executing query:", error);
        throw error;
    }
}

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