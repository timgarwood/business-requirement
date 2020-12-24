import React, { Component } from 'react';
import './KeyComponent.css';

export default class KeyComponent extends Component {
    render() {
        return (
            <li className="KeyComponent" onClick={() => this.props.clicked(this.props.keyCharacter)}>
                {this.props.keyCharacter}
            </li>
        )
    }
}