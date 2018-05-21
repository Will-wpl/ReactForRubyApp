import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {AUCTION_PROPS, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import CounterDownShowOnLive from './on-live-counterdown';
import {getDHMSbetweenTwoTimes} from '../../javascripts/componentService/util';

export class DuringCountDown extends Component {
    constructor(props){
        super(props);
        this.state = {hour: 0, minute: 0, second: 0}
    }
    componentDidMount() {
        //this.getAuctionTime(this.props.auction);
        this.interval = setInterval(() => {
            this.getAuctionTime(this.props.auction);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAuctionTime(auction) {
        if (auction) {
            getAuctionTimeRule(auction.id).then(res => {
                let isOver = this.isCountDownOver(res[AUCTION_PROPS.ACTUAL_END_TIME], res[AUCTION_PROPS.ACTUAL_CURRENT_TIME]);
                if (!res[AUCTION_PROPS.HOLD_STATUS]) {
                    if (isOver) {
                        clearInterval(this.interval);
                        if (this.props.countDownOver) {
                            this.props.countDownOver();
                        }
                    }
                }
            }, error => {
                console.log(error)
            })
        }

    }

    isCountDownOver(startSeq, nowSeq) {
        const time = getDHMSbetweenTwoTimes(startSeq, nowSeq);
        const left = time.day || time.hour || time.minute || time.second;
        if (this.props.onSecondBreaker && time.divider <= this.props.secondBreaker) {
            this.props.onSecondBreaker();
        }
        if (left <= 0) {
            if (left === 0) {
                this.setState({day: 0, hour: 0, minute: 0, second: 0});
            }
            return true;
        }
        this.setState({hour: time.hour, minute: time.minute, second: time.second});
        return false;
    }

    render () {
        return (
            <CounterDownShowOnLive hour={this.state.hour} minute={this.state.minute} second={this.state.second}>
                {this.props.children}
            </CounterDownShowOnLive>
        )
    }
}

DuringCountDown.defaultProps = {
    secondBreaker: 3
}

DuringCountDown.PropTypes = {
    auction: PropTypes.shape({
        id: PropTypes.number.isRequired
    }).isRequired,
    secondBreaker: PropTypes.number,
    onSecondBreaker: PropTypes.func
}