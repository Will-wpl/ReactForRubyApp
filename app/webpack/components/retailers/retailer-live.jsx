import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
export class RetailerLive extends Component {
    constructor(props){
        super(props);
    }
    render () {
        return (
            <div>
            <TimeCuntDown />
            <div className="live_show">
                <div className="live_show_top"></div>
                <p>
                Please standy,bidding will<br></br>
                commence soon<br></br>
                Page will automatically refresh when<br></br>reverse auction commences
                </p>
            </div>
            </div>
        )
    }
}

function runes() {
    const domNode = document.getElementById('retailerlive');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerLive),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    runes();
} else {
    window.addEventListener('DOMContentLoaded', runes, false);
}