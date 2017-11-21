import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import CheckboxList from '../common/chart/list-checkbox';
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
    }

    componentDidMount() {
        getAuction().then(auction => {
            this.auction = auction;
            this.timerTitle = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000'
            this.forceUpdate(); // only once no need to use state


            getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
                // console.log('histories', histories, isEmptyJsonObj(histories));
                if (!isEmptyJsonObj(histories)) {
                    let orderRanking = histories.filter(element => {
                        return element.data.length > 0;
                    }).map(element => {
                        return element.data[element.data.length - 1];
                    })
                    // let orderRanking = histories.map(element => {
                    //     return element.data.length > 0 ? element.data[element.data.length - 1] : []
                    // })
                    // console.log('orderRanking', orderRanking);
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
                             // return Number(a.average_price) > Number(b.average_price)
                         })
                     } catch (error) {
                         console.log(error);
                     }
                    // console.log('history======>', histories)
                    this.setState({realtimeData: histories, realtimeRanking: orderRanking
                        , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice});
                    // this.refs.priceChart.setChartData(histories, 'price');
                    // this.refs.rankingChart.setChartData(histories, 'ranking');
                }
                this.createWebsocket(auction? auction.id : 1);
            }, error => {
                this.createWebsocket(auction? auction.id : 1);
            })
        })
        getArrangements(ACCEPT_STATUS.ACCEPT).then(res => {
            let limit = findUpLimit(res.length);
            let users = res.map((element, index) => {
                element['color'] = getRandomColor(index + 1, limit); //getRandomColor((index + 1) * 1.0 / limit);
                return element;
            });
            this.setState({users:users});
            this.priceUsers.selectAll(users);
            this.rankingUsers.selectAll(users);
        }, error => {
            //console.log(error);
        });
    }

    createWebsocket(auction) {
        this.ws = createWebsocket(auction);
        this.ws.onConnected(() => {
            //console.log('---message client connected ---');
        }).onDisconnected(() => {
            //console.log('---message client disconnected ----')
        }).onReceivedData(data => {
            //console.log('---message client received data ---', data);
            if (data.action === 'set_bid') {
                if (data.data.length > 0) {
                    let histories = [];
                    data.data.forEach((element, index) => {
                        histories.push({id: element.user_id, data:[].concat(element)})
                    })
                    // console.log('realtime ===> ', histories);
                    this.setState({realtimeData: histories, realtimeRanking: data.data
                        , currentPrice : data.data[0].average_price});
                    // this.refs.priceChart.setChartData(histories, 'price');
                    // this.refs.rankingChart.setChartData(histories, 'ranking');
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
        return (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)} onSecondBreaker={() => {this.refs.submitBtn.disabled='disabled'}}>
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
                                    <Price/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} ref={e => this.priceUsers = e} onCheckeds={(ids) => {this.refs.priceChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.realtimeData}>
                                    <Ranking yAxisFormatterRule={{0 : ' ', 'func': getStandardNumBref}}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} ref={e => this.rankingUsers = e} onCheckeds={(ids) => {this.refs.rankingChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <ReservePrice price={this.startPrice} realtimePrice={this.state.currentPrice}/>
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