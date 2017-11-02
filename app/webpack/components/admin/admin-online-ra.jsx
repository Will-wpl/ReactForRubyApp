import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {DuringCountDown} from '../shared/during-countdown';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
export class AdminOnlineRa extends Component {
    constructor(props, context){
        super(props);
    }
    render () {
        return (
            <div>
                <DuringCountDown admin_hold="show" retailer_hold="hide" />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <ReservePrice />
                        <RetailerRanking />
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminOnlineRa');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminOnlineRa),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}