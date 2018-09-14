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
            if (this.props.rule) {
                if (!this.props.rule[HOLD_STATUS]) {
                    let beforeStartSpace = calTwoTimeSpace(this.props.rule[ACTUAL_BEGIN_TIME], this.props.rule[ACTUAL_CURRENT_TIME]);
                    if (beforeStartSpace > 0) {
                        this.setState({showLive: false});
                    } else {
                        let alreadyStartSpace = calTwoTimeSpace(this.props.rule[ACTUAL_END_TIME], this.props.rule[ACTUAL_CURRENT_TIME]);
                        if (alreadyStartSpace <= 0) {
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

    goToFinish() {
        window.location.href=`/retailer/auctions/${this.props.auction ? this.props.auction.id : 1}/finish`;
    }

    nofityHoldStatus(status, isOver) {
        if (isOver) {
            if (this.localHoldStatus !== status) {
                this.setState({holdStatus: status});
                this.localHoldStatus = status;
            }
        }
    }
    mouthsHtml(data,index){
        const html = <div key={index} className="col-sm-12 col-md-6 push-md-3">
            <h3 className={"u-mt2 u-mb2"}>{data.contract_duration} momths</h3>
            <div className="lm--formItem lm--formItem--inline string optional">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                    <tr>
                        <th></th>
                        {data.has_lt?<th>LT</th>:''}
                        {data.has_hts?<th>HTS</th>:''}
                        {data.has_htl?<th>HTL</th>:''}
                        {data.has_eht?<th>EHT</th>:''}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Peak<br/>(7am-7pm)</td>
                        {data.has_lt?<td>{data.starting_price_lt_peak}</td>:''}
                        {data.has_hts?<td>{data.starting_price_hts_peak}</td>:''}
                        {data.has_htl?<td>{data.starting_price_htl_peak}</td>:''}
                        {data.has_eht?<td>{data.starting_price_eht_peak}</td>:''}
                    </tr>
                    <tr>
                        <td>Off Peak<br/>(7pm-7am)</td>
                        {data.has_lt?<td>{data.starting_price_lt_off_peak}</td>:''}
                        {data.has_hts?<td>{data.starting_price_hts_off_peak}</td>:''}
                        {data.has_htl?<td>{data.starting_price_htl_off_peak}</td>:''}
                        {data.has_eht?<td>{data.starting_price_eht_off_peak}</td>:''}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        return html;
    }
    render() {
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
                        {this.props.auction.live_auction_contracts?
                            <div className="createRaMain u-grid">
                                <h2>Starting Price</h2>
                                {this.props.auction.live_auction_contracts.length>0?
                                    this.props.auction.live_auction_contracts.map((item,index)=>{
                                        this.mouthsHtml(item,index);
                                    }):''
                                }
                            </div>:''
                        }
                        <div className="createRaMain u-grid">
                            <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
                        </div>
                    </div>
                ) : (
                    <div>
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
                        Action not allowed.
                    </p>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/auctions" >Back</a>
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
        getAuction('retailer').then(auction => {
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