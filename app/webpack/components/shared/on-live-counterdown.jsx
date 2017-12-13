import React, { Component } from 'react';

export class CounterDownOnLive extends Component {

    render () {
        return (
            <div className="time_cuntdown during">
                <p>Reverse Auction has commenced. Please start bidding.</p>
                <div className="Countdown">
                    <abbr>Countdown Timer:</abbr>
                    <ol id="during_countdown_timer">
                        <span><font>{this.props.hour}</font>HOURS</span>
                        <span><font>{this.props.minute}</font>MINUTES</span>
                        <span><font>{this.props.second}</font>SECONDS</span>
                    </ol>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

CounterDownOnLive.defaultProps = {
    hour: 0,
    minute: 0,
    second: 0
}