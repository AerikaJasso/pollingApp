const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const pusher = require('pusher');

const app = express();

const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable Cors
app.use(cors());
app.use('/poll', poll);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is connected to port ${port}`);
})