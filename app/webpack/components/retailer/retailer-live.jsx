import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {DuringCountDown} from '../shared/during-countdown';
import LiveHomePage from './live-dashboard/home';
import {getAuction} from '../../javascripts/componentService/common/service';
import moment from 'moment';

export class RetailerLive extends Component {
    constructor(props) {
        super(props);
        this.state = {showLive: false}
    }

    componentDidMount() {
        getAuction().then(auction => {
            this.auction = auction;
            console.log(this.auction);
            this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.forceUpdate();
        })
    }

    render() {
        return !this.state.showLive ? (
            <div>
                <TimeCuntDown countDownOver={() => this.setState({showLive: true})} title={this.timerTitle} auction={this.auction}/>
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
                <DuringCountDown auction={this.auction}>
                    <div id="retailer_hold">
                        <b>Admin has extended auction duration by 2 minutes</b>
                    </div>
                </DuringCountDown>
                <LiveHomePage auction={this.auction}/>
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