import axios from 'axios';

export default class SignUpService {

    signUp = (name, emailAddress, age, photo, callback) => {
        let formData = new FormData();
        formData.append('file', photo);
        formData.append('name', name);
        formData.append('emailAddress', emailAddress);
        formData.append('age', age);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
        };

        axios.post(`${window.location.origin}/api/signup`, formData, config)
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                let error = null;
                if (err.response) {
                    error = err.response.data;
                }

                callback({
                    err: error.err,
                    response: null
                });
            });
    }

    getAllUsers = (callback) => {
        axios.get(`${window.location.origin}/api/signup`)
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                let error = null;
                if (err.response) {
                    error = err.response.data;
                }

                callback({
                    err: error.err,
                    response: null
                });
            });
    }
}