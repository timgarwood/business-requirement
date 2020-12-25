import React, { Component } from 'react';
import KeyComponent from './KeyComponent';
import './KeyboardComponent.css';

// import the keyboard json data
import keyObj from './KeyboardData.json'

/***
 * This class implements a simple keyboard component
 * @class
 */
export default class KeyboardComponent extends Component {
    /***
     * render the component
     */
    render() {
        // map each key in the keyboard json data
        // to a KeyComponent
        let comps = keyObj.keys.map(character => {
            return (
                <KeyComponent key={character}
                    clicked={this.props.keyClicked}
                    keyCharacter={character} />
            )
        });

        // special handling for the 'backspace' button
        comps.push((
            <KeyComponent style={{ width: "50px" }}
                key="back"
                clicked={this.props.backClicked}
                keyCharacter="back"></KeyComponent>
        ));

        return (
            <ul className="KeyboardComponent">
                {comps}
            </ul>
        )
    }
}