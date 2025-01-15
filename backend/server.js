const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser  = require("cookie-parser")
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173', //Frontend URL
    credentials: true,  //Allow credentials (cookies)
};

//Use CORS with the specified options
app.use(cors(corsOptions));

//More middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.set("trust proxy", 1);

//Import api files and assign routes
const loginRoute = require('./api/login')
const accountRoute = require('./api/account')
const authRoute = require('./api/auth')

app.use('/login', loginRoute);
app.use('/account', accountRoute);
app.use('/auth', authRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
