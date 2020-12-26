import React, { Component } from 'react';
import KeyboardComponent from './components/SignUp/Keyboard/KeyboardComponent';
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import spyLogo from './images/spy.jpg';
import SignUpService from './services/SignUpService';
import SpyListComponent from './components/SpyList/SpyListComponent';

/***
 * This is the main react component for rendering the sign up form
 * and rendering the list of signed up users
 * @class 
 */
export default class App extends Component {
    // component state object
    state = {
        signUpError: null,
        signUpSuccess: false,
        signUpEnabled: false,
        refreshSpiesError: null,
        photoUrl: "",
        spyList: null
    };

    /***
     * Construct a new App
     * @constructor 
     */
    constructor() {
        super();

        // references to the 3 input fields so that they can be
        // manipulated from within this component
        this.nameRef = React.createRef();
        this.emailRef = React.createRef();
        this.ageRef = React.createRef();
        this.photoFile = null;
        this.currentRef = null;
        this.service = new SignUpService();
    }

    /***
     * Handle a character being clicked on the keyboard
     * @param {char} character
     */
    keyClicked = (character) => {
        // append the character to the current input reference
        if (this.currentRef) {
            this.currentRef.current.value += character;
        }

        // update the sign up button
        this.setState({
            signUpEnabled: this.isSignUpButtonEnabled()
        })
    }

    /***
     * Handle a request to refresh the list of spies
     */
    refreshSpies = () => {
        // query users from the service
        this.service.getAllUsers((data) => {
            // if there was an error on the query, update the state
            // to display the error
            if (data.err) {
                this.setState({
                    refreshSpiesError: data.err,
                    spyList: null
                });
            } else {
                // update the spy list to contain the data from the server
                this.setState({
                    spyList: data.response.data.rows,
                    refreshSpiesError: null
                })
            }
        });
    }

    /***
     * Handle the backspace button being clicked
     * @param {char} character
     */
    backClicked = (character) => {
        if (this.currentRef) {
            // if there is a selected input, remove the last character from that input
            if (this.currentRef.current.value &&
                this.currentRef.current.value.length > 0) {
                this.currentRef.current.value = this.currentRef.current.value.slice(0, this.currentRef.current.value.length - 1);
            }
        }

        // update the sign up button state
        this.setState({
            signUpEnabled: this.isSignUpButtonEnabled()
        })
    }

    /***
     * Handle the user clicking the Sign Up button
     * @param {object} evt
     */
    signUpClicked = (evt) => {
        // clear our sign up states
        this.setState({
            signUpError: null,
            signUpSuccess: false
        });

        // send sign up reques to the service
        this.service.signUp(this.nameRef.current.value,
            this.emailRef.current.value,
            this.ageRef.current.value,
            this.photoFile,
            this.signUpCompleted);
    }

    /***
     * Callback when the server responds to the sign up request
     * @param {object} data
     */
    signUpCompleted = (data) => {
        if (data.err) {
            // display the sign up error message
            this.setState({
                signUpError: data.err,
                signUpSuccess: false,
                signUpEnabled: this.isSignUpButtonEnabled()
            });
        } else {
            // sign up was successful

            // clear the input states
            this.nameRef.current.value = "";
            this.emailRef.current.value = "";
            this.ageRef.current.value = "";
            this.photoFile = null;

            // reset internal state
            this.setState({
                photoUrl: "",
                signUpError: null,
                signUpSuccess: true,
                signUpEnabled: this.isSignUpButtonEnabled()
            });
        }
    }

    /***
     * Method to determine if the sign up button should be enabled
     */
    isSignUpButtonEnabled = () => {
        // sign up button is enabled if all fields have data
        // and a photo has been selected 
        return this.nameRef.current.value.length > 0 &&
            this.emailRef.current.value.length > 0 &&
            this.ageRef.current.value.length > 0 &&
            this.photoFile;
    }

