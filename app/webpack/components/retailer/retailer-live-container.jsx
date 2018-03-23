import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {RetailerBeforeLive} from './retailer-before-live';
import LiveHomePage from './live-dashboard/home';
import {AUCTION_PROPS, getAuction, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import {calTwoTimeSpace} from '../../javascripts/componentService/util';

export class RetailerLiveContainer extends Component {

    constructor(props) {
        super(props);
        this.state={};
    }
    componentDidMount() {
        if (this.props.auction) {
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

    render() {
        let content = <div></div>;
        if (this.props.auction) {
            if (this.state.hasOwnProperty('showLive')) {
                content = !this.state.showLive ? (
                    <RetailerBeforeLive countDownOver={() => this.setState({showLive: true})} auction={this.props.auction}/>
                ) : (
                    <LiveHomePage auction={this.props.auction}/>
                )
            }
        } else {
            content = <div>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Auction may be not illegal, please fix auction configuration.
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