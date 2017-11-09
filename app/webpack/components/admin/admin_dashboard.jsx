import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import CheckboxList from '../common/chart/list-checkbox';
import {getArrangements, getHistories} from '../../javascripts/componentService/admin/service';
import {createWebsocket, getAuction} from '../../javascripts/componentService/common/service';
import {findUpLimit, getRandomColor} from '../../javascripts/componentService/util';
import {ACCEPT_STATUS} from '../../javascripts/componentService/constant';
import ChartRealtimeHoc from './realtimeChartdataContainer';
import Ranking from '../common/chart/ranking';
import Price from '../common/chart/price';
import {DuringCountDown} from '../shared/during-countdown';
import moment from 'moment';
import {Modal} from '../shared/show-modal';

export class AdminDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {users:[], extendedValue:1, realtimeData:[], realtimeRanking:[], currentPrice:'0.0000'};
    }
    updateRankingOnUsersSelected(ids) {
        this.refs.rankingChart.updateIndentifications(ids);
    }
    updatePriceOnUsersSelected(ids) {
        this.refs.priceChart.updateIndentifications(ids);
    }
    updateChartData(list) {
        this.refs.rankingChart.appendChartData(list);
        this.refs.priceChart.appendChartData(list);
    }

    componentDidMount() {
        getAuction().then(auction => {
            this.auction = auction;
            this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000'
            this.forceUpdate(); // only once no need to use state

            this.createWebsocket(auction? auction.id : 1);
            getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
                console.log('histories', histories);
                let orderRanking = histories.map(element => {
                    return element.data.length > 0 ? element.data[element.data.length - 1] : []
                })
                this.setState({realtimeData: histories, realtimeRanking: orderRanking
                    , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice});
            })
        })
        getArrangements(ACCEPT_STATUS.ACCEPT).then(res => {
            let limit = findUpLimit(res.length);
            this.setState({users:res.map((element, index) => {
                element['color'] = getRandomColor((index + 1) * 1.0 / limit);
                return element;
            })});
        }, error => {
            console.log(error);
        });
    }

    createWebsocket(auction) {
        this.ws = createWebsocket(auction);
        this.ws.onConnected(() => {
            console.log('---message client connected ---');
        }).onDisconnected(() => {
            console.log('---message client disconnected ----')
        }).onReceivedData(data => {
            console.log('---message client received data ---', data);
            if (data.action === 'set_bid') {
                if (data.data.length > 0) {
                    let histories = [];
                    data.data.forEach((element, index) => {
                        histories.push({id: element.user_id, data:[].concat(element)})
                    })
                    this.setState({realtimeData: histories, realtimeRanking: histories
                        , currentPrice : histories.length > 0 ? histories[0].average_price : this.state.currentPrice});
                }
            }
        })
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.stopConnect();
        }
    }

    onExtendInputChanged(e) {
        if (Number(e.target.value) > 0) {
            this.setState({extendedValue: e.target.value});
        }
    }
    showModal(){
        this.refs.Modal.showModal("comfirm");
    }
    extendTime() {
        this.ws.sendMessage('extend_time', {'extend_time' : `${this.state.extendedValue}`});
        this.setState({
            extendedValue:1
        })
    }

    goToFinish() {
        window.location.href=`/admin/auctions/${this.auction.id}/confirm`
    }

    render () {
        return (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)}>
                    <div id="admin_hold">
                        <span>Extend Time:</span>
                        <input type="tel" className="fill_hold" maxLength="2" value={this.state.extendedValue} onChange={this.onExtendInputChanged.bind(this)}/>
                        <span>Min</span>
                        <input type="button" className="hold_submit" value="Submit" onClick={this.showModal.bind(this)}/>
                    </div>
                </DuringCountDown>
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="priceChart" dataStore={this.state.realtimeData}>
                                    <Price/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.updatePriceOnUsersSelected.bind(this)}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.realtimeData}>
                                    <Ranking />
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.updateRankingOnUsersSelected.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <ReservePrice price={this.startPrice} realtimePrice={this.state.currentPrice}/>
                        <RetailerRanking ranking={this.state.realtimeRanking}/>
                    </div>
                </div>
                <Modal text="Are you sure extend this auction time?" acceptFunction={this.extendTime.bind(this)} ref="Modal" />
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminDashboard');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminDashboard),
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