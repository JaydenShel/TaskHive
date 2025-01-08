const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

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

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//Import api files and assign routes
const loginRoute = require('./api/login')
const accountRoute = require('./api/account')

app.use('/login', loginRoute);
app.use('/account', accountRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { queryDatabase };