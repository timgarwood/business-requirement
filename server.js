const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonParser = bodyParser.json();
const db = require('./spydb');
const controller = require('./controllers/spy-controller.js');
const fileUpload = require('express-fileupload');
const path = require('path');

app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
    createParentPath: true
}));

app.post('/api/signup', jsonParser, (request, response) => {
    controller.createNewUser(db, request, response)
});

app.get('/api/signup', jsonParser, (request, response) => {
    controller.getAllUsers(db, request, response);
});

app.get('/api/skills', jsonParser, (request, response) => {
    controller.getAllSkills(db, request, response);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

server.listen(5555, function () {
    console.log('server now listening on 5555');
});