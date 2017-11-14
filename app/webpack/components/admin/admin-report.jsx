import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import CheckboxList from '../common/chart/list-checkbox';
import {getArrangements, getHistories,getHistoriesLast} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {findUpLimit, getRandomColor} from '../../javascripts/componentService/util';
import {ACCEPT_STATUS} from '../../javascripts/componentService/constant';
import ChartRealtimeHoc from './realtimeChartdataContainer';
import Ranking from '../common/chart/ranking';
import Price from '../common/chart/price';
import WinnerPrice from './admin_shared/winner';
import moment from 'moment';

export class AdminReport extends Component {
    constructor(props){
        super(props);
        this.state = {users:[], histories:[], ranking:[], currentPrice:'0.0000'};
        this.winner = {
            data:{},
            auction:{}
        }
    }

    componentDidMount() {
        getAuction().then(auction => {
            this.auction = auction;
            this.userStartInfo = auction ? `${auction.name} on ${moment(auction.start_datetime).format('D MMM YYYY')}` : '';
            this.startTime = auction ? `${moment(auction.start_datetime).format('h:mm a')}` : '';
            this.endTime = auction ? `${moment(auction.actual_end_time).format('h:mm a')}` : '';
            this.duration = parseInt((moment(auction.actual_end_time) - moment(auction.actual_begin_time))/1000/60);
            this.startPrice = auction ? parseFloat(auction.reserve_price).toFixed(4) : '0.0000';
            this.actualPrice = '0.0000';
            getHistoriesLast({ auction_id: auction? auction.id : 1}).then(data => {
                console.log('histories', data);
                this.winner.data = data.result;
                this.winner.auction = data.auction;
            })
            getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
                // console.log('histories', histories);
                let orderRanking = []
                if(histories.length > 0){
                    orderRanking = histories.map(element => {
                        return element.data.length > 0 ? element.data[element.data.length - 1] : []
                    })
                }else{
                    orderRanking = [];
                }
                try {
                    orderRanking.sort((a, b) => {
                        return parseFloat(a.average_price) > parseFloat(b.average_price)
                    })
                } catch (error) {

                }
                this.actualPrice = orderRanking.length > 0 ? orderRanking[0].average_price : '0.0000';

                this.setState({histories: histories, ranking: orderRanking});
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

    render () {
        let achieved = parseFloat(this.actualPrice) < parseFloat(this.startPrice);
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
                                <span>Reserve Price = $ {this.startPrice} /KWh</span>
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
                                <CheckboxList list={this.state.users} onCheckeds={(ids) => {this.refs.priceChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <ChartRealtimeHoc ref="rankingChart" dataStore={this.state.histories}>
                                    <Ranking />
                                </ChartRealtimeHoc>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={(ids) => {this.refs.rankingChart.updateIndentifications(ids)}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <WinnerPrice showOrhide="show" isWinner="winner" winner={this.winner} />
                        <RetailerRanking ranking={this.state.ranking}/>
                    </div>
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
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}