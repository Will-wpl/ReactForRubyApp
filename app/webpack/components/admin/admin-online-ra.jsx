import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {DuringCountDown} from '../shared/during-countdown';
import RetailerRanking from './admin_shared/ranking';
import ReservePrice from './admin_shared/reserveprice';
import Ranking from '../common/chart/ranking';
import CheckboxList from '../common/chart/list-checkbox';
export class AdminOnlineRa extends Component {
    constructor(props, context){
        super(props);
        this.state = {users:[], rankinglist:[]};
    }
    filterRanking(ids) {
        this.refs.rankingChart.filterData(ids, this.state.rankinglist);
    }
    componentDidMount() {
        let users = [{
            id: 1,
            name: "vivi"
        }, {
            id: 2,
            name: "judy"
        }, {
            id: 3,
            name: "jason"
        }, {
            id: 4,
            name: "mark"
        }, {
            id: 5,
            name: "will"
        }, {
            id: 6,
            name: "vivi"
        }, {
            id: 7,
            name: "judy"
        }, {
            id: 8,
            name: "jason"
        }, {
            id: 9,
            name: "mark"
        }, {
            id: 10,
            name: "will"
        }, {
            id: 11,
            name: "mark"
        }, {
            id: 12,
            name: "will"
        }];
        this.setState({users:users});
        let rankinglist = [{
            id: 1,
            data: [{ time: '2017-01-01 10:00:00', ranking: 1 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 2,
            data: [{ time: '2017-01-01 10:00:00', ranking: 2 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }, {
            id: 3,
            data: [{ time: '2017-01-01 10:00:00', ranking: 3 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 4,
            data: [{ time: '2017-01-01 10:00:00', ranking: 4 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }, {
            id: 5,
            data: [{ time: '2017-01-01 10:00:00', ranking: 5 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 6,
            data: [{ time: '2017-01-01 10:00:00', ranking: 6 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }, {
            id: 7,
            data: [{ time: '2017-01-01 10:00:00', ranking: 7 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 8,
            data: [{ time: '2017-01-01 10:00:00', ranking: 8 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }, {
            id: 9,
            data: [{ time: '2017-01-01 10:00:00', ranking: 9 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 10,
            data: [{ time: '2017-01-01 10:00:00', ranking: 10 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }, {
            id: 11,
            data: [{ time: '2017-01-01 10:00:00', ranking: 1.5 }
                , { time: '2017-01-01 10:01:00', ranking: 2 }
                , { time: '2017-01-01 10:02:00', ranking: 1 }
                , { time: '2017-01-01 10:03:00', ranking: 3 }
                , { time: '2017-01-01 10:04:00', ranking: 8 }]
        }, {
            id: 12,
            data: [{ time: '2017-01-01 10:00:00', ranking: 2.2 }
                , { time: '2017-01-01 10:01:00', ranking: 1 }
                , { time: '2017-01-01 10:02:00', ranking: 2 }
                , { time: '2017-01-01 10:03:00', ranking: 8 }
                , { time: '2017-01-01 10:04:00', ranking: 1 }]
        }];
        this.setState({rankinglist:rankinglist});
    }
    render () {
        let data = [{
            id: 1,
            data: [{time: '2017-01-01 10:00:00', ranking: 1}
                , {time: '2017-01-01 10:01:00', ranking: 2}
                , {time: '2017-01-01 10:02:00', ranking: 1}
                , {time: '2017-01-01 10:03:00', ranking: 3}
                , {time: '2017-01-01 10:04:00', ranking: 8}]
        }]
        return (
            <div>
                <DuringCountDown admin_hold="show" retailer_hold="hide" />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt3">
                            <div className="col-sm-9">
                            </div>
                            <div className="col-sm-3">
                            </div>
                        </div>
                        <div className="u-grid u-mt3">
                            <div className="col-sm-9">
                                <Ranking initialData={data} ref="rankingChart"/>
                            </div>
                            <div className="col-sm-3">
                                <CheckboxList list={this.state.users} onCheckeds={this.filterRanking.bind(this)}/>
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