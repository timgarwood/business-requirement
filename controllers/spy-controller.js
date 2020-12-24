const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = {
    createNewUser: function (db, request, response) {
        if (!request.body ||
            !request.body.name ||
            !request.body.emailAddress ||
            !request.body.age) {
            return response.status(400)
                .send({ err: 'Invalid request body' });
        }

        const emailRegex = /^[\w\.]+@[\w\.]+\.[\w\.]+/;

        if (!emailRegex.test(request.body.emailAddress)) {
            return response.status(400)
                .send({ err: 'Invalid email address' });
        }

        if (request.body.name.length > db.maxNameLength) {
            return response.status(400)
                .send({ err: `Name cannot exceed ${db.maxNameLength} characters` });
        }

        if (request.body.emailAddress.length > db.maxEmailLength) {
            return response.status(400)
                .send({ err: `Email cannot exceed ${db.maxEmailLength} characters` });
        }

        if (isNaN(parseInt(request.body.age))) {
            return response.status(400)
                .send({ err: `Invalid age` });
        }

        if (parseInt(request.body.age) < db.minAge) {
            return response.status(400)
                .send({ err: `Must be at least ${db.minAge} years old` });
        }

        if (!request.files) {
            return response.status(400)
                .send({ err: 'A photo is required' });
        }

        const photoPath = `${uuidv4()}`;
        request.files.file.mv(path.join('public', photoPath), (err) => {
            if (err) {
                return response.status(500)
                    .send({ err: 'An error occurred while saving your photo' });
            } else {
                db.createUser(request.body.name, request.body.emailAddress, request.body.age, photoPath, (err) => {
                    if (err) {
                        return response.status(500)
                            .send({ err: 'An error occurred during sign up' })
                    } else {
                        return response.status(200)
                            .send();
                    }
                });
            }
        });
    },

    getAllUsers: function (db, request, response) {
        db.getAllUsers((err, rows) => {
            if (err) {
                response.status(500)
                    .send({ err: 'An error occurred retrieving the users' })
            } else {
                response.send({ rows: rows });
            }
        });
    }
}