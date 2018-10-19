import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {RetailerBeforeLive} from './retailer-before-live';
import {DuringCountDown} from '../shared/during-countdown';
import LiveHomePage from './live-dashboard/home';
import {AUCTION_PROPS, getAuction, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import {calTwoTimeSpace} from '../../javascripts/componentService/util';

export class RetailerLiveContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {extendVisible: false, holdStatus:false,livetype:'6',extendTime:true};
    }
    componentDidMount() {
        if (this.props.auction) {
            if(this.props.auction.live_auction_contracts){
                this.setState({livetype:this.props.auction.live_auction_contracts.length>0?this.props.auction.live_auction_contracts[0].contract_duration:'6'});
            }
            if (this.props.rule) {
                if (!this.props.rule[AUCTION_PROPS.HOLD_STATUS]) {
                    const beforeStartSpace = calTwoTimeSpace(this.props.rule[AUCTION_PROPS.ACTUAL_BEGIN_TIME], this.props.rule[AUCTION_PROPS.ACTUAL_CURRENT_TIME]);
                    if (beforeStartSpace > 0) {
                        this.setState({showLive: false});
                    } else {
                        const alreadyStartSpace = calTwoTimeSpace(this.props.rule[AUCTION_PROPS.ACTUAL_END_TIME], this.props.rule[AUCTION_PROPS.ACTUAL_CURRENT_TIME]);
                        if (alreadyStartSpace <= 0) {
                            goToCompletePage(this.props.auction.id);
                        } else {
                            this.setState({showLive: true});
                        }
                    }
                } else {
                    this.setState({showLive: false});
                }
            } else {
                this.setState({showLive: false});
            }
        }

    }
    goToFinish() {
        window.location.href=`/retailer/auctions/${this.props.auction ? this.props.auction.id : 1}/finish`;
    }
    liveTab(index){
        this.setState({livetype:index});
        this.refs.LiveHomePage.getHistory();
    }
    extendTime(min){
        if(this.timeTend){
            clearTimeout(this.timeTend);
        }
        this.setState({extendVisible:min,extendTime:true})
        this.timeTend = setTimeout(()=>{
            this.setState({extendTime:false})
        },5000)
    }
    render() {
        let content = <div></div>;
        if (this.props.auction) {
            if (this.state.hasOwnProperty('showLive')) {
                content = !this.state.showLive ? (
                    <RetailerBeforeLive countDownOver={() => this.setState({showLive: true})} auction={this.props.auction}/>
                ) : (
                    <div>
                        <DuringCountDown auction={this.props.auction} countDownOver={this.goToFinish.bind(this)}>
                            <div id="retailer_hold" className={this.state.extendVisible && this.state.extendTime? '' : 'live_hide'}>
                                <b>Admin has extended auction duration by {this.state.extendVisible} mins.</b>
                            </div>
                        </DuringCountDown>
                        {this.props.auction.live_auction_contracts?
                        <div className="u-grid u-mt2 mouth_tab">
                            {
                                this.props.auction.live_auction_contracts.map((item,index)=>{
                                    return <div key={index} className={"col-sm-12 col-md-3 u-cell"}>
                                        <a className={this.state.livetype===item.contract_duration?"col-sm-12 lm--button lm--button--primary selected"
                                            :"col-sm-12 lm--button lm--button--primary"}
                                           onClick={this.liveTab.bind(this,item.contract_duration)} >{item.contract_duration} Months</a>
                                    </div>
                                })
                            }
                        </div>:''}
                    <LiveHomePage ref="LiveHomePage" auction={this.props.auction} livetype={this.state.livetype} extend={this.extendTime.bind(this)}/>
                    </div>
                )
            }
        } else {
            content = <div>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Action not allowed.
                    </p>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/auctions" >Back</a>
                </div>
            </div>;
        }
        return content;
    }
}

const goToCompletePage = (auctionId) => {
    window.location.href=`/retailer/auctions/${auctionId}/finish`;
}

const runes = () => {
    const domNode = document.getElementById('retailerlive');
    if (domNode !== null) {
        getAuction('retailer',sessionStorage.auction_id).then(auction => {
            getAuctionTimeRule(auction.id).then(res => {
                renderRoot(auction, res);
            }, error => {
                renderRoot(auction);
            })
        }, error => {
            renderRoot();
        })
    }
}

const renderRoot = (auction = null, rule = null) => {
    const domNode = document.getElementById('retailerlive');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(RetailerLiveContainer, {auction: auction, rule: rule}),
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
    runes();
} else {
    window.addEventListener('DOMContentLoaded', runes, false);
}