import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import CheckboxList from '../common/chart/list-checkbox';
import CheckboxListItem from '../common/chart/list-checkbox-item';
import {getArrangements, getHistories,getHistoriesLast,doPdf} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {findUpLimit, getRandomColor, getStandardNumBref} from '../../javascripts/componentService/util';
import {ACCEPT_STATUS} from '../../javascripts/componentService/constant';
import ChartRealtimeHoc from './realtimeChartdataContainer';
import Ranking from '../common/chart/ranking';
import Price from '../common/chart/price';
import WinnerPrice from './admin_shared/winner';
import moment from 'moment';

export class AdminReport extends Component {
    constructor(props){
        super(props);
        this.state = {
            users:[], histories:[], ranking:[],
            winner:{
                data:{},
                auction:{}
            }
        };
    }

    componentDidMount() {
        getAuction('admin',(window.location.href.split("auctions/")[1]).split("/report")[0]).then(auction => {
            this.auction = auction;
            this.userStartInfo = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY')}` : '';
            this.startTime = auction ? `${moment(auction.actual_begin_time).format('h:mm A')}` : '';
            this.endTime = auction ? `${moment(auction.actual_end_time).format('h:mm A')}` : '';
            this.duration = parseInt((moment(auction.actual_end_time) - moment(auction.actual_begin_time))/1000/60);
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000';
            this.actualPrice = '0.0000';
            const auctionId = auction? auction.id : 1;
            getHistoriesLast({ auction_id: auctionId}).then(data => {
                this.actualPrice = data.histories.length > 0 ? data.histories[0].average_price : '0.0000';
                getHistories({ auction_id: auctionId}).then(histories => {
                    this.setState({
                        histories: histories,
                        winner:{
                            data:data.result,
                            auction:data.auction
                        },
                        ranking:data.histories
                    });
                }, error => {
                    this.forceUpdate();
                })
            }, error => {
                getHistories({ auction_id: auctionId}).then(histories => {
                    this.setState({histories: histories});
                })
            })
            // getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
            //     // console.log('histories', histories);
            //     this.setState({histories: histories});
            // })

            getArrangements(auctionId, ACCEPT_STATUS.ACCEPT).then(res => {
                let limit = findUpLimit(res.length);
                let users = res.map((element, index) => {
                    element['color'] = getRandomColor(index + 1, limit); //getRandomColor((index + 1) * 1.0 / limit);
                    return element;
                });
                this.setState({users:users});
                this.userLen = users.length;
                this.priceUsers.setList(JSON.parse(JSON.stringify(users)));
                this.rankingUsers.setList(JSON.parse(JSON.stringify(users)));
                this.priceUsers.selectAll();
                this.rankingUsers.selectAll();
            }, error => {
                //console.log(error);
            });
        })
    }
    dopdf(){
        let uid = this.priceUsers.getSelectUid(),
            uid2 = this.rankingUsers.getSelectUid(),
            data = $.extend(this.refs.price.makeXy(),this.refs.ranking.makeXy());
            data.id = this.auction.id;
            data.uid = (JSON.stringify(uid).split("[")[1]).split("]")[0];
            data.uid2 = (JSON.stringify(uid2).split("[")[1]).split("]")[0];
        console.log(data);
        window.open(`/api/admin/auctions/${data.id}/pdf?start_time=${data.start_time}&end_time=${data.end_time}&start_time2=${data.start_time2}&end_time2=${data.end_time2}&start_price=${data.start_price}&end_price=${data.end_price}&uid=${data.uid}&uid2=${data.uid2}`);
    }
    render () {
        let achieved = parseFloat(this.actualPrice).toFixed(4) <= parseFloat(this.startPrice);
        const visibility_lt = !this.auction ? true: Number(this.auction.total_lt_peak) > 0 || Number(this.auction.total_lt_off_peak) > 0;
        const visibility_hts = !this.auction ? true: Number(this.auction.total_hts_peak) > 0 || Number(this.auction.total_hts_off_peak) > 0;
        const visibility_htl = !this.auction ? true: Number(this.auction.total_htl_peak) > 0 || Number(this.auction.total_htl_off_peak) > 0;
        const visibility_eht = !this.auction ? true: Number(this.auction.total_eht_peak) > 0 || Number(this.auction.total_eht_off_peak) > 0;
        return (
            <div>
                <div className="u-grid u-mt2 report_bg">
                    <div className="col-sm-12 col-md-7">
                        <p>{this.userStartInfo}</p>
                        <p>Start Time : {this.startTime}, End Time : {this.endTime} Total Auction Duration : {this.duration} minutes</p>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <dl className="reservePrice">
                            <dd>
                                <span>Reserve Price = $ {this.startPrice} /kWh</span>
                                <span className={achieved ? 'success' : 'fail'}>
                                {achieved ? 'Reserve Price Achieved' : 'Reserve Price Not Achieved'}
                                </span>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="priceChart" dataStore={this.state.histories}>
                                    <Price isLtVisible={visibility_lt} ref="price" isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/>
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
                                <CheckboxList list={this.state.users} ref={e => this.priceUsers = e} onCheckeds={(ids) => {
                                    this.refs.priceChart.updateIndentifications(ids);
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
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.histories}>
                                    <Ranking ref="ranking"  yAxisFormatterRule={{0 : ' ', 'func': getStandardNumBref}}/>
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
                                <CheckboxList list={this.state.users} ref={e => this.rankingUsers = e} onCheckeds={(ids) => {
                                    this.refs.rankingChart.updateIndentifications(ids)
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
                        <WinnerPrice showOrhide="show" winner={this.state.winner} isLtVisible={visibility_lt} isHtsVisible={visibility_hts} isHtlVisible={visibility_htl} isEhtVisible={visibility_eht}/>
                        <RetailerRanking ranking={this.state.ranking}/>
                        <div className="retailrank_main"><a className="lm--button lm--button--primary u-mt3" onClick={this.dopdf.bind(this)} >Make PDF</a></div>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/auction_results" >Back</a>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminReport');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminReport),
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