import React, { Component } from 'react';
import SpyComponent from './SpyComponent'
import './SpyListComponent.css';
import 'bootstrap/dist/css/bootstrap.css';

/***
 * This class implements a component for displaying all of the 
 * spies in a list
 * @class
 */
export default class SpyListComponent extends Component {
    /***
     * render the component
     */
    render() {
        // map each spy model in the list to a SpyComponent
        let comps = this.props.spyList.map(spy => {
            return (
                <SpyComponent id={spy.email}
                    name={spy.name}
                    emailAddress={spy.email}
                    age={spy.age}
                    photo={spy.photo}></SpyComponent>
            )
        });

        return (
            <div className="SpyListComponent">
                {comps}
            </div>
        )
    }
}