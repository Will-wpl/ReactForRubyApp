import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import WinnerPrice from './admin_shared/winner';
import {getHistoriesLast,auctionConfirm} from '../../javascripts/componentService/admin/service';
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
        fnStatus:false,
        text:"",
        winner:{
            data:{},
            auction:{}
        }
    }
    //this.winnerdata=[];
    //this.winnerauction={};
    this.winner = {
        data:{},
        auction:{}
    }
    this.auction={}
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
    getAuction('admin').then(auction => {
        console.log(auction);
        this.auction = auction;
        this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000'
        getHistoriesLast({ auction_id: auction? auction.id : 1}).then(data => {
            this.setState({
                winner:{
                    data:data.histories[0],
                    auction:data.auction
                }
            })
            //orderRanking.sort(this.compare("average_price"))
            this.setState({realtimeRanking:data.histories,currentPrice : data.histories.length > 0 ? data.histories[0].average_price : this.state.currentPrice});
        })
    })
}
showDetail(type,obj){
    if(type == "win"){
        this.setState({
            fnStatus:true
        })
        this.setState({
            text:"Are you sure you want to confirm the winner?"
        })
        this.refs.Modal.showModal("comfirm");
    }else{
        this.setState({
            fnStatus:false
        })
        this.setState({
            text:"Are you sure you want to void this Reverse Auction exercise?"
        })
        this.refs.Modal.showModal("comfirm");
    }
}
void_auction(){
    let timeFn;
    auctionConfirm({data:{ user_id: this.state.winner.data.user_id , status:'void'},id:this.auction.id}).then(res=>{
        //console.log(res);
        clearTimeout(timeFn);
        this.refs.Modal.showModal();
        this.setState({
            text:"You have voided this Reverse Auction exercise, and will be redirected to the homepage."
        })
        timeFn = setTimeout(()=>{
            window.location.href=`/admin/auctions/${this.auction.id}/result`;
        },2000)
    },error=>{

    })
}
confirm_winner(){
    let timeFn;
    auctionConfirm({data:{ user_id: this.state.winner.data.user_id , status:'win'},id:this.auction.id}).then(res=>{
        //console.log(res);
        clearTimeout(timeFn);
        this.refs.Modal.showModal();
        this.setState({
            text:"Congratulations! Reverse Auction winner has been confirmed."
        })
        timeFn = setTimeout(()=>{
            window.location.href=`/admin/auctions/${this.auction.id}/result`;
        },2000)
    },error=>{

    })
}
render() {
    //console.log(this.winner.data);
    return (
        <div>
            <div className="time_cuntdown during">
            <p className="confirm">Reverse Auction has ended. Please proceed to confirm the outcome. </p>
            </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><RetailerRanking ranking={this.state.realtimeRanking} /></div>
                    </div>
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <ReservePrice name={this.auction.name} price={this.startPrice} realtimePrice={this.state.currentPrice} />
                            <WinnerPrice showOrhide="hide" winner={this.state.winner} />
                            <div className="winnerPrice_main">
                                <a className="lm--button lm--button--primary u-mt3" onClick={this.showDetail.bind(this,'void')}>Void Reverse Auction</a>
                                {/* <a className="lm--button lm--button--primary u-mt3" >Alternate Winner</a> */}
                                <a className="lm--button lm--button--primary u-mt3" onClick={this.showDetail.bind(this,'win')} >Confirm Winner</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                {/* <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
                </div> */}
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
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}