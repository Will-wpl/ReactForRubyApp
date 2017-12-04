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
            disabled:true,
            editdisabled:false
        }
    }

    componentWillMount(){
        getAuction().then(res => {
            this.auction = res;
            this.timerTitle = this.auction ? `${this.auction.name} on ${moment(this.auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.forceUpdate();
        }, error => {
            //console.log(error);
        })
    }
    render () {
        return (
            <div>
                <div>
                <TimeCuntDown title={this.timerTitle} auction={this.auction} btnDisabled={() => {this.setState({disabled:true,editdisabled:true})}} countDownOver={() => {this.setState({disabled:true,editdisabled:true})}} />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <CreateNewRA left_name="Manage Upcoming Reverse Auction" disabled={this.state.disabled} editdisabled={this.state.editdisabled} />
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <BidderStatus auction={this.auction} />
                        <div className="createRaMain w_8">
                        <div className="createRa_btn u-mt3">
                                <a href={`/admin/auctions/${this.auction ? this.auction.id : 1}/online`} className="lm--button lm--button--primary">Commence</a>
                        </div>
                        </div>
                    </div>
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
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}