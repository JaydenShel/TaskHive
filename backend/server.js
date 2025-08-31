const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// API Routes
const loginRoute = require('./api/login');
const accountRoute = require('./api/account');
const authRoute = require('./api/auth');
const logoutRoute = require('./api/logout');
const resetPassword = require('./api/reset');
const fetchBoards = require('./api/fetchBoards');
const createBoard = require('./api/createBoard');
const deleteBoard = require('./api/deleteBoard');
const getColumnsAndTasks = require('./api/getColumnsAndTasks')
const addColumn = require('./api/addColumn')
const addTask = require('./api/addTask')
const toggleTaskDone = require('./api/toggleTaskDone')
const updateTaskPosition = require('./api/updateTaskPosition');
const updateTask = require('./api/updateTask');
const deleteTask = require('./api/deleteTask');
const uploadImageRoute = require('./aws/uploadController');
const loadImage = require('./api/load-image')

app.use('/login', loginRoute);
app.use('/account', accountRoute);
app.use('/auth', authRoute);
app.use('/logout', logoutRoute);
app.use('/reset', resetPassword);
app.use('/fetchBoards', fetchBoards);
app.use('/createBoards', createBoard);
app.use('/deleteBoard', deleteBoard);
app.use('/getColumnsAndTasks', getColumnsAndTasks)
app.use('/addColumn', addColumn)
app.use('/addTask', addTask)
app.use('/toggleTaskDone', toggleTaskDone)
app.use('/updateTaskPosition', updateTaskPosition);
app.use('/updateTask', updateTask);
app.use('/deleteTask', deleteTask);
app.use('/upload-image', uploadImageRoute);
app.use('/load-image', loadImage)

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
