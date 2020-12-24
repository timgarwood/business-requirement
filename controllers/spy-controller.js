const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = {
    createNewUser: function (db, request, response) {
        if (!request.body ||
            !request.body.name ||
            !request.body.emailAddress ||
            !request.body.age) {
            return response.sendStatus(400);
        }

        const emailRegex = /^[\w\.]+@[\w\.]+\.[\w\.]+/;

        if (!emailRegex.test(request.body.emailAddress)) {
            return response.sendStatus(400);
        }

        if (request.body.name.length > db.maxNameLength) {
            return response.sendStatus(400);
        }

        if (request.body.emailAddress.length > db.maxEmailLength) {
            return response.sendStatus(400);
        }

        const photoPath = `${uuidv4()}`;
        request.files.file.mv(path.join('public', photoPath), (err) => {
            if (err) {
                return response.sendStatus(500);
            } else {
                db.createUser(request.body.name, request.body.emailAddress, request.body.age, photoPath, (err) => {
                    if (err) {
                        response.sendStatus(500);
                    } else {
                        response.sendStatus(200);
                    }
                });
            }
        });
    },

    getAllUsers: function (db, request, response) {
        db.getAllUsers((err, rows) => {
            if (err) {
                response.sendStatus(500);
            } else {
                response.json({ rows: rows });
            }
        });
    },

    getAllSkills: function (request, response) {
        db.getAllSkills((err, rows) => {
            if (err) {
                response.sendStatus(500);
            } else {
                response.json({ rows: rows });
            }
        })
    }
}