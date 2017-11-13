import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Description from './description';
import Ranking from '../../common/chart/ranking';
import BidForm from './bid-form';
import BidHistory from './bid-history';
import {getLoginUserId, getNumBref} from '../../../javascripts/componentService/util';
import {getAuctionHistorys} from '../../../javascripts/componentService/retailer/service';
import {createWebsocket, ACTION_COMMANDS} from '../../../javascripts/componentService/common/service';
import moment from 'moment';

export default class LiveHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {ranking: '', priceConfig: ['', '', '', '', '', ''], histories: [], chartDatas: []};
    }

    componentDidMount() {
        getAuctionHistorys(this.props.auction ? this.props.auction.id : 1, getLoginUserId()).then(res => {
            console.log('res==========================', res);
            this.makeup(res);
            this.createSocket();
        }, error => {
            this.createSocket();
        });
    }

    createSocket() {
        if (!this.ws) {
            this.ws = createWebsocket(1);
            // console.log(this.ws)
            this.ws.onConnected(() => {
                console.log('---message client connected ---');
            }).onDisconnected(() => {
                console.log('---message client disconnected ----')
            }).onReceivedData(data => {
                console.log('---message client received data ---', data);
                if (data && data.action && data.action === ACTION_COMMANDS.SET_BID) {
                    let curUserId = Number(getLoginUserId());
                    let last = data.data.find(element => {
                        return Number(element.user_id) === curUserId;
                    });
                    if (last) {
                        // console.log('last ========',last);
                        // if (last.is_bidder) {
                            if (this.state.chartDatas.length === 0) {
                                this.state.chartDatas = [].concat({id: curUserId, data: [], color: '#e5e816', template:''});

                            }
                            // this.state.chartDatas[0].data = this.state.chartDatas[0].data.concat(
                            //     {time: moment(last.bid_time).format('YYYY-MM-DD HH:mm:ss')
                            //         , ranking: Number(last.ranking) === 1 ? 2 : last.ranking, needMark: last.is_bidder}
                            // )
                            last.ranking = Number(last.ranking) === 1 ? 2 : last.ranking;
                            last.template_ranking = `Ranking: ${last.ranking} ${last.is_bidder ? '(Bit Submitter)' : ''}`;
                            if (!last.template_price) {
                                last.template_price = {};
                            }
                            last.template_price['company_price'] = `${last.company_name} ${parseFloat(last.average_price).toFixed(4)}/KWH`;
                            last.template_price['lt'] = `LT(P):$${parseFloat(last.lt_peak).toFixed(4)} LT(OP):$${parseFloat(last.lt_off_peak).toFixed(4)}`;
                            last.template_price['hts'] = `HTS(P):$${parseFloat(last.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(last.hts_off_peak).toFixed(4)}`;
                            last.template_price['htl'] = `HTL(P):$${parseFloat(last.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(last.htl_off_peak).toFixed(4)}`;
                            this.state.chartDatas[0].data = this.state.chartDatas[0].data.concat(last)
                        // }
                        let element = JSON.parse(JSON.stringify(last));
                        element.bid_time = moment(element.bid_time).format('HH:mm:ss');
                        element.lt_peak = parseFloat(element.lt_peak).toFixed(4);
                        element.lt_off_peak = parseFloat(element.lt_off_peak).toFixed(4);
                        element.hts_peak = parseFloat(element.hts_peak).toFixed(4);
                        element.hts_off_peak = parseFloat(element.hts_off_peak).toFixed(4);
                        element.htl_peak = parseFloat(element.htl_peak).toFixed(4);
                        element.htl_off_peak = parseFloat(element.htl_off_peak).toFixed(4);
                        this.setState({
                            ranking: last.ranking,
                            priceConfig: [].concat(last.lt_off_peak).concat(last.lt_peak)
                                .concat(last.hts_off_peak).concat(last.hts_peak)
                                .concat(last.htl_off_peak).concat(last.htl_peak),
                            histories: last.is_bidder ? this.state.histories.concat(element): this.state.histories,
                            chartDatas: this.state.chartDatas
                        })
                    }
                }

            })
        }
    }

    makeup(res) {
        if (res.length > 0) {
            console.log('res ====>', res)
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
                return element;
            });
            let chartDataTpl = {id: 0, data: [], color: '#e5e816'};
            copy.forEach(history => {
                chartDataTpl.id = history.user_id;
                // chartDataTpl.data.push({time: moment(history.bid_time).format('YYYY-MM-DD HH:mm:ss')
                //     , ranking: Number(history.ranking) === 1 ? 2 : history.ranking, needMark: history.is_bidder})
                history.ranking = Number(history.ranking) === 1 ? 2 : history.ranking;
                history.template_ranking = `Ranking: ${history.ranking} ${history.is_bidder ? '(Bit Submitter)' : ''}`;
                if (!history.template_price) {
                    history.template_price = {};
                }
                history.template_price['company_price'] = `${history.company_name} ${parseFloat(history.average_price).toFixed(4)}/KWH`;
                history.template_price['lt'] = `LT(P):$${parseFloat(history.lt_peak).toFixed(4)} LT(OP):$${parseFloat(history.lt_off_peak).toFixed(4)}`;
                history.template_price['hts'] = `HTS(P):$${parseFloat(history.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(history.hts_off_peak).toFixed(4)}`;
                history.template_price['htl'] = `HTL(P):$${parseFloat(history.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(history.htl_off_peak).toFixed(4)}`;
                chartDataTpl.data.push(history)
            });
            let last = histories[histories.length - 1];
            last.ranking = Number(last.ranking) === 1 ? 2 : last.ranking;
            console.log('res =>>>>',res);
            this.setState({
                ranking: last.ranking, priceConfig: []
                    .concat(last.lt_off_peak).concat(last.lt_peak)
                    .concat(last.hts_off_peak).concat(last.hts_peak)
                    .concat(last.htl_off_peak).concat(last.htl_peak),
                histories: res.filter(element => {
                    return element.is_bidder;
                }), chartDatas: [].concat(chartDataTpl)
            })
        }
    }

    onBidFormSubmit(configs) {
        // console.log({
        //     lt_peak:`0.${configs[1]}`, lt_off_peak: `0.${configs[0]}`
        //     , hts_peak:`0.${configs[3]}`,hts_off_peak:`0.${configs[2]}`
        //     ,htl_peak:`0.${configs[5]}`,htl_off_peak:`0.${configs[4]}`
        // });
        this.ws.sendMessage(ACTION_COMMANDS.SET_BID, {
            lt_peak:`0.${configs[1]}`, lt_off_peak: `0.${configs[0]}`
            , hts_peak:`0.${configs[3]}`,hts_off_peak:`0.${configs[2]}`
            ,htl_peak:`0.${configs[5]}`,htl_off_peak:`0.${configs[4]}`
        })
    }

    render() {
        return (
            <div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Description ranking={`${this.state.ranking === 2 ? 'TOP ' : ''}${getNumBref(this.state.ranking)}`}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Ranking data={this.state.chartDatas} yAxisFormatterRule={{0 : ' ', 1 : ' ', 2 : 'Top 2', 'func': getNumBref}}/></div>
                    </div>
                </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidForm data={this.state.priceConfig} onSubmit={this.onBidFormSubmit.bind(this)}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidHistory data={this.state.histories} order={'desc'}/></div>
                    </div>
                </div>
            </div>
        );
    }
}