import axios from 'axios';

/***
 * This class implements a service for sending requests to the 
 * sign up service REST endpoints
 * @class
 */
export default class SignUpService {
    /***
     * @param {string} name name of user
     * @param {string } emailAddress email address of user
     * @param {number} age age of user
     * @param {object} photo file object representing photo of user
     */
    signUp = (name, emailAddress, age, photo, callback) => {
        // create form data with file, name, email address and age
        // and set the http content type header to allow for file upload
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

        // post to the signup endpoint
        axios.post(`${window.location.origin}/api/signup`, formData, config)
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                // extract any HTTP error from the server
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

    /***
     * Retrieve all signed up users from the server
     * @param {function} callback callback method to receive response from the service
     */
    getAllUsers = (callback) => {
        axios.get(`${window.location.origin}/api/signup`)
            .then(response => {
                callback({
                    err: null,
                    response: response
                });
            })
            .catch(err => {
                // extract any HTTP error from the server
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