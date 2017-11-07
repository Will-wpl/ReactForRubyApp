import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {DuringCountDown} from '../shared/during-countdown';
import LiveHomePage from './live-dashboard/home'

export class RetailerLive extends Component {
    constructor(props) {
        super(props);
        this.state = {showLive: false}
    }

    render() {
        return !this.state.showLive ? (
            <div>
                <TimeCuntDown countDownOver={() => this.setState({showLive: true})}/>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Please standy,bidding will<br></br>
                        commence soon<br></br>
                        Page will automatically refresh when<br></br>reverse auction commences
                    </p>
                </div>
            </div>
        ) : (
            <div>
                <DuringCountDown admin_hold="hide" retailer_hold="show"/>
                <LiveHomePage/>
            </div>
        );
    }
}

function runes() {
    const domNode = document.getElementById('retailerlive');
    if (domNode !== null) {
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