import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Description from './description';
import Ranking from '../../common/chart/ranking';
import BidForm from './bid-form';
import BidHistory from './bid-history';
import {getLoginUserId} from '../../../javascripts/componentService/util';
import {getAuctionHistorys} from '../../../javascripts/componentService/retailer/service';
import {createWebsocket} from '../../../javascripts/componentService/common/service';
import moment from 'moment';

export default class LiveHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {ranking: '', priceConfig: ['', '', '', '', '', ''], histories: [], chartDatas: []};
    }

    componentDidMount() {
        getAuctionHistorys(1, getLoginUserId()).then(res => {
            console.log(res);
            this.makeup(res);
            this.createSocket();
        }, error => {
            console.log(error);
            this.createSocket();
        });
    }

    createSocket() {
        this.ws = createWebsocket(1);
        console.log(this.ws)
        this.ws.onConnected(() => {
            console.log('---message client connected ---');
        }).onDisconnected(() => {
            console.log('---message client disconnected ----')
        }).onReceivedData(data => {
            console.log('---message client received data ---', data);
        })
    }

    makeup(res) {
        if (res.length > 0) {
            let copy = JSON.parse(JSON.stringify(res));
            let histories = res.map(element => {
                element.bid_time = moment(element.bid_time).format('HH:mm:ss');
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
                chartDataTpl.data.push({time: moment(history.bid_time).format('YYYY-MM-DD HH:mm:ss')
                    , ranking: history.ranking, needMark: history.is_bidder})
            });
            let last = histories[histories.length - 1];
            this.setState({
                ranking: last.ranking, priceConfig: []
                    .concat(last.lt_off_peak).concat(last.lt_peak)
                    .concat(last.hts_off_peak).concat(last.hts_peak)
                    .concat(last.htl_off_peak).concat(last.htl_peak),
                histories: res, chartDatas: [].concat(chartDataTpl)
            })
        }
    }

    onBidFormSubmit(configs) {
        console.log({lt_peak:`${configs[0]}`, lt_off_peak: `${configs[1]}`
            , hts_peak:`${configs[2]}`,hts_off_peak:`${configs[3]}`,htl_peak:`${configs[4]}`,htl_off_peak:`${configs[5]}`});
        this.ws.sendMessage('set_bid', {lt_peak:`${configs[0]}`, lt_off_peak: `${configs[1]}`
            , hts_peak:`${configs[2]}`,hts_off_peak:`${configs[3]}`,htl_peak:`${configs[4]}`,htl_off_peak:`${configs[5]}`})
    }

    render() {
        let data = [{
            id: 1,
            data: [{time: '2017-01-01 10:00:00', ranking: 1}
                , {time: '2017-01-01 10:01:00', ranking: 2}
                , {time: '2017-01-01 10:02:00', ranking: 1}
                , {time: '2017-01-01 10:03:00', ranking: 3}
                , {time: '2017-01-01 10:04:00', ranking: 8}]
        }];
        return (
            <div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Description ranking={this.state.ranking}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Ranking data={this.state.chartDatas}/></div>
                    </div>
                </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidForm data={this.state.priceConfig} onSubmit={this.onBidFormSubmit.bind(this)}/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidHistory data={this.state.histories}/></div>
                    </div>
                </div>
            </div>
        );
    }
}

function runes() {
    const domNode = document.getElementById('retailerlive1');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(LiveHomePage),
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
    runes();
} else {
    window.addEventListener('DOMContentLoaded', runes, false);
}