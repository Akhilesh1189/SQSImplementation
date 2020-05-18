// Load the AWS SDK for Node.js


const express = require('express');
const bodyParser = require('body-parser');
var AWS = require('aws-sdk');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

// listen for requests
require('./app/routes/router')(app);
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});