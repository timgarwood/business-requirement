/**
 * This application implements a simple server for the 
 * sign up endpoints
 * @author Tim Garwood
 */

// require express
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./spydb');
const controller = require('./controllers/spy-controller.js');
const fileUpload = require('express-fileupload');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'Sign Up API',
            version: '1.0.0',
            description: 'This is the API to sign up spies for the Spy Team app',
        },
        host: "localhost:5555",
        basePath: '/',
        schemes: ["http"]
    },
    apis: ["server.js"]
};

const specs = swaggerJsDoc(options);

/**
 * @swagger
 * tags:
 *  - name: signup
 *    description: endpoints related to signing up and retrieving spies
 */

/** 
 * @swagger 
 * /api/signup: 
 *   post:
 *     description: |
 *       This endpoint will create a new spy and return a HTTP 200 status code if successful.
 *       If the request is invalid it will return a HTTP 400 status code and an error description
 *       If some other error occurs, it will return a HTTP 500 status code and an error description
 *     tags:
 *       - signup
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: name of the spy
 *                 example: Bob Smith
 *               emailAddress:
 *                 type: string
 *                 description: email address of the spy
 *                 example: bob@email.net
 *               age:
 *                 type: number 
 *                 description: age of the spy
 *                 example: 45
 *               file:
 *                 type: file
 *                 description: file object containing a photo of the spy
 *     responses:
 *       200: 
 *         description:  The spy was signed up successfully.
 *       400:
 *         description:  There was an invalid input provided
 *         schema:
 *           type: object
 *           properties:
 *             err:
 *               type: string
 *               description: A brief description of the error that occurred
 *       500:
 *         description:  An internal error occurred while signing up the spy
 *         schema:
 *           type: object
 *           properties:
 *             err:
 *               type: string
 *               description: A brief description of the error that occurred
 *   get: 
 *     description: | 
 *       This endpoint will return the list of spies who have signed up and a HTTP 200 status code if successful.
 *       If unsuccessful, it will return a HTTP 500 status code and an error description
 *     tags: 
 *       - signup
 *     produces: 
 *       - application/json 
 *     responses: 
 *       500:
 *         description: An internal error occurred while retrieving the spy
 *         schema:
 *           type: object
 *           properties:
 *             err:
 *               type: string
 *               description: A brief description of the error that occurred
 *       200: 
 *         description: OK 
 *         schema: 
 *           type: object
 *           description: object containing the array of spy entries
 *           properties: 
 *             rows: 
 *               type: array
 *               description: the spy entries
 *               items:
 *                 type: object
 *                 description: A spy entry. 
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: name of the spy 
 *                   email:
 *                     type: string
 *                     description: email of the spy 
 *                   age:
 *                     type: number
 *                     description: age of the spy 
 *                   photo:
 *                     type: string
 *                     description:
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "rows": [
 *                 {
 *                   "name" : "bob",
 *                   "email" : "bob@email.biz",
 *                   "age" : 44,
 *                   "photo" : "public/image-filename"
 *                 },
 *                 {
 *                   "name" : "tim",
 *                   "email" : "tim@email.biz",
 *                   "age" : 35,
 *                   "photo" : "public/image-filename2"
 *                 }
 *               ]
 *             } 
 */

// set upload file size limits
app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
    createParentPath: true
}));

app.post('/api/signup', (request, response) => {
    controller.createNewSpy(db, request, response)
});
app.get('/api/signup', (request, response) => {
    controller.getAllSpies(db, response);
});

// serve the public and client/build directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// run server
server.listen(5555, function () {
    console.log('server now listening on 5555');
});