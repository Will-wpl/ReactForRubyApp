import React, { Component, PropTypes } from 'react'
import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';

const ACTUAL_END_TIME = 'actual_end_time';
const ACTUAL_CURRENT_TIME = 'current_time';
const HOLD_STATUS = 'hold_status';
export class DuringCountDown extends Component {
    constructor(props){
        super(props);
        this.state = {minute: 0, second: 0}
    }
    componentDidMount() {
        this.getAuctionTime();
        this.interval = setInterval(() => {
            this.getAuctionTime();
        }, 1000);
        //test
        // setTimeout(() => {
        //     clearInterval(this.interval);
        //     setTimeout(() => {
        //         if (this.props.countDownOver) {
        //             this.props.countDownOver();
        //         }
        //     }, 1000)
        // }, 2000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAuctionTime() {
        getAuctionTimeRule(1).then(res => {
            let isOver = this.isCountDownOver(moment(res[ACTUAL_END_TIME]).toDate().getTime()
                , moment(res[ACTUAL_CURRENT_TIME]).toDate().getTime());
            if (isOver) {
                if (!res[HOLD_STATUS]) {
                    clearInterval(this.interval);
                    if (this.props.countDownOver) {
                        this.props.countDownOver();
                    }
                }
            }
        }, error => {
            console.log('whoops dam it')
        })
    }

    isCountDownOver(startSeq, nowSeq) {
        let divider = parseInt((startSeq - nowSeq) / 1000);
        let day = Math.floor(divider / (60 * 60 * 24));
        let hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let left = minute || second;
        if (left <= 0) {
            return true;
        }
        this.setState({minute: minute, second: second});
        return false;
    }

    render () {
        return (
            <div className="time_cuntdown during">
                <p>SP Reverse Auction on 1 Dec 2017,10:00AM</p>
                <div className="Countdown">
                    <abbr>Countdown Timer:</abbr>
                    <ol id="during_countdown_timer">
                        <span><font>{this.state.minute}</font>MINUTES</span>
                        <span><font>{this.state.second}</font>SECONDS</span>
                    </ol>
                    {
                        this.props.children
                    }
                    {/*<div id="admin_hold" className={this.props.admin_hold}><span>Extend Time:</span><input type="tel" className="fill_hold"/><span>Min</span><input type="submit" className="hold_submit" value="Submit"/></div>*/}
                    {/*<div id="retailer_hold" className={this.props.retailer_hold}><b>Admin has extended auction duration by 2 minuties</b></div>*/}
                </div>
            </div>
        )
    }
}