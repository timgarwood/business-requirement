# Spy Team Sign Up Application

This repository contains the Spy Team Sign Up Application.  This application implements the business requirement by having users sign up using an on-screen keyboard.

# Building and Running the application
The application is a NodeJS server with a React frontend. To build the application you will need to build both server and client.

1. In the root of the workspace, run: ```npm install```
3. In the ./client/build directory, run: ```npm install```
4. In the ./client/build directory, run: ```npm run build```
5. Finally, to run the server and have it serve the React client run the following command in the workspace root: ```npm start```

# Unit Tests
In the workspace root, run ```npm run tests```

# Swagger documentation
Swagger documentation is generated at runtime by swagger-jsdoc (http://www.github.com/Surnet/swagger-jsdoc).

Once the server is running, swagger documentation can be viewed at the /api/doc endpoint in your browser.

