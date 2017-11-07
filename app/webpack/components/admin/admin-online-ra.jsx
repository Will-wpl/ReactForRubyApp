import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {DuringCountDown} from '../shared/during-countdown';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import CheckboxList from '../common/chart/list-checkbox';
import {getArrangements} from '../../javascripts/componentService/admin/service';
import {ACCEPT_STATUS} from '../../javascripts/componentService/constant';
import RankingRealtimeHoc from './rankingChartRealtimeContainer';
import PriceRealtimeHoc from './priceChartRealtimeContainer';

export class AdminOnlineRa extends Component {
    constructor(props, context){
        super(props);
        this.state = {users:[]};
    }
    updateRankingOnUsersSelected(ids) {
        this.refs.rankingChart.updateIndentifications(ids);
    }
    updatePriceOnUsersSelected(ids) {
        this.refs.priceChart.updateIndentifications(ids);
    }
    componentDidMount() {
        getArrangements(ACCEPT_STATUS.PENDING).then(res => {
            this.setState({users:res});
        }, error => {
            console.log(error);
        });
    }
    render () {
        return (
            <div>
                <DuringCountDown admin_hold="show" retailer_hold="hide" />
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
                        <ReservePrice />
                        <RetailerRanking />
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminOnlineRa');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminOnlineRa),
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