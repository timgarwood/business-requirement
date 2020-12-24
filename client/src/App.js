import React, { Component } from 'react';
import KeyboardComponent from './components/SignUp/Keyboard/KeyboardComponent';
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import spyLogo from './images/spy.jpg';
import SignUpService from './services/SignUpService';
import SpyListComponent from './components/SpyList/SpyListComponent';

export default class App extends Component {
    nameRef = null;
    emailRef = null;
    ageRef = null;

    state = {
        signingUp: false,
        gettingUsers: false,
        signUpError: null,
        signUpSuccess: false,
        signUpEnabled: false,
        refreshSpiesError: false,
        photoFile: null,
        photoUrl: "",
        spyList: []
    };

    constructor() {
        super();

        this.nameRef = React.createRef();
        this.emailRef = React.createRef();
        this.ageRef = React.createRef();
        this.currentRef = null;
        this.service = new SignUpService();
    }

    keyClicked = (character) => {
        if (this.currentRef) {
            this.currentRef.current.value += character;
        }

        this.setState({
            signUpEnabled: this.isSignUpButtonEnabled()
        })
    }

    refreshSpies = () => {
        this.service.getAllUsers((data) => {
            console.log(JSON.stringify(data));
            if (data.err) {
                this.setState({
                    refreshSpiesError: data.err,
                });
            } else {
                this.setState({
                    spyList: data.response.data.rows
                })
            }
        });
    }

    backClicked = (character) => {
        if (this.currentRef) {
            if (this.currentRef.current.value &&
                this.currentRef.current.value.length > 0) {
                this.currentRef.current.value = this.currentRef.current.value.slice(0, this.currentRef.current.value.length - 1);
            }
        }

        this.setState({
            signUpEnabled: this.isSignUpButtonEnabled()
        })
    }

    signUpClicked = (evt) => {
        this.setState({
            signingUp: true,
            signUpError: null,
            signUpSuccess: false
        });

        this.service.signUp(this.nameRef.current.value,
            this.emailRef.current.value,
            this.ageRef.current.value,
            this.state.photoFile,
            this.signUpCompleted);
    }

    signUpCompleted = (data) => {
        if (data.err) {
            this.setState({
                signUpError: data.err,
                signUpSuccess: false,
                signUpEnabled: this.isSignUpButtonEnabled()
            });
        } else {
            this.nameRef.current.value = "";
            this.emailRef.current.value = "";
            this.ageRef.current.value = "";

            this.setState({
                photoFile: null,
                photoUrl: "",
                signUpError: null,
                signUpSuccess: true,
                signUpEnabled: this.isSignUpButtonEnabled()
            });
        }
    }

    isSignUpButtonEnabled = () => {
        return this.nameRef.current.value.length > 0 &&
            this.emailRef.current.value.length > 0 &&
            this.ageRef.current.value.length > 0 &&
            this.state.photoUrl.length > 0;
    }

    setRefToName = () => {
        this.currentRef = this.nameRef;
    }

    setRefToEmail = () => {
        this.currentRef = this.emailRef;
    }

    setRefToAge = () => {
        this.currentRef = this.ageRef;
    }

    photoChanged = (e) => {
        this.setState({
            photoFile: e.target.files[0],
            photoUrl: URL.createObjectURL(e.target.files[0])
        });
    }

    render() {
        let errorDiv = null;
        let successDiv = null;
        let spyListComponent = null;
        if (this.state.signUpError) {
            errorDiv = (
                <div className="alert alert-danger">
                    An error occurred: {this.state.signUpError}
                </div>
            );
        }

        if (this.state.signUpSuccess) {
            successDiv = (
                <div className="alert alert-success">
                    Thanks! You're signed up now.
                </div>
            )
        }

        if (this.state.spyList) {
            spyListComponent = (
                <SpyListComponent spyList={this.state.spyList}>
                </SpyListComponent>
            )
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
                        We can't let the hackers know who is joining our Spy Team.  Join the Spy Team using the built-in keyboard below!
                        </div>
                </div>

                <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-sm">
                        <p>
                            <input type="file" onChange={this.photoChanged}>
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
                            disabled={!this.state.signUpEnabled}
                            className="btn btn-success">Sign Up</button>

                        {errorDiv}
                        {successDiv}
                    </div>
                    <div className="col-md-6" style={{ borderStyle: "solid", borderWidth: "2px" }}>
                        <div className="row">
                            <div className="col-sm" style={{ textAlign: "center" }}>
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