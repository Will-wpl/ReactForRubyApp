import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export class RetailerFinish extends Component {
    constructor(props){
        super(props);
        this.state={
            holdOrend:"live_end"
        }
    }
    render () {
        return (
            <div className="u-grid">
            <div id="live_modal">
                <div className={this.state.holdOrend}></div>
                <p>
                The Reverse Auction has ended<br></br>
                Thank you for your participation!<br>
                You will be contacted separately<br></br>
                on the Reverse Auction results
                </p>
            </div>
            </div>
        )
    }
}

function runes() {
    const domNode = document.getElementById('RetailerFinish');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(RetailerFinish),
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