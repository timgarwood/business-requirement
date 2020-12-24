import React, { Component } from 'react';
import SpyComponent from './SpyComponent'
import 'bootstrap/dist/css/bootstrap.css';

export default class SpyListComponent extends Component {
    render() {
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
            <div>
                {comps}
            </div>
        )
    }
}