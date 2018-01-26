import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import CheckboxList from '../common/chart/list-checkbox';
import CheckboxListItem from '../common/chart/list-checkbox-item';
import {getArrangements, getHistories,getHistoriesLast} from '../../javascripts/componentService/admin/service';
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
        getAuction('admin',sessionStorage.auction_id).then(auction => {
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
                this.priceUsers.selectAll(users);
                this.rankingUsers.selectAll(users);
            }, error => {
                //console.log(error);
            });
        })
    }

    render () {
        let achieved = parseFloat(this.actualPrice).toFixed(4) <= parseFloat(this.startPrice);
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
                                    <Price/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'check/uncheck all'} color={'white'} status={true} onCheck={(id, status, color) => {
                                    if (status) {
                                        this.priceUsers.selectAll(this.state.users);
                                    } else {
                                        this.priceUsers.disSelectAll();
                                    }
                                }} />
                                <CheckboxList list={this.state.users} ref={e => this.priceUsers = e} onCheckeds={(ids) => {this.refs.priceChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.histories}>
                                    <Ranking yAxisFormatterRule={{0 : ' ', 'func': getStandardNumBref}}/>
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxListItem key={0} id={0} display={'check/uncheck all'} color={'white'} status={true} onCheck={(id, status, color) => {
                                    if (status) {
                                        this.rankingUsers.selectAll(this.state.users);
                                    } else {
                                        this.rankingUsers.disSelectAll();
                                    }
                                }} />
                                <CheckboxList list={this.state.users} ref={e => this.rankingUsers = e} onCheckeds={(ids) => {this.refs.rankingChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <WinnerPrice showOrhide="show" winner={this.state.winner} />
                        <RetailerRanking ranking={this.state.ranking}/>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
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