import React, { Component } from 'react';

export default class LiveCountdown extends Component {

    render() {
        return (
            <div>
                <h3>Reverse Auction has commenced.Please start bidding.</h3>
                <span>
                    <label>Countdown Timer:</label>
                    <span>
                        <label>26</label>
                        <label>MINITES</label>
                    </span>
                    <span>
                        <label>19</label>
                        <label>SECONDS</label>
                    </span>
                    <label>Admin has extended auction duration by 2 minuties</label>
                </span>
            </div>
        );
    }
}