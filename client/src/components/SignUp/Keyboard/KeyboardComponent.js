import React, { Component } from 'react';
import KeyComponent from './KeyComponent';
import keyObj from './KeyboardData.json'
import './KeyboardComponent.css';

export default class KeyboardComponent extends Component {
    render() {
        let comps = keyObj.keys.map(character => {
            return (
                <KeyComponent key={character}
                    clicked={this.props.keyClicked}
                    keyCharacter={character} />
            )
        });

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