import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {CreateNewRA} from './create-new-ra';
import {BidderStatus} from './admin_shared/bidders-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
export class AdminManagePublishedRa extends Component {
    constructor(props, context){
        super(props);
        //this.user_info=sessionStorage.getItem('raInfo');
    }
    render () {
        return (
            <div>
                <TimeCuntDown />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <CreateNewRA left_name="Manage Upcoming Reverse Auction" />
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <BidderStatus />
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminManagePublishedRa');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminManagePublishedRa),
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