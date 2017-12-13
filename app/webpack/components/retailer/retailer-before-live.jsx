import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CounterDownShowBeforeLive} from '../shared/before-live-counterdown';
import {AUCTION_PROPS, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import {getDHMSbetweenTwoTimes} from '../../javascripts/componentService/util';

export class RetailerBeforeLive extends Component {

    constructor(props) {
        super(props);
        this.mHoldStatus = false;
        this.state = {holdStatus:false, day: 0, hour: 0, minute: 0, second: 0}
    }
    componentDidMount() {
        this.getAuctionTime(this.props.auction.id);
        this.interval = setInterval(() => {
            this.getAuctionTime(this.props.auction.id);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <CounterDownShowBeforeLive
                    auction={this.props.auction} isHold={this.state.holdStatus}
                    day={this.state.day} hour={this.state.hour} minute={this.state.minute} second={this.state.second}/>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Please standby, bidding will<br></br>
                        commence soon.<br></br>
                        Page will automatically refresh when<br></br>Reverse Auction commences.
                    </p>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/home">Back to Homepage</a>
                </div>
            </div>
        );
    }

    getAuctionTime(auctionId) {
        getAuctionTimeRule(auctionId).then(res => {
            const isOver = this.isCountDownOver(res[AUCTION_PROPS.ACTUAL_BEGIN_TIME], res[AUCTION_PROPS.ACTUAL_CURRENT_TIME]);
            if (isOver) {
                if (this.mHoldStatus !== res[AUCTION_PROPS.HOLD_STATUS]) {
                    this.setState({holdStatus: res[AUCTION_PROPS.HOLD_STATUS]});
                    this.mHoldStatus = res[AUCTION_PROPS.HOLD_STATUS];
                }
            }
            if (isOver && !res[AUCTION_PROPS.HOLD_STATUS]) {
                clearInterval(this.interval);
                if (this.props.countDownOver) {
                    this.props.countDownOver();
                }
            }
        }, error => {
            console.log('whoops , server connection down')
        })
    }

    isCountDownOver(startSeq, nowSeq) {
        const time = getDHMSbetweenTwoTimes(startSeq, nowSeq);
        const left = time.day || time.hour || time.minute || time.second;
        if (left <= 0) {
            if (left === 0) {
                this.setState({day: 0, hour: 0, minute: 0, second: 0});
            }
            return true;
        }
        this.setState({day: time.day, hour: time.hour, minute: time.minute, second: time.second});
        return false;
    }
}

RetailerBeforeLive.PropTypes = {
    auction: PropTypes.shape({
        start_datetime: PropTypes.string,
        name: PropTypes.string
    }).isRequired,
    countDownOver: PropTypes.func
}