import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import WinnerPrice from './admin_shared/winner';
import {getHistories,auctionConfirm} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Modal} from '../shared/show-modal';
import moment from 'moment';
export default class AdminConfirmWinner extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green",
            realtimeRanking:[], currentPrice:'0.0000',
        },
        winnerdata:{},
        fnStatus:false,
        text:""
    }
}
compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
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
            orderRanking.sort(this.compare("average_price"))
            this.setState({realtimeRanking: orderRanking,winnerdata:orderRanking[0]
                , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice});
            //console.log(this.winnerdata);
        })
    })
}
showDetail(type,obj){
    if(type == "win"){
        this.setState({
            fnStatus:true
        })
        this.setState({
            text:"Are you confirm this retailer is the winner?"
        })
        this.refs.Modal.showModal("comfirm");
    }else{
        this.setState({
            fnStatus:false
        })
        this.setState({
            text:"Are you confirm this auction loss?"
        })
        this.refs.Modal.showModal("comfirm");
    }
}
void_auction(){
    auctionConfirm({data:{ user_id: this.state.winnerdata.user_id , status:'void'},id:this.auction.id}).then(res=>{
        console.log(res);
        this.refs.Modal.showModal();
        this.setState({
            text:"This Auction has been loss"
        })
    },error=>{

    })
}
confirm_winner(){
    auctionConfirm({data:{ user_id: this.state.winnerdata.user_id , status:'win'},id:this.auction.id}).then(res=>{
        console.log(res);
        this.refs.Modal.showModal();
        this.setState({
            text:this.state.winnerdata.company_name+"is the winner"
        })
    },error=>{

    })
}
render() {
    console.log(this.state.winnerdata);
    return (
        <div>
            <div className="time_cuntdown during">
            <p>Reverse Auction has ended. Please proceed to confirm the outcome. </p>
            </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><RetailerRanking ranking={this.state.realtimeRanking} /></div>
                    </div>
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <ReservePrice price={this.startPrice} realtimePrice={this.state.currentPrice} />
                            <WinnerPrice showOrhide="hide" winnerData={this.state.winnerdata} />
                            <div className="winnerPrice_main">
                                <a className="lm--button lm--button--primary u-mt3" onClick={this.showDetail.bind(this,'void')}>Void Reverse Auction</a>
                                {/* <a className="lm--button lm--button--primary u-mt3" >Alternate Winner</a> */}
                                <a className="lm--button lm--button--primary u-mt3" onClick={this.showDetail.bind(this,'win')} >Confirm Winner</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
                </div>
                <Modal ref="Modal" text={this.state.text} acceptFunction={!this.state.fnStatus ? this.void_auction.bind(this) : this.confirm_winner.bind(this)} />
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