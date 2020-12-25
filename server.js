/**
 * This application implements a simple server for the 
 * sign up endpoints
 * @author Tim Garwood
 */

// require express
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const db = require('./spydb');
const controller = require('./controllers/spy-controller.js');
const fileUpload = require('express-fileupload');
const path = require('path');

// set upload file size limits
app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
    createParentPath: true
}));

// register a POST endpoint for creating users
app.post('/api/signup', jsonParser, (request, response) => {
    controller.createNewUser(db, request, response)
});

// register a GET endpoint for getting all signed up users
app.get('/api/signup', jsonParser, (request, response) => {
    controller.getAllUsers(db, response);
});

// serve the public and client/build directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

// run server
server.listen(5555, function () {
    console.log('server now listening on 5555');
});