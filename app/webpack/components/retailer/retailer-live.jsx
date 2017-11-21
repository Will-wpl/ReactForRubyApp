import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {DuringCountDown} from '../shared/during-countdown';
import LiveHomePage from './live-dashboard/home';
import {createWebsocket, getAuction, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
import {getLoginUserId} from '../../javascripts/componentService/util';

const ACTUAL_END_TIME = 'actual_end_time';
const ACTUAL_CURRENT_TIME = 'current_time';
const ACTUAL_BEGIN_TIME = 'actual_begin_time';
const HOLD_STATUS = 'hold_status';
export class RetailerLive extends Component {
    constructor(props) {
        super(props);
        this.state = {extendVisible: false, holdStatus:false};
        this.localHoldStatus = false;
    }

    componentDidMount() {
        if (this.props.auction) {
            // this.createSocket(this.props.auction.id);
            if (this.props.rule) {
                if (!this.props.rule[HOLD_STATUS]) {
                    let beforeStartSpace = calTwoTimeSpace(this.props.rule[ACTUAL_BEGIN_TIME], this.props.rule[ACTUAL_CURRENT_TIME]);
                    if (beforeStartSpace > 0) {
                        // console.log('not start yet');
                        this.setState({showLive: false});
                    } else {
                        let alreadyStartSpace = calTwoTimeSpace(this.props.rule[ACTUAL_END_TIME], this.props.rule[ACTUAL_CURRENT_TIME]);
                        if (alreadyStartSpace <= 0) {
                            // console.log('already completed')
                            this.goToFinish();
                        } else {
                            this.setState({showLive: true});
                        }
                    }
                } else {
                    this.setState({showLive: false});
                }
            } else {
                this.setState({showLive: false});
            }
        }

    }

    // componentWillUnmount() {
    //     if (this.ws) {
    //         this.ws.stopConnect();
    //     }
    // }
    //
    // createSocket(auction) {
    //     this.ws = createWebsocket(auction);
    //     this.ws.onConnected(() => {
    //         console.log('---message client connected ---');
    //     }).onDisconnected(() => {
    //         console.log('---message client disconnected ----')
    //     }).onReceivedData(data => {
    //         console.log('---message client received data ---', data);
    //         if (data.action === 'extend') {
    //             this.setState({extendVisible : data.data.minutes});
    //             if (this.extendTimeout) {
    //                 clearTimeout(this.extendTimeout);
    //             }
    //             this.extendTimeout = setTimeout(() => {
    //                 this.setState({extendVisible : false});
    //             }, 5000);
    //         }
    //     })
    // }

    goToFinish() {
        window.location.href=`/retailer/auctions/${this.props.auction ? this.props.auction.id : 1}/finish`;
    }

    nofityHoldStatus(status, isOver) {
        if (isOver) {
            if (this.localHoldStatus !== status) {
                //console.log('status ====>', status, this.localHoldStatus);
                this.setState({holdStatus: status});
                this.localHoldStatus = status;
            }
        }
    }

    render() {
        // console.log('this.props', this.props);
        let content;
        if (this.props.auction) {
            if (this.state.hasOwnProperty('showLive')) {
                content = !this.state.showLive ? (
                    <div>
                        <TimeCuntDown countDownOver={() => this.setState({showLive: true})} auction={this.props.auction} listenHold={this.nofityHoldStatus.bind(this)}>
                            <div id="retailer_hold" className={this.state.holdStatus ? '' : 'live_hide'}>
                                <b>Reverse Auction has been put on hold due to an emergency situation. Reverse Auction will commence immediately once situation clears. Please continue to standby for commencement.</b>
                            </div>
                        </TimeCuntDown>
                        <div className={'live_show'} id="live_modal">
                            <div className={'live_hold'}></div>
                            <p>
                                Please standby, bidding will<br></br>
                                commence soon.<br></br>
                                Page will automatically refresh when<br></br>Reverse Auction commences.
                            </p>
                        </div>
                        <div className="createRaMain u-grid">
                            <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/*<DuringCountDown auction={this.props.auction} countDownOver={this.goToFinish.bind(this)}>*/}
                            {/*<div id="retailer_hold" className={this.state.extendVisible ? '' : 'live_hide'}>*/}
                                {/*<b>Admin has extended auction duration by {this.state.extendVisible} minuties</b>*/}
                            {/*</div>*/}
                        {/*</DuringCountDown>*/}
                        <LiveHomePage auction={this.props.auction}/>
                    </div>
                )
            } else {
                content = <div></div>;
            }
        } else {
            content = <div>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Auction may be not illegal, please fix auction configuration.
                    </p>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
                </div>
            </div>;
        }
        return content;
    }
}

const calTwoTimeSpace = (start, nowSeq) => {
    let divider = parseInt((moment(start).toDate().getTime() - moment(nowSeq).toDate().getTime()) / 1000);
    let day = Math.floor(divider / (60 * 60 * 24));
    let hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
    let minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
    let second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
    return day || hour || minute || second;
}

const runes = () => {
    const domNode = document.getElementById('retailerlive');
    if (domNode !== null) {
        getAuction().then(auction => {
            getAuctionTimeRule(auction.id).then(res => {
                renderRoot(auction, res);
            }, error => {
                renderRoot(auction);
            })
        }, error => {
            renderRoot();
        })
    }
}

const renderRoot = (auction = null, rule = null) => {
    const domNode = document.getElementById('retailerlive');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(RetailerLive, {auction: auction, rule: rule}),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    runes();
} else {
    window.addEventListener('DOMContentLoaded', runes, false);
}