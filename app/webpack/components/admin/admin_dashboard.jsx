import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import CheckboxList from '../common/chart/list-checkbox';
import CheckboxListItem from '../common/chart/list-checkbox-item';
import {getArrangements, getHistories} from '../../javascripts/componentService/admin/service';
import {createWebsocket, getAuction} from '../../javascripts/componentService/common/service';
import {findUpLimit, getRandomColor, getStandardNumBref, isEmptyJsonObj} from '../../javascripts/componentService/util';
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
        this.state = {users:[], realtimeData:[], realtimeRanking:[], currentPrice:'0.0000'};
        this.lastInput = 1;
        this.priceCheckAllStatus = true;
        this.rankingCheckAllStatus = true;
    }

    componentDidMount() {
        getAuction('admin',sessionStorage.auction_id).then(auction => {
            this.auction = auction;
            console.log(this.auction.name);
            this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000'
            this.forceUpdate(); // only once no need to use state

            let auctionId = auction? auction.id : 1;

            getHistories({ auction_id: auctionId}).then(histories => {
                if (!isEmptyJsonObj(histories)) {
                    let orderRanking = histories.filter(element => {
                        return element.data.length > 0;
                    }).map(element => {
                        return element.data[element.data.length - 1];
                    })
                     try {
                         orderRanking.sort((a, b) => {
                             const ar = Number(a.ranking);
                             const br = Number(b.ranking);
                             if (ar < br) {
                                 return -1;
                             } else if (ar > br) {
                                 return 1;
                             } else {
                                 const at = moment(a.actual_bid_time);
                                 const bt = moment(b.actual_bid_time);
                                 if (at < bt) {
                                     return -1;
                                 } else if (at > bt) {
                                     return 1;
                                 } else {
                                     return 0;
                                 }
                             }
                         })
                     } catch (error) {
                         console.log(error);
                     }
                    this.setState({realtimeData: histories, realtimeRanking: orderRanking
                        , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice});
                }
                this.createWebsocket(auctionId);
            }, error => {
                this.createWebsocket(auctionId);
            });

            getArrangements(auctionId, ACCEPT_STATUS.ACCEPT).then(res => {
                let limit = findUpLimit(res.length);
                let users = res.map((element, index) => {
                    element['color'] = getRandomColor(index + 1, limit);
                    return element;
                });
                this.userLen = users.length;
                this.priceUsers.setList(JSON.parse(JSON.stringify(users)));
                this.rankingUsers.setList(JSON.parse(JSON.stringify(users)));
                this.priceUsers.selectAll();
                this.rankingUsers.selectAll();
            }, error => {
            });
        })
    }

    createWebsocket(auction) {
        this.ws = createWebsocket(auction);
        this.ws.onConnected(() => {
        }).onDisconnected(() => {
        }).onReceivedData(data => {
            if (data.action === 'set_bid') {
                if (data.data.length > 0) {
                    let histories = [];
                    data.data.forEach((element, index) => {
                        histories.push({id: element.user_id, data:[].concat(element)})
                    })
                    this.setState({realtimeData: histories, realtimeRanking: data.data
                        , currentPrice : data.data[0].average_price});
                }
            }
            if (data.action === 'extend_time') {
                this.refs.submitBtn.disabled=false;
            }
        })
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.stopConnect();
        }
    }

    onExtendInputChanged(e) {
        if (Number(e.target.value) >0 && Number(e.target.value) <=60) {
            this.refs.extendedValue.value = e.target.value;
            this.lastInput = e.target.value;
        } else {
            this.refs.extendedValue.value = this.lastInput;
        }
    }
    showModal(){
        this.refs.Modal.showModal("comfirm");
    }
    extendTime() {
        this.ws.sendMessage('extend_time', {'extend_time' : `${parseInt(this.refs.extendedValue.value)}`});
        this.refs.extendedValue.value = 1;
    }

    goToFinish() {
        window.location.href=`/admin/auctions/${this.auction.id}/confirm`
    }

    render () {
        const visibility_lt = !this.auction ? true: Number(this.auction.total_lt_peak) > 0 || Number(this.auction.total_lt_off_peak) > 0;
        const visibility_hts = !this.auction ? true: Number(this.auction.total_hts_peak) > 0 || Number(this.auction.total_hts_off_peak) > 0;
        const visibility_htl = !this.auction ? true: Number(this.auction.total_htl_peak) > 0 || Number(this.auction.total_htl_off_peak) > 0;
        const visibility_eht = !this.auction ? true: Number(this.auction.total_eht_peak) > 0 || Number(this.auction.total_eht_off_peak) > 0;
        return (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)} onSecondBreaker={() => {this.refs.submitBtn.disabled='disabled';this.refs.Modal.closeModal();}}>
                    <div id="admin_hold">
                        <span>Extend Time:</span>
                        <input type="number" className="fill_hold" maxLength="2" ref="extendedValue" defaultValue={1} onChange={this.onExtendInputChanged.bind(this)}/>
                        <span>Min</span>
                        <input type="button" className="hold_submit" value="Submit" onClick={this.showModal.bind(this)} ref="submitBtn" />
                    </div>
                </DuringCountDown>
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="priceChart" dataStore={this.state.realtimeData}>
                                    <Price isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'Check All'} color={'white'} status={this.priceCheckAllStatus} onCheck={(id, status, color) => {
                                    this.priceCheckAllStatus = status;
                                    if (status) {
                                        this.priceUsers.selectAll();
                                    } else {
                                        this.priceUsers.disSelectAll();
                                    }
                                }} />
                                <CheckboxList ref={e => this.priceUsers = e} onCheckeds={(ids) => {
                                    this.refs.priceChart.updateIndentifications(ids)
                                    if (ids.length === 0) {
                                        this.priceCheckAllStatus = false;
                                        this.forceUpdate()
                                    } else if (ids.length === this.userLen) {
                                        this.priceCheckAllStatus = true;
                                        this.forceUpdate()
                                    }
                                }}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.realtimeData}>
                                    <Ranking yAxisFormatterRule={{0 : ' ', 'func': getStandardNumBref}}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'Check All'} color={'white'} status={this.rankingCheckAllStatus} onCheck={(id, status, color) => {
                                    this.rankingCheckAllStatus = status;
                                    if (status) {
                                        this.rankingUsers.selectAll();
                                    } else {
                                        this.rankingUsers.disSelectAll();
                                    }
                                }} />
                                <CheckboxList ref={e => this.rankingUsers = e} onCheckeds={(ids) => {
                                    this.refs.rankingChart.updateIndentifications(ids);
                                    if (ids.length === 0) {
                                        this.rankingCheckAllStatus = false;
                                        this.forceUpdate()
                                    } else if (ids.length === this.userLen) {
                                        this.rankingCheckAllStatus = true;
                                        this.forceUpdate()
                                    }
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <ReservePrice auction={this.auction} price={this.startPrice} realtimePrice={this.state.currentPrice}/>
                        <RetailerRanking ranking={this.state.realtimeRanking}/>
                    </div>
                </div>
                <Modal text="Please confirm your time extension." acceptFunction={this.extendTime.bind(this)} ref="Modal" />
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
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}