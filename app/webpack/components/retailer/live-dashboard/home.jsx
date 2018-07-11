import React, {Component} from 'react';
import {DuringCountDown} from '../../shared/during-countdown';
import Description from './description';
import Ranking from '../../common/chart/ranking';
import BidForm from './bid-form';
import BidHistory from './bid-history';
import {getLoginUserId, getNumBref, getStandardNumBref} from '../../../javascripts/componentService/util';
import {getAuctionHistorys, validateCanBidForm} from '../../../javascripts/componentService/retailer/service';
import {createWebsocket, ACTION_COMMANDS} from '../../../javascripts/componentService/common/service';
import moment from 'moment';

export default class LiveHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            extendVisible: false, ranking: '', priceConfig: [], histories: [], chartDatas: [],
            showTop2Rule: false
        };
    }
    componentDidMount() {
        this.getHistory();
    }
    getHistory(){
        let auctionId = this.props.auction ? this.props.auction.id : 1;
        getAuctionHistorys(auctionId, getLoginUserId()).then(res => {
            if(res.duration_6 || res.duration_12 || res.duration_24){
                switch (this.props.livetype){
                    case '6' : this.makeup(res.duration_6);
                        break;
                    case '12' : this.makeup(res.duration_12);
                        break;
                    case '24' : this.makeup(res.duration_24);
                        break;
                }
            }else{
                this.makeup(res);
            }
            this.createSocket(auctionId);
        }, error => {
            this.createSocket(auctionId);
        });
    }
    componentWillUnmount() {
        if (this.ws) {
            this.ws.stopConnect();
        }
    }

    createSocket(auctionId) {
        if (!this.ws) {
            this.ws = createWebsocket(auctionId);
            this.ws.onConnected(() => {
                //console.log('---message client connected ---');
                this.timestamp = new Date().getTime() + Math.random();
                setTimeout(()=> {
                    this.ws.sendMessage(ACTION_COMMANDS.MAKE_UNIQUE, {timestamp: this.timestamp});
                }, 1000);
            }).onDisconnected(() => {
                //console.log('---message client disconnected ----')
            }).onReceivedData(data => {
                if (data && data.action) {
                    if (data.action === ACTION_COMMANDS.SET_BID) {
                        let curUserId = Number(getLoginUserId());
                        let last = data.data.find(element => {
                            return Number(element.user_id) === curUserId;
                        });
                        if (last) {
                            if (this.state.chartDatas.length === 0) {
                                this.state.chartDatas = [].concat({id: curUserId, data: [], color: '#e5e816', template:''});

                            }
                            last.ranking = this.state.showTop2Rule && Number(last.ranking) === 1 ? 2 : last.ranking;
                            last.template_ranking = `Ranking: ${(this.state.showTop2Rule && Number(last.ranking) <= 2) ? 'TOP 2' : getStandardNumBref(last.ranking)} ${last.is_bidder && last.flag !== null ? '(Bid Submitter)' : ''}`;
                            if (!last.template_price) {
                                last.template_price = {};
                            }
                            last.template_price['company_price'] = `${last.company_name} $${parseFloat(last.average_price).toFixed(4)}/kWh`;
                            last.template_price['lt'] = `LT(P):$${parseFloat(last.lt_peak).toFixed(4)} LT(OP):$${parseFloat(last.lt_off_peak).toFixed(4)}`;
                            last.template_price['hts'] = `HTS(P):$${parseFloat(last.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(last.hts_off_peak).toFixed(4)}`;
                            last.template_price['htl'] = `HTL(P):$${parseFloat(last.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(last.htl_off_peak).toFixed(4)}`;
                            last.template_price['eht'] = `EHT(P):$${parseFloat(last.eht_peak).toFixed(4)} EHT(OP):$${parseFloat(last.eht_off_peak).toFixed(4)}`;
                            this.state.chartDatas[0].data = this.state.chartDatas[0].data.concat(last)
                            let element = JSON.parse(JSON.stringify(last));
                            element.bid_time = moment(element.bid_time).format('HH:mm:ss');
                            element.lt_peak = parseFloat(element.lt_peak).toFixed(4);
                            element.lt_off_peak = parseFloat(element.lt_off_peak).toFixed(4);
                            element.hts_peak = parseFloat(element.hts_peak).toFixed(4);
                            element.hts_off_peak = parseFloat(element.hts_off_peak).toFixed(4);
                            element.htl_peak = parseFloat(element.htl_peak).toFixed(4);
                            element.htl_off_peak = parseFloat(element.htl_off_peak).toFixed(4);
                            element.eht_peak = parseFloat(element.eht_peak).toFixed(4);
                            element.eht_off_peak = parseFloat(element.eht_off_peak).toFixed(4);

                            this.setState({
                                ranking: last.ranking,
                                priceConfig: last.is_bidder ? [].concat(last.lt_off_peak)
                                    .concat(last.lt_peak).concat(last.hts_off_peak)
                                    .concat(last.hts_peak).concat(last.htl_off_peak)
                                    .concat(last.htl_peak).concat(last.eht_off_peak)
                                    .concat(last.eht_peak) : [],
                                histories: last.is_bidder ? this.state.histories.concat(element): this.state.histories,
                                chartDatas: this.state.chartDatas
                            })
                        }
                    } else if (data.action === 'extend') {
                        this.setState({extendVisible : data.data.minutes, priceConfig: []});
                        this.props.extend(data.data.minutes);
                        if (this.extendTimeout) {
                            clearTimeout(this.extendTimeout);
                        }
                        this.extendTimeout = setTimeout(() => {
                            this.setState({extendVisible : false});
                        }, 5000);
                    } else if (data.action === 'limit_user') {
                        if (data.data.user_id === getLoginUserId()) {
                            if (this.timestamp !== data.data.timestamp) {
                                alert('You will be redirected to the homepage as you have logged in using another device.');
                                window.location.href=`/retailer/home`;
                            }
                        }
                    }
                }
            }).onConnectedFailure(() => {
                this.onRequestForbiddenBy()
            })
        }
    }

    onRequestForbiddenBy() {

    }

    makeup(res) {
        const topRule = Number(this.props.auction ? this.props.auction.retailer_mode : 0) === 0;
        if (res.length > 0 ) {
            let copy = JSON.parse(JSON.stringify(res));
            let histories = res.map((element, index) => {
                if (index === 0) { // start
                    element.bid_time = moment(element.bid_time).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    element.bid_time = moment(element.bid_time).format('HH:mm:ss');
                }
                element.lt_peak = parseFloat(element.lt_peak).toFixed(4);
                element.lt_off_peak = parseFloat(element.lt_off_peak).toFixed(4);
                element.hts_peak = parseFloat(element.hts_peak).toFixed(4);
                element.hts_off_peak = parseFloat(element.hts_off_peak).toFixed(4);
                element.htl_peak = parseFloat(element.htl_peak).toFixed(4);
                element.htl_off_peak = parseFloat(element.htl_off_peak).toFixed(4);
                element.eht_peak = parseFloat(element.eht_peak).toFixed(4);
                element.eht_off_peak = parseFloat(element.eht_off_peak).toFixed(4);
                return element;
            });
            let chartDataTpl = {id: 0, data: [], color: '#e5e816'};
            copy.forEach(history => {
                chartDataTpl.id = history.user_id;
                history.ranking = (topRule && Number(history.ranking) === 1) ? 2 : history.ranking;
                history.template_ranking = `Ranking: ${(topRule && Number(history.ranking) <= 2) ? 'TOP 2' : getStandardNumBref(history.ranking)} ${history.is_bidder && history.flag !== null  ? '(Bid Submitter)' : ''}`;
                if (!history.template_price) {
                    history.template_price = {};
                }
                history.template_price['company_price'] = `${history.company_name} $${parseFloat(history.average_price).toFixed(4)}/kWh`;
                history.template_price['lt'] = `LT(P):$${parseFloat(history.lt_peak).toFixed(4)} LT(OP):$${parseFloat(history.lt_off_peak).toFixed(4)}`;
                history.template_price['hts'] = `HTS(P):$${parseFloat(history.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(history.hts_off_peak).toFixed(4)}`;
                history.template_price['htl'] = `HTL(P):$${parseFloat(history.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(history.htl_off_peak).toFixed(4)}`;
                history.template_price['eht'] = `EHT(P):$${parseFloat(history.eht_peak).toFixed(4)} EHT(OP):$${parseFloat(history.eht_off_peak).toFixed(4)}`;
                chartDataTpl.data.push(history)
            });

            let biddenArr = histories.filter(element => {
                return element.is_bidder;
            })
            let lastBidden = biddenArr[biddenArr.length - 1];
            lastBidden.ranking = topRule && Number(lastBidden.ranking) === 1 ? 2 : Number(lastBidden.ranking);
            if (biddenArr.length === 1) {
                if (lastBidden.flag === null) {
                    this.bidForm.initConfigs([]
                        .concat(lastBidden.lt_off_peak).concat(lastBidden.lt_peak)
                        .concat(lastBidden.hts_off_peak).concat(lastBidden.hts_peak)
                        .concat(lastBidden.htl_off_peak).concat(lastBidden.htl_peak)
                        .concat(lastBidden.eht_off_peak).concat(lastBidden.eht_peak));
                }
            }
            let newest = histories[histories.length - 1];
            this.setState({
                ranking: topRule && Number(newest.ranking) === 1 ? 2 : Number(newest.ranking),
                    priceConfig: biddenArr.length > 0 ? []
                    .concat(lastBidden.lt_off_peak).concat(lastBidden.lt_peak)
                    .concat(lastBidden.hts_off_peak).concat(lastBidden.hts_peak)
                    .concat(lastBidden.htl_off_peak).concat(lastBidden.htl_peak)
                    .concat(lastBidden.eht_off_peak).concat(lastBidden.eht_peak): [],
                histories: res.filter(element => {
                    return element.is_bidder;
                }), chartDatas: [].concat(chartDataTpl),
                showTop2Rule: topRule
            })
        } else {
            this.setState({showTop2Rule: topRule})
        }
    }

    onBidFormSubmit(configs) {
        this.ws.sendMessage(ACTION_COMMANDS.SET_BID, {
            lt_peak:`0.${configs[1]}`, lt_off_peak: `0.${configs[0]}`
            , hts_peak:`0.${configs[3]}`,hts_off_peak:`0.${configs[2]}`
            ,htl_peak:`0.${configs[5]}`,htl_off_peak:`0.${configs[4]}`
            ,eht_peak:`0.${configs[7]}`,eht_off_peak:`0.${configs[6]}`,
            contract_duration:this.props.livetype
        })
    }

    goToFinish() {
        window.location.href=`/retailer/auctions/${this.props.auction.id}/finish`;
    }
    check_has(type){
        let arr = [];
        if(this.props.auction.live_auction_contracts){
            if(this.props.auction.live_auction_contracts.length>0){
                arr = this.props.auction.live_auction_contracts.filter(item=>{
                    return this.props.livetype === item.contract_duration
                })
            }
        }
        switch (type){
            case 'has_lt':return this.props.auction.has_lt?this.props.auction.has_lt:arr[0].has_lt;
            case 'has_hts':return this.props.auction.has_hts?this.props.auction.has_hts:arr[0].has_hts;
            case 'has_htl':return this.props.auction.has_htl?this.props.auction.has_htl:arr[0].has_htl;
            case 'has_eht':return this.props.auction.has_eht?this.props.auction.has_eht:arr[0].has_eht;
        }
    }
    render() {
        const visibility_lt = this.check_has('has_lt');
        const visibility_hts = this.check_has('has_hts');
        const visibility_htl = this.check_has('has_htl');
        const visibility_eht = this.check_has('has_eht');
        const showTopDescription = this.state.showTop2Rule && this.state.ranking === 2;
        return (
            <div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1 white_bg"><Description ranking={`${showTopDescription ? 'TOP ' : ''}${getNumBref(this.state.ranking, !showTopDescription)}`}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Ranking data={this.state.chartDatas} yAxisFormatterRule={(this.state.showTop2Rule) ? {0 : ' ', 1 : ' ', 2 : 'Top 2', 'func': getNumBref} : {0 : ' ', 'func': getStandardNumBref}}/></div>
                    </div>
                </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell mh400">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidForm data={this.state.priceConfig} auction={this.props.auction} ref={instance => this.bidForm = instance} onSubmit={this.onBidFormSubmit.bind(this)}
                                                                                isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidHistory data={this.state.histories.filter(element => {
                            return element.flag !== null;
                        })} order={'desc'} isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/></div>
                    </div>
                </div>
            </div>
        );
    }
}