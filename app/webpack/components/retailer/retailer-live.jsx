import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {DuringCountDown} from '../shared/during-countdown';
import LiveHomePage from './live-dashboard/home';
import {createWebsocket, getAuction, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';

const ACTUAL_END_TIME = 'actual_end_time';
const ACTUAL_CURRENT_TIME = 'current_time';
export class RetailerLive extends Component {
    constructor(props) {
        super(props);
        this.state = {showLive: false, extendVisible: false, holdStatus:false};
        this.localHoldStatus = false;
    }

    componentDidMount() {
        getAuction().then(auction => {
            this.auction = auction;
            console.log(this.auction);
            this.createSocket(auction ? auction.id : 1);
            // this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            // this.forceUpdate();
            getAuctionTimeRule(this.auction.id).then(res => {
                let divider = parseInt((moment(res[ACTUAL_END_TIME]).toDate().getTime()
                    - moment(res[ACTUAL_CURRENT_TIME]).toDate().getTime()) / 1000);
                let day = Math.floor(divider / (60 * 60 * 24));
                let hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
                let minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
                let second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
                let left = day || hour || minute || second;
                if (left <= 0) {
                    this.goToFinish();
                } else {
                    this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
                    this.forceUpdate();
                }
            }, error => {
                this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
                this.forceUpdate();
            })
        })
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.stopConnect();
        }
    }

    createSocket(auction) {
        this.ws = createWebsocket(auction);
        this.ws.onConnected(() => {
            console.log('---message client connected ---');
        }).onDisconnected(() => {
            console.log('---message client disconnected ----')
        }).onReceivedData(data => {
            console.log('---message client received data ---', data);
            if (data.action === 'extend') {
                this.setState({extendVisible : data.data.minutes});
                if (this.extendTimeout) {
                    clearTimeout(this.extendTimeout);
                }
                this.extendTimeout = setTimeout(() => {
                    this.setState({extendVisible : false});
                }, 5000);
            }
        })
    }

    goToFinish() {
        window.location.href=`/retailer/auctions/${this.auction.id}/finish`
    }

    nofityHoldStatus(status,isOver) {
        if(isOver){
            if(status === false){
                this.setState({showLive: true})
            }
            if (this.localHoldStatus !== status) {
                //console.log('status ====>', status, this.localHoldStatus);
                this.setState({holdStatus: status});
                this.localHoldStatus = status          
            }
        }
    }

    render() {
        return !this.state.showLive ? (
            <div>
                <TimeCuntDown countDownOver={() => this.setState({showLive: true})} title={this.timerTitle} auction={this.auction} listenHold={this.nofityHoldStatus.bind(this)}>
                    <div id="retailer_hold" className={this.state.holdStatus ? '' : 'live_hide'}>
                        <b>RA has been put on hold due to an emergency situation. RA will commence immediately once situation clears. Please continue to standby for commencement.</b>
                    </div>
                </TimeCuntDown>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Please standby,bidding will<br></br>
                        commence soon<br></br>
                        Page will automatically refresh when<br></br>reverse auction commences
                    </p>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
                </div>
            </div>
        ) : (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)}>
                    <div id="retailer_hold" className={this.state.extendVisible ? '' : 'live_hide'}>
                        <b>Admin has extended auction duration by {this.state.extendVisible} minuties</b>
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