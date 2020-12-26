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
        let cssClass = "KeyComponent KeyComponent-normal";
        if (this.props.keyCharacter === 'back') {
            cssClass = "KeyComponent KeyComponent-backspace";
        }

        return (
            <li className={cssClass} onClick={() => this.props.clicked(this.props.keyCharacter)}>
                {this.props.keyCharacter}
            </li>
        )
    }
}