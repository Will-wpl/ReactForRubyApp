import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
// import WinnerPrice from './admin_shared/winner';
import CheckboxList from '../common/chart/list-checkbox';
import {getArrangements, getHistories} from '../../javascripts/componentService/admin/service';
import {createWebsocket, getAuction} from '../../javascripts/componentService/common/service';
import {findUpLimit, getRandomColor} from '../../javascripts/componentService/util';
import {ACCEPT_STATUS} from '../../javascripts/componentService/constant';
import RankingRealtimeHoc from './rankingChartRealtimeContainer';
import PriceRealtimeHoc from './priceChartRealtimeContainer';
import {DuringCountDown} from '../shared/during-countdown';
import moment from 'moment';

export class AdminDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {users:[], extendedValue:1};
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
            this.forceUpdate();
            this.createWebsocket(auction? auction.id : 1);
            getHistories({ auction_id: auction? auction.id : 1}).then(histories => {
                this.updateChartData(histories);
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
                    console.log('histories', histories);
                    this.updateChartData(histories);
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

    extendTime() {
        this.ws.sendMessage('extend_time', {'extend_time' : `${this.state.extendedValue}`});
    }

    goToFinish() {

    }

    render () {
        return (
            <div>
                <DuringCountDown auction={this.auction} countDownOver={this.goToFinish.bind(this)}>
                    <div id="admin_hold">
                        <span>Extend Time:</span>
                        <input type="number" className="fill_hold" value={this.state.extendedValue} onChange={this.onExtendInputChanged.bind(this)}/>
                        <span>Min</span>
                        <input type="button" className="hold_submit" value="Submit" onClick={this.extendTime.bind(this)}/>
                    </div>
                </DuringCountDown>
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <PriceRealtimeHoc ref="priceChart" />
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.updatePriceOnUsersSelected.bind(this)}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <RankingRealtimeHoc ref="rankingChart" />
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.updateRankingOnUsersSelected.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        {/*<WinnerPrice showOrhide="show" statusColor="green" showStatus="Awarded" />*/}
                        {/*<RetailerRanking />*/}
                        <ReservePrice />
                        <RetailerRanking />
                    </div>
                </div>
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