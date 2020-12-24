import axios from 'axios';

export default class SignUpService {
    url = "http://localhost:5555/api";

    signUp = (name, emailAddress, age, photo, callback) => {
        axios.post(`${this.url}/signup`, { name, emailAddress, age, photo })
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                console.log(JSON.stringify(err));
                callback({
                    err: err,
                    response: null
                });
            });
    }

    getAllUsers = (callback) => {
        axios.get(`${this.url}/signup`)
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                callback({
                    err: err,
                    response: null
                });
            });
    }
}