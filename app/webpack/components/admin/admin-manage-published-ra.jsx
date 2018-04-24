import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {CreateNewRA} from './create-new-ra';
import {BidderStatus} from './admin_shared/bidders-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuction} from '../../javascripts/componentService/common/service';
import moment from 'moment';

export class AdminManagePublishedRa extends Component {
    constructor(props){
        super(props);
        this.state={
            disabled:false,
            editdisabled:false,
            name:""
        }
    }
    render () {
        let content = <div></div>;
        if (this.props.auction) {
            content = (
                <div>
                    <div>
                    <TimeCuntDown auction={this.props.auction} btnDisabled={() => {this.setState({disabled:true,editdisabled:true})}} countDownOver={() => {this.setState({disabled:true,editdisabled:true})}} timehidden="countdown_seconds" />
                    <div className="u-grid u-mt3">
                        <div className="col-sm-12 col-md-12">
                            <CreateNewRA left_name={this.props.auction.name} disabled={this.state.disabled} editdisabled={this.state.editdisabled} />
                        </div>
                    </div>
                    </div>
                </div>
            )
        }
        
        return content;
    }
}

function run() {
    const domNode = document.getElementById('AdminManagePublishedRa');
    if(domNode !== null){
        getAuction('admin',sessionStorage.auction_id).then(auction => {
            renderRoot(auction);
        }, error => {
            renderRoot();
        })
    }
}

const renderRoot = (auction = null) => {
    const domNode = document.getElementById('AdminManagePublishedRa');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminManagePublishedRa, {auction: auction}),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}