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
        let rows = keyObj.keyRows.map(row => {
            let keyComps = [];
            for (var i = 0; i < row.keys.length; ++i) {
                const character = row.keys.charAt(i);
                keyComps.push(
                    <KeyComponent key={character}
                        clicked={this.props.keyClicked}
                        keyCharacter={character} />);
            }

            if (row.back) {
                // special handling for the 'backspace' button
                keyComps.push((
                    <KeyComponent
                        key="back"
                        clicked={this.props.backClicked}
                        keyCharacter="back"></KeyComponent>
                ));
            }

            return (
                <ul className="KeyboardRowComponent">
                    {keyComps}
                </ul>
            )
        });

        return (
            <ul className="KeyboardComponent">
                {rows}
            </ul>
        )
    }
}