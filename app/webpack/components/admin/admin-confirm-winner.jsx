import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import WinnerPrice from './admin_shared/winner';
import {getHistories} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import moment from 'moment';
export default class AdminConfirmWinner extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green",
            realtimeRanking:[], currentPrice:'0.0000'
        }
    }
}
componentDidMount() {
    getAuction().then(auction => {
        this.auction = auction;
        this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000'
        getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
            console.log('histories', histories);
            let orderRanking = histories.map(element => {
                return element.data.length > 0 ? element.data[element.data.length - 1] : []
            })
            this.setState({realtimeRanking: orderRanking
                , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice});
        })
    })
}
  render() {
    return (
        <div>
            <div className="time_cuntdown during">
            <p>Reverse Auction has ended. Please proceed to confirm the outcome </p>
            </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><RetailerRanking ranking={this.state.realtimeRanking} /></div>
                    </div>
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <ReservePrice price={this.startPrice} realtimePrice={this.state.currentPrice} />
                            <WinnerPrice showOrhide="hide" />
                            <div className="winnerPrice_main">
                                <a className="lm--button lm--button--primary u-mt3" >Void Reverse Auction</a>
                                {/* <a className="lm--button lm--button--primary u-mt3" >Alternate Winner</a> */}
                                <a className="lm--button lm--button--primary u-mt3"  >Confirm Winner</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
                </div>
            </div>
    )
  }
}

function run() {
    const domNode = document.getElementById('admin_confirm_winner');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminConfirmWinner),
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