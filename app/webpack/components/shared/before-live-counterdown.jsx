import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export class CounterDownShowBeforeLive extends Component {

    render() {
        let title = `${this.props.auction.name} on ${moment(this.props.auction.start_datetime).format('D MMM YYYY hh:mm a')}`;
        return (
            <div className="time_cuntdown">
                <p>{title}</p>
                <div className="Countdown"><abbr>Countdown Timer:</abbr>
                    <ol id="countdown_timer">
                        <span><font id="countdown_timer_day">{this.props.day}</font>DAYS</span>
                        <span><font id="countdown_timer_hour">{this.props.hour}</font>HOURS</span>
                        <span><font id="countdown_timer_minute">{this.props.minute}</font>MINUTES</span>
                        <span><font id="countdown_timer_second">{this.props.second}</font>SECONDS</span>
                    </ol>
                    <div id="retailer_hold" className={this.props.isHold ? '' : 'live_hide'}>
                        <b>Reverse Auction has been put on hold due to an emergency situation. Reverse Auction will commence immediately once situation clears. Please continue to standby for commencement.</b>
                    </div>
                </div>
            </div>
        )
    }
}

CounterDownShowBeforeLive.defaultProps = {
    auction: {
        start_datetime: '',
        name: ''
    },
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    isHold: false
}

CounterDownShowBeforeLive.PropTypes = {
    auction: PropTypes.shape({
        start_datetime: PropTypes.string,
        name: PropTypes.string
    }),
    isHold: PropTypes.bool
}