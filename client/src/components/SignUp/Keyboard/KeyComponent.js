import React, { Component } from 'react';
import './KeyComponent.css';

/*** 
 * This class implements a simple component representing
 * a single key on the keyboard component
 * @class
 */
export default class KeyComponent extends Component {
    /***
     * render the component
     */
    render() {
        // a key component is a simple <li> element with a click handler
        return (
            <li className="KeyComponent" onClick={() => this.props.clicked(this.props.keyCharacter)}>
                {this.props.keyCharacter}
            </li>
        )
    }
}