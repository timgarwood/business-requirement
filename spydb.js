var sqlite = require('sqlite3');

var maxNameLength = 30;
var maxEmailLength = 100;

var db = new sqlite.Database('./spies.db', (err) => {
    if (!err) {
        db.serialize(() => {
            db.run(`create table users(name varchar(${maxNameLength}), email varchar(${maxEmailLength}), age int check(age >= 18))`, (err) => {
                //ignore errors if table already exists
            });
        })
    }
});

module.exports = {
    createUser: function (name, emailAddress, age, photo, callback) {
        db.run(`insert into users ([name],[email],[age]) values(\"${name}\", \"${emailAddress}\", ${age})`, (err) => {
            callback(err);
        });
    },

    getAllUsers: function (callback) {
        db.all('select * from users', (err, rows) => {
            callback(err, rows);
        });
    },

    maxNameLength: maxNameLength,
    maxEmailLength: maxNameLength
}