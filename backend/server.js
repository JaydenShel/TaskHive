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
const logoutRoute = require('./api/logout')
const loadProfileImage = require('./api/loadProfileImage')
const uploadImage = require('./services/image_upload')
const resetPassword = require('./api/reset')
const fetchBoards = require('./api/fetchBoards')
const createBoard = require('./api/createBoard')

app.use('/login', loginRoute)
app.use('/account', accountRoute)
app.use('/auth', authRoute)
app.use('/logout', logoutRoute)
app.use('/load-image', loadProfileImage)
app.use('/upload-image', uploadImage)
app.use('/reset', resetPassword)
app.use('/fetchBoards', fetchBoards)
app.use('/createBoards', createBoard)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
