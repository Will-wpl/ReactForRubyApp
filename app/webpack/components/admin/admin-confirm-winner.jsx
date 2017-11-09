import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import WinnerPrice from './admin_shared/winner';
export default class AdminConfirmWinner extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green"
        },
        listData:{
            "name":"Senoko",
            "price":"$0.0850/kWh",
            "total":"1,270,199 kWh",
            "Period":"19 Oct 2018 to 30 Jun 2018",
            "sum":"$674,475.67(Forecasted)",
            "winnerPricetable":[
                {"peak":"Peak (7am-7pm)","lt":"$ 0.XXXX","ht_small":"$ 0.XXXX","ht_large":"$ 0.XXXX"},
                {"peak":"Off-Peak (7pm-7am)","lt":"$ 0.XXXX","ht_small":"$ 0.XXXX","ht_large":"$ 0.XXXX"}
            ]
        }
    }
}
  render() {
    return (
        <div>
            <div className="time_cuntdown during">
            <p>Reverse Auction has ended. Please proceed to confirm the outcome </p>
            </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><RetailerRanking /></div>
                    </div>
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <ReservePrice />
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