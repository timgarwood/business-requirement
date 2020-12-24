import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class SpyComponent extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm">
                    <img style={{ width: "50px", height: "50px" }} src={this.props.photo}></img>
                </div>
                <div className="col-sm">
                    {this.props.name}
                </div>
                <div className="col-sm">
                    {this.props.emailAddress}
                </div>
                <div className="col-sm">
                    {this.props.age} years old
                </div>
            </div>
        )
    }
}
