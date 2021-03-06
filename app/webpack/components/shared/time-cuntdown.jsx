import React, {Component} from 'react';
import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';


const ACTUAL_BEGIN_TIME = 'actual_begin_time';
const ACTUAL_CURRENT_TIME = 'current_time';
const HOLD_STATUS = 'hold_status';

export class TimeCuntDown extends Component {
    constructor(props) {
        super(props);
        this.state = {day: 0, hour: 0, minute: 0, second: 0}
    }

    componentDidMount() {
        //this.getAuctionTime(this.props.auction);
        if (this.props.auction) {
            //console.log(this.props.auction);
            this.timerTitle = this.props.auction.start_datetime ? `${this.props.auction.name} on ${moment(this.props.auction.start_datetime).format('D MMM YYYY hh:mm a')}` : '';
        }
        this.interval = setInterval(() => {
            this.getAuctionTime(this.props.auction);
        }, 1000);
        if(this.props.timehidden){
            $("#"+this.props.timehidden).hide();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAuctionTime(auction) {
        if (auction) {
            getAuctionTimeRule(auction.id).then(res => {
                this.timerTitle = `${auction.name} on ${moment(res[ACTUAL_BEGIN_TIME]).format('D MMM YYYY hh:mm A')}`;
                const isOver = this.isCountDownOver(moment(res[ACTUAL_BEGIN_TIME]).toDate().getTime()
                    , moment(res[ACTUAL_CURRENT_TIME]).toDate().getTime());
                if (this.props.hasOwnProperty('listenHold')) {
                    this.props.listenHold(res[HOLD_STATUS], isOver);
                }
                if(isOver){
                    if (this.props.btnDisabled) {
                        this.props.btnDisabled();
                    }
                }
                if (!res[HOLD_STATUS]) {
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
        let divider = parseInt((startSeq - nowSeq) / 1000);
        let day = Math.floor(divider / (60 * 60 * 24));
        let hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let left = day || hour || minute || second;
        // this.setState({day: day, hour: hour, minute: minute, second: second});
        if (left <= 0) {
            if (left === 0) {
                this.setState({day: 0, hour: 0, minute: 0, second: 0});
            }
            return true;
        }
        this.setState({day: day, hour: hour, minute: minute, second: second});
        return false;
    }

    render() {
        return (
            <div className="time_cuntdown">
                <p>{this.timerTitle}</p>
                <div className="Countdown"><abbr>Countdown Timer:</abbr>
                    <ol id="countdown_timer">
                        <span id="countdown_days"><font>{this.state.day}</font>DAYS</span>
                        <span id="countdown_hours"><font>{this.state.hour}</font>HOURS</span>
                        <span id="countdown_minutes"><font>{this.state.minute}</font>MINUTES</span>
                        <span id="countdown_seconds"><font>{this.state.second}</font>SECONDS</span>
                    </ol>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

TimeCuntDown.defaultProps = {
    title:'SP Reverse Auction'
}