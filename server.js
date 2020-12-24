var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var jsonParser = bodyParser.json();
var db = require('./spydb');
var controller = require('./controllers/spy-controller.js');

app.use(cors());

app.post('/api/signup', jsonParser, (request, response) => {
    controller.createNewUser(db, request, response)
});

app.get('/api/signup', jsonParser, (request, response) => {
    controller.getAllUsers(db, request, response);
});

app.get('/api/skills', jsonParser, (request, response) => {
    controller.getAllSkills(db, request, response);
});

server.listen(5555, function () {
    console.log('server now listening on 5555');
});