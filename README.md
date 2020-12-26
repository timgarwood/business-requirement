# Spy Team Sign Up Application

This repository contains the Spy Team Sign Up Application.  This application implements the business requirement by having users sign up using an on-screen keyboard.

The application uses a simple sqlite database to store the users.  The sqlite database is stored in the workspace root and is called ```spies.db```.

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

Once the server is running, swagger documentation can be viewed at the /api/docs endpoint in your browser.

# jsdoc documentation
The source is documented with jsdoc style comments.  Jsdoc documentation is stored in the ```./docs``` folder. To generate the Jsdoc documentation yourself, you can run the following command in the root of the workspace:
```./node_modules/.bin/jsdoc --recurse *.js ./controllers/ -d ./docs```

