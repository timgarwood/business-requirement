/**
 * This module implements a API controller for creating and retrieving
 * spies who have signed up
 * @author Tim Garwood
 * @module
 */

const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = {
    /**
     * Creates a new spy using the body and photo file in the request object
     * Request must contain 3 parameters in the body: name, emailAddress and age
     * Request must also contain a photo file called 'file' 
     * Request header Content-Type must be 'multipart/form-data'
     * @param {object} db the database wrapper object
     * @param {object} request the express request object
     * @param {object} response the express response object
     */
    createNewSpy: function (db, request, response) {
        // check for invalid body
        if (!request.body ||
            !request.body.name ||
            !request.body.emailAddress ||
            !request.body.age) {
            return response.status(400)
                .send({ err: 'Invalid request body' });
        }

        // check for invalid email
        const emailRegex = /^[\w\.]+@[\w\.]+\.[\w\.]+/;
        if (!emailRegex.test(request.body.emailAddress)) {
            return response.status(400)
                .send({ err: 'Invalid email address' });
        }

        // check for name too long
        if (request.body.name.length > db.maxNameLength) {
            return response.status(400)
                .send({ err: `Name cannot exceed ${db.maxNameLength} characters` });
        }

        // check for email too long
        if (request.body.emailAddress.length > db.maxEmailLength) {
            return response.status(400)
                .send({ err: `Email cannot exceed ${db.maxEmailLength} characters` });
        }

        // check for invalid age
        if (isNaN(parseInt(request.body.age))) {
            return response.status(400)
                .send({ err: `Invalid age` });
        }

        // check for age under the minimum
        if (parseInt(request.body.age) < db.minAge) {
            return response.status(400)
                .send({ err: `Must be at least ${db.minAge} years old` });
        }

        // check to ensure that express was able to pull the photo file
        // from the multipart/form-data
        if (!request.files || !request.files.file) {
            return response.status(400)
                .send({ err: 'A photo is required' });
        }

        // check for file size over the limit
        if (request.files.file.truncated) {
            return response.status(400)
                .send({ err: 'File size exceeded' });
        }

        // create a unique filename for the photo and move it to the public folder
        // where it can be served
        const photoPath = `${uuidv4()}`;
        request.files.file.mv(path.join('public', photoPath), (err) => {
            // check for error while saving photo
            if (err) {
                return response.status(500)
                    .send({ err: 'An error occurred while saving your photo' });
            } else {
                // add the spy to the database
                db.createSpy(request.body.name, request.body.emailAddress, request.body.age, photoPath, (err) => {
                    // check for error saving to database
                    if (err) {
                        return response.status(500)
                            .send({ err: 'An error occurred during sign up' })
                    } else {
                        // spy was added successfully
                        return response.status(200)
                            .send();
                    }
                });
            }
        });
    },

    /**
     * Get all of the spies who have signed up
     * @param {object} db the database wrapper object
     * @param {object} response the express response object
     */
    getAllSpies: function (db, response) {
        // query the database
        db.getAllSpies((err, rows) => {
            // check for error on query
            if (err) {
                response.status(500)
                    .send({ err: 'An error occurred retrieving the spies' })
            } else {
                // spies queried successfully
                response.send({ rows: rows });
            }
        });
    }
}