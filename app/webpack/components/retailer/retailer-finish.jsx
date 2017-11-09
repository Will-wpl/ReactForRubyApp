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
            <div>
                <div className="u-grid">
                    <div id="live_modal">
                        <div className={this.state.holdOrend}></div>
                        <p>
                        The Reverse Auction has ended<br/>
                        Thank you for your participation!<br/>
                        You will be contacted separately<br/>
                        on the Reverse Auction results
                        </p>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
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