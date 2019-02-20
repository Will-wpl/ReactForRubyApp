import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import WinnerPrice from './admin_shared/winner';
import { getHistoriesLast, auctionConfirm} from '../../javascripts/componentService/admin/service';
import { getAuction } from '../../javascripts/componentService/common/service';
import { Modal } from '../shared/show-modal';
import ReservePriceCompare from './admin_shared/reserveprice-compare';
import moment from 'moment';
export default class AdminConfirmWinner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                showOrhide: "hide",
                showStatus: "Awarded",
                statusColor: "green",
                realtimeRanking: [], currentPrice: '0.0000',
            },
            compare:{},
            fnStatus: false,
            text: "",
            winner: {
                data: {},
                auction: {}
            },
            auctions: {}, livetype: '6', live_auction_contracts: []
        }
        this.winner = {
            data: {},
            auction: {}
        }
    }
    compare(prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop]; if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    componentDidMount() {
        getAuction('admin', sessionStorage.auction_id).then(auction => {
            this.setState({ auctions: auction });
            if (auction.live_auction_contracts) {
                this.setState({
                    live_auction_contracts: auction.live_auction_contracts,
                    livetype: auction.live_auction_contracts[0].contract_duration
                });
            }
            this.auction = auction;
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000';
            this.refresh();
        })
    }
    refresh() {
        getHistoriesLast({ auction_id: this.state.auctions.id ? this.state.auctions.id : 1 }).then(data => {
            let histories;
            if (data.duration_6 || data.duration_12 || data.duration_24) {
                switch (this.state.livetype) {
                    case '6': histories = data.duration_6;
                        break;
                    case '12': histories = data.duration_12;
                        break;
                    case '24': histories = data.duration_24;
                        break;
                }
            } else {
                histories = data;
            }
            if(this.state.auctions.live_auction_contracts){
                let live = this.state.auctions.live_auction_contracts.filter(item=>{
                    return this.state.livetype === item.contract_duration
                })
                this.setState({contracts:live});
            }
            this.setState({
                winner: {
                    data: histories.histories[0],
                    auction: histories.auction
                },
                compare:histories.histories[0],
                realtimeRanking: histories.histories, currentPrice: histories.histories.length > 0 ? histories.histories[0].average_price : this.state.currentPrice
            });
        })
    }
    liveTab(index) {
        this.setState({ livetype: index });
        this.refresh();
    }
    showDetail(type, obj) {
        if (type == "win") {
            this.setState({
                fnStatus: true
            })
            this.setState({
                text: "Are you sure you want to select the winner?"
            })
            this.refs.Modal.showModal("comfirm");
        } else {
            this.setState({
                fnStatus: false
            })
            this.setState({
                text: "Are you sure you want to void this Reverse Auction exercise?"
            })
            this.refs.Modal.showModal("comfirm");
        }
    }
    void_auction() {
        let timeFn;
        auctionConfirm(
            { data: { user_id: this.state.winner.data.user_id, status: 'void' }, id: this.auction.id }).then(res => {
                clearTimeout(timeFn);
                this.refs.Modal.showModal();
                this.setState({
                    text: "You have voided this Reverse Auction exercise, and will be redirected to the homepage."
                })
                timeFn = setTimeout(() => {
                    window.location.href = `/admin/auctions/${this.auction.id}/result`;
                }, 2000)
            }, error => {

            })
    }
    confirm_winner() {
        window.location.href = `/admin/auctions/${this.auction.id}/choose_winner`;
    }
    check_has(type) {
        let arr = [];
        if (this.state.auctions.live_auction_contracts) {
            if (this.state.auctions.live_auction_contracts.length > 0) {
                arr = this.state.auctions.live_auction_contracts.filter(item => {
                    return this.state.livetype === item.contract_duration
                })
            }
            switch (type) {
                case 'has_lt': return arr[0] ? arr[0].has_lt : true;
                case 'has_hts': return arr[0] ? arr[0].has_hts : true;
                case 'has_htl': return arr[0] ? arr[0].has_htl : true;
                case 'has_eht': return arr[0] ? arr[0].has_eht : true;
            }
        } else {
            switch (type) {
                case 'has_lt': return !this.auction ? true : Number(this.auction.total_lt_peak) > 0 || Number(this.auction.total_lt_off_peak) > 0;
                case 'has_hts': return !this.auction ? true : Number(this.auction.total_hts_peak) > 0 || Number(this.auction.total_hts_off_peak) > 0;
                case 'has_htl': return !this.auction ? true : Number(this.auction.total_htl_peak) > 0 || Number(this.auction.total_htl_off_peak) > 0;
                case 'has_eht': return !this.auction ? true : Number(this.auction.total_eht_peak) > 0 || Number(this.auction.total_eht_off_peak) > 0;
            }
        }
    }
    render() {
        const visibility_lt = this.check_has('has_lt');
        const visibility_hts = this.check_has('has_hts');
        const visibility_htl = this.check_has('has_htl');
        const visibility_eht = this.check_has('has_eht');
        return (
            <div>
                <div className="time_cuntdown during">
                    <p className="confirm">Reverse Auction has ended. Please proceed to confirm the outcome. </p>
                </div>
                {this.state.live_auction_contracts.length > 0 ?
                    <div className="u-grid u-mt2 mouth_tab">
                        {
                            this.state.live_auction_contracts.map((item, index) => {
                                return <div key={index} className={"col-sm-12 col-md-3 u-cell"}>
                                    <a className={this.state.livetype === item.contract_duration ? "col-sm-12 lm--button lm--button--primary selected"
                                        : "col-sm-12 lm--button lm--button--primary"}
                                        onClick={this.liveTab.bind(this, item.contract_duration)} >{item.contract_duration} Months</a>
                                </div>
                            })
                        }
                    </div> : ''}
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <RetailerRanking ranking={this.state.realtimeRanking} />
                            {this.state.live_auction_contracts.length>0?<ReservePriceCompare contracts={this.state.contracts} compare={this.state.compare} />:''}
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1">
                            <ReservePrice auction={this.auction} price={this.startPrice} realtimePrice={this.state.currentPrice} />
                            <WinnerPrice showOrhide="hide" winner={this.state.winner} isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht} />
                        </div>
                    </div>
                </div>
                <Modal ref="Modal" text={this.state.text} acceptFunction={!this.state.fnStatus ? this.void_auction.bind(this) : this.confirm_winner.bind(this)} />
                <div className="col-sm-12 col-md-12">
                    <div className="createRaMain createRaMainMiddle u-grid winner_btn" >
                        <a className="lm--button lm--button--primary u-mt3" onClick={this.showDetail.bind(this, 'win')} >Click to Select Winner</a>
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('admin_confirm_winner');
    if (domNode !== null) {
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