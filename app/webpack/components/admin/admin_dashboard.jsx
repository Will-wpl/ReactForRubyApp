import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import WinnerPrice from './admin_shared/winner';
import Ranking from '../common/chart/ranking';
import Price from '../common/chart/price';
import CheckboxList from '../common/chart/list-checkbox';
export class AdminDashboard extends Component {
    constructor(props, context){
        super(props);
        this.state = {users:[], rankinglist:[], pricelist:[]};
    }
    filterRanking(ids) {
        this.refs.rankingChart.filterData(ids, this.state.rankinglist);
    }
    filterPrice(ids) {
        this.refs.priceChart.filterData(ids, this.state.pricelist);
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
        let pricelist = [{
            id: 1,
            data: [{ time: '2017-01-01 10:00:00', price: 0.1535 }
                , { time: '2017-01-01 10:01:00', price: 0.1000 }
                , { time: '2017-01-01 10:02:00', price: 0.2000 }
                , { time: '2017-01-01 10:03:00', price: 0.3000 }
                , { time: '2017-01-01 10:04:00', price: 0.4000 }]
        }, {
            id: 2,
            data: [{ time: '2017-01-01 10:00:00', price: 0.1000 }
                , { time: '2017-01-01 10:01:00', price: 0.2000 }
                , { time: '2017-01-01 10:02:00', price: 0.3000 }
                , { time: '2017-01-01 10:03:00', price: 0.4000 }
                , { time: '2017-01-01 10:04:00', price: 0.5000 }]
        }];
        this.setState({pricelist: pricelist});
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
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <Price ref="priceChart"/>
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.filterPrice.bind(this)}/>
                            </div>
                        </div>
                        <div className="u-grid u-mt2">
                            <div className="col-sm-9">
                                <Ranking initialData={data} ref="rankingChart" />
                            </div>
                            <div className="col-sm-2 push-md-1">
                                <CheckboxList list={this.state.users} onCheckeds={this.filterRanking.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <WinnerPrice showOrhide="show" statusColor="green" showStatus="Awarded" />
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