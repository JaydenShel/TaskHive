const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//Import api files and assign routes
const loginRoute = require('./api/login')

app.use('/login', loginRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});