import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {CreateNewRA} from './create-new-ra';
import {BidderStatus} from './admin_shared/bidders-status';

export class AdminManagePublishedRa extends Component {
    constructor(props, context){
        super(props);
    }
    render () {
        return (
            <div className="u-grid">
                <div className="col-sm-12 col-md-7">
                    <CreateNewRA />
                </div>
                <div className="col-sm-12 col-md-5">
                    <BidderStatus />
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