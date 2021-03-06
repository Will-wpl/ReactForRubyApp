import React, { Component } from 'react';

export default class CounterDownShowOnLive extends Component {

    render () {
        return (
            <div className="time_cuntdown during">
                <p>Reverse Auction has commenced. Please start bidding.</p>
                <div className="Countdown">
                    <abbr>Countdown Timer:</abbr>
                    <ol id="during_countdown_timer">
                        <span><font id="during_countdown_timer_hour">{this.props.hour}</font>HOURS</span>
                        <span><font id="during_countdown_timer_minute">{this.props.minute}</font>MINUTES</span>
                        <span><font id="during_countdown_timer_second">{this.props.second}</font>SECONDS</span>
                    </ol>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

CounterDownShowOnLive.defaultProps = {
    hour: 0,
    minute: 0,
    second: 0
}