    /***
     * Point the current input reference to the name input field
     */
    setRefToName = () => {
        this.currentRef = this.nameRef;
    }

    /***
     * Point the current input reference to the email input field
     */
    setRefToEmail = () => {
        this.currentRef = this.emailRef;
    }

    /***
     * Point the current input reference to the age input field
     */
    setRefToAge = () => {
        this.currentRef = this.ageRef;
    }

    /***
     * Callback for when the user selects a new photo
     */
    photoChanged = (e) => {
        this.photoFile = e.target.files[0];
        this.setState({
            photoUrl: URL.createObjectURL(e.target.files[0]),
            signUpEnabled: this.isSignUpButtonEnabled()
        });
    }

    /***
     * render this component
     */
    render() {
        let errorDiv = null;
        let successDiv = null;
        let spyListComponent = null;
        if (this.state.signUpError) {
            errorDiv = (
                <div className="alert alert-danger" style={{ textAlign: "center" }}>
                    An error occurred: {this.state.signUpError}
                </div>
            );
        } else if (this.state.signUpSuccess) {
            successDiv = (
                <div className="alert alert-success" style={{ textAlign: "center" }}>
                    Thanks! You're signed up now.
                </div>
            )
        }

        if (this.state.spyList) {
            if (this.state.spyList.length > 0) {
                spyListComponent = (
                    <SpyListComponent spyList={this.state.spyList}>
                    </SpyListComponent>
                )
            } else {
                spyListComponent = "There are no spies registered";
            }
        } else if (this.state.refreshSpiesError) {
            spyListComponent = (
                <div className="row alert alert-danger">
                    {this.state.refreshSpiesError}
                </div>
            );
        }

        return (
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-sm" style={{ textAlign: "center" }}>
                        <h2>Sign Up for the Spy Team!</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" style={{ textAlign: "center" }}>
                        <img src={spyLogo}></img>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" style={{ textAlign: "center" }}>
                        <h3>Oh no! Hackers have installed keyloggers on our machines!</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" style={{ textAlign: "center" }}>
                        We can't let the hackers know who is joining our Spy Team.  Join the Spy Team using the secure keyboard below!
                        </div>
                </div>
                <div className="row" style={{ marginTop: "50px" }}>
                    <div className="col-sm" style={{ textAlign: "center" }}>
                        {errorDiv}
                        {successDiv}
                    </div>
                </div>


                <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-sm">
                        <p>
                            <input type="file" accept="image/*" onChange={this.photoChanged}>
                            </input>
                        </p>
                        <p>
                            <img width="200px"
                                height="200px"
                                src={this.state.photoUrl}
                                alt="Select a photo"></img>
                        </p>
                        <p>

                            <label htmlFor="name">Name: </label>
                            <input id="name"
                                onClick={this.setRefToName}
                                type="text"
                                ref={this.nameRef}>
                            </input>
                        </p>
                        <p>
                            <label htmlFor="email">Email: </label>
                            <input id="email"
                                onClick={this.setRefToEmail}
                                type="text"
                                ref={this.emailRef}>
                            </input>
                        </p>
                        <p>
                            <label htmlFor="age">Age: </label>
                            <input id="age"
                                onClick={this.setRefToAge}
                                type="number"
                                ref={this.ageRef}>
                            </input>
                        </p>
                        <KeyboardComponent
                            backClicked={this.backClicked}
                            keyClicked={this.keyClicked}>
                        </KeyboardComponent>
                        <button onClick={this.signUpClicked}
                            style={{ marginTop: "20px" }}
                            disabled={!this.state.signUpEnabled}
                            className="btn btn-success">Sign Up</button>

                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm"
                                style={{ textAlign: "center", marginBottom: "20px" }}>
                                <button onClick={this.refreshSpies}
                                    className="btn btn-success">Click to see spies!</button>
                            </div>
                        </div>
                        {spyListComponent}
                    </div>
                </div>
            </div >
        )
    }
}