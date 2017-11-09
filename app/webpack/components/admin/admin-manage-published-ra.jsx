import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {CreateNewRA} from './create-new-ra';
import {BidderStatus} from './admin_shared/bidders-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuctionInVersionOne,getBidderStatus} from '../../javascripts/componentService/admin/service';
import moment from 'moment';

export class AdminManagePublishedRa extends Component {
    constructor(props, context){
        super(props);
        this.state={
            id:"",
            live_modal:"",live_modal_do:"",
            //holdOrend:"live_hold",
            dataList:[]
        }
        this.auction = {};
    }
    componentDidMount(){
        getAuctionInVersionOne().then(res => {
            this.auction = res;
            this.timerTitle = this.auction ? `${this.auction.name} on ${moment(this.auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            //this.forceUpdate();
            // if(this.auction.publish_status == 1){
            //     this.setState({
            //         live_modal:"live_hide",
            //         live_modal_do:"live_show"
            //     })
            // }else{
            //     this.setState({
            //         live_modal:"live_show",
            //         live_modal_do:"live_hide"
            //     })
            // }
            //console.log(res);
            getBidderStatus({auction_id:res.id}).then(res => {
                //console.log(res);
                this.setState({
                    dataList:res,
                })
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        })
    }
    componentWillMount(){

    }
    render () {
        return (
            <div>
                {/* <div className={this.state.live_modal} id="live_modal">
                    <div className={this.state.holdOrend}></div>
                    <p>
                    There is no upcoming reverse auction published.
                    </p>
                </div> */}
                <div className={this.state.live_modal_do}>
                <TimeCuntDown title={this.timerTitle} auction={this.auction} />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <CreateNewRA left_name="Manage Upcoming Reverse Auction" />
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <BidderStatus dataList={this.state.dataList} />
                        <div className="createRaMain w_8">
                        <div className="createRa_btn">
                                <a href="/admin/auctions/2/online" className="lm--button lm--button--primary">Commence</a>
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
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}