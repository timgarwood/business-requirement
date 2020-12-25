/**
 * This module implements a wrapper around the sqlite database
 * for the sign up page
 * @author Tim Garwood
 * @module
 */

var sqlite = require('sqlite3');

var maxNameLength = 30;
var maxEmailLength = 100;
var minAge = 18;

// set up the sqlite database
var db = new sqlite.Database('./spies.db', (err) => {
    if (!err) {
        db.serialize(() => {
            db.run(`create table users(name varchar(${maxNameLength}), email varchar(${maxEmailLength}), photo TEXT, age int check(age >= ${minAge}))`, (err) => {
                //ignore errors if table already exists
            });
        })
    }
});

module.exports = {
    /**
     * Adds a new user to the database
     * @param {string} name 
     * @param {string} emailAddress 
     * @param {int} age 
     * @param {string} photo 
     * @param {function} callback 
     */
    createUser: function (name, emailAddress, age, photo, callback) {
        db.run(`insert into users ([name],[email],[photo], [age]) values(\"${name}\", \"${emailAddress}\", \"${photo}\", ${age})`, (err) => {
            callback(err);
        });
    },

    /**
     * Get all users who have signed up
     * @param {function} callback 
     */
    getAllUsers: function (callback) {
        db.all('select * from users', (err, rows) => {
            callback(err, rows);
        });
    },

    /**
     * The maximum length allowed for a user name
     */
    maxNameLength: maxNameLength,
    /**
     * The maximum length allowed for an email address
     */
    maxEmailLength: maxNameLength,
    /**
     * The minimum age allowed
     */
    minAge: minAge
}