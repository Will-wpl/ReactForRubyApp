import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import ReservePriceCompare from './admin_shared/reserveprice-compare';
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
        this.state = {
            users:[], realtimeData:[], realtimeRanking:[],
            currentPrice:'0.0000',livetype:'6',compare:{},disabled:false,
            live_auction_contracts:[],contracts:[],auction:{},livetab:false}
        this.lastInput = 1;
        this.priceCheckAllStatus = true;
        this.rankingCheckAllStatus = true;
        this.interval = undefined;
    }

    componentDidMount() {
        getAuction('admin',sessionStorage.auction_id).then(res => {
            this.setState({auction:res});
            this.auction = res;
            //console.log(this.auction.live_auction_contracts);
            this.timerTitle = res ? `${res.name} on ${moment(res.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            this.startPrice = res ? parseFloat(res.reserve_price).toFixed(4) : '0.0000'
            this.forceUpdate();
            if(res.live_auction_contracts){
                this.setState({
                    live_auction_contracts:res.live_auction_contracts,
                    livetype:res.live_auction_contracts[0].contract_duration
                });
            }
            getArrangements(res.id, ACCEPT_STATUS.ACCEPT).then(res => {
                let limit = findUpLimit(res.length);
                let users = res.map((element, index) => {
                    element['color'] = getRandomColor(index + 1, limit);
                    return element;
                });
                this.refresh();
                this.userLen = users.length;
                this.priceUsers.setList(JSON.parse(JSON.stringify(users)),'price');
                this.rankingUsers.setList(JSON.parse(JSON.stringify(users)),'ranking');
                this.priceUsers.selectAll();
                this.rankingUsers.selectAll();
            }, error => {
            });
        })
        // setTimeout(()=>{
        //     this.refresh();
        // },200)
    }
    refresh(){
            let auctionId = this.state.auction? this.state.auction.id : 1;
            if (this.ws) {
                this.ws.stopConnect();
            }
            getHistories({ auction_id: sessionStorage.auction_id}).then(res => {
                let histories;
                if(res.duration_6 || res.duration_12 || res.duration_24){
                    // console.log(this.state.livetype);
                    switch (this.state.livetype){
                        case '6' : histories = res.duration_6;
                            break;
                        case '12' : histories = res.duration_12;
                            break;
                        case '24' : histories = res.duration_24;
                            break;
                    }
                }else{
                    histories=res;
                }

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
                    if(this.state.auction.live_auction_contracts){
                        let live = this.state.auction.live_auction_contracts.filter(item=>{
                            return this.state.livetype === item.contract_duration
                        })
                        this.setState({contracts:live});
                    }
                    this.setState({realtimeData: [].concat(histories), realtimeRanking: orderRanking
                         , currentPrice : orderRanking.length > 0 ? orderRanking[0].average_price : this.state.currentPrice,
                         compare:orderRanking[0]});
                }
                this.createWebsocket(auctionId);
            }, error => {
                this.createWebsocket(auctionId);
            });
    }
    createWebsocket(auction) {
        this.ws = createWebsocket(auction);
        this.ws.onConnected(() => {
        }).onDisconnected(() => {
        }).onReceivedData(data => {
            if (data.action === 'set_bid') {
                if (data.data.length > 0) {
                    let histories = [];
                    // console.log('websocket set_bid-----------------');
                    // console.log(data);
                    data.data.forEach((element, index) => {
                        histories.push({id: element.user_id, data:[].concat(element)})
                    })
                    if(data.data[0].contract_duration){
                        if(data.data[0].contract_duration === this.state.livetype){
                            this.setState({livetab:false,realtimeData: histories, realtimeRanking: data.data
                                , currentPrice : data.data[0].average_price,compare:data.data[0]});
                        }
                    }else{
                        this.setState({realtimeData: histories, realtimeRanking: data.data
                            , currentPrice : data.data[0].average_price});
                    }

                }
            }
            if (data.action === 'extend_time') {
                this.refs.submitBtn.disabled=false;
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        if (this.ws) {
            this.ws.stopConnect();
        }
    }

    onExtendInputChanged(e) {
        if (Number(e.target.value) >=0 && Number(e.target.value) <=60) {
            this.refs.extendedValue.value = e.target.value;
            this.lastInput = e.target.value;
            this.setState({disabled:false});
        } else {
            if(e.target.value == ""){
                this.refs.extendedValue.value = "";
                this.setState({disabled:true});
            }else{
                this.refs.extendedValue.value = this.lastInput;
            }

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
    liveTab(index){
        this.setState({livetype:index,livetab:true});
        setTimeout(()=>{
            this.refresh();
        },500)
        this.priceUsers.selectAll();
        this.rankingUsers.selectAll();
    }
    check_has(type){
        let arr = [];
        if(this.state.auction.live_auction_contracts){
            if(this.state.auction.live_auction_contracts.length>0){
                arr = this.state.auction.live_auction_contracts.filter(item=>{
                    return this.state.livetype === item.contract_duration
                })
            }
            switch (type){
                case 'has_lt':return arr[0]?arr[0].has_lt:true;
                case 'has_hts':return arr[0]?arr[0].has_hts:true;
                case 'has_htl':return arr[0]?arr[0].has_htl:true;
                case 'has_eht':return arr[0]?arr[0].has_eht:true;
            }
        }else{
            switch (type){
                case 'has_lt':return !this.state.auction ? true: Number(this.state.auction.total_lt_peak) > 0 || Number(this.state.auction.total_lt_off_peak) > 0;
                case 'has_hts':return !this.state.auction ? true: Number(this.state.auction.total_hts_peak) > 0 || Number(this.state.auction.total_hts_off_peak) > 0;
                case 'has_htl':return !this.state.auction ? true: Number(this.state.auction.total_htl_peak) > 0 || Number(this.state.auction.total_htl_off_peak) > 0;
                case 'has_eht':return !this.state.auction ? true: Number(this.state.auction.total_eht_peak) > 0 || Number(this.state.auction.total_eht_off_peak) > 0;
            }
        }
    }
    render () {
        const visibility_lt = this.check_has('has_lt');
        const visibility_hts = this.check_has('has_hts');
        const visibility_htl = this.check_has('has_htl');
        const visibility_eht = this.check_has('has_eht');
        return (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)} onSecondBreaker={() => {this.refs.submitBtn.disabled='disabled';this.refs.Modal.closeModal();}}>
                    <div id="admin_hold">
                        <span>Extend Time:</span>
                        <input type="number" className="fill_hold" maxLength="2" ref="extendedValue" defaultValue={1} onChange={this.onExtendInputChanged.bind(this)}/>
                        <span>Min</span>
                        <input type="button" className="hold_submit" disabled={this.state.disabled} value="Submit" onClick={this.showModal.bind(this)} ref="submitBtn" />
                    </div>
                </DuringCountDown>
                {this.state.live_auction_contracts.length>0?
                    <div className="u-grid u-mt2 mouth_tab">
                        {
                            this.state.live_auction_contracts.map((item,index)=>{
                                return <div key={index} className={"col-sm-12 col-md-3 u-cell"}>
                                    <a className={this.state.livetype===item.contract_duration?"col-sm-12 lm--button lm--button--primary selected"
                                        :"col-sm-12 lm--button lm--button--primary"}
                                       onClick={this.liveTab.bind(this,item.contract_duration)} >{item.contract_duration} Months</a>
                                </div>
                            })
                        }
                    </div>:''}
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="priceChart" livetab={this.state.livetab} dataStore={this.state.realtimeData}>
                                    <Price isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'Check All'} color={'#333'} status={this.priceCheckAllStatus} onCheck={(id, status, color) => {
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
                                <ChartRealtimeHoc ref="rankingChart" livetab={this.state.livetab} dataStore={this.state.realtimeData}>
                                    <Ranking yAxisFormatterRule={{0 : ' ', 'func': getStandardNumBref}}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'Check All'} color={'#333'} status={this.rankingCheckAllStatus} onCheck={(id, status, color) => {
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
                        {this.state.live_auction_contracts.length>0?<ReservePriceCompare livetype={this.state.livetype} contracts={this.state.contracts} compare={this.state.compare} />:''}
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