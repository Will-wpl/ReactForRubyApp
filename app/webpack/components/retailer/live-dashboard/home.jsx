import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Description from './description';
import Ranking from '../../common/chart/ranking';
import BidForm from './bid-form';
import BidHistory from './bid-history';
import {findUpLimit, getRandomColor, getLoginUserId} from '../../../javascripts/componentService/util';
import {getAuctionHistorys} from '../../../javascripts/componentService/retailer/service';

export default class LiveHomePage extends Component {

    componentDidMount() {
        getAuctionHistorys(1, getLoginUserId()).then(res => {
            console.log(res);
        }, error => {
            console.log(error);
        });
    }

    render() {
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
                {/* <LiveCountdown /> */}
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Description/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><Ranking initialData={data}/></div>
                    </div>
                </div>
                <div className="u-grid u-mt2">
                    <div className="col-sm-12 col-md-5 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidForm/></div>
                    </div>
                    <div className="col-sm-12 col-md-7 u-cell">
                        <div className="col-sm-12 col-md-10 push-md-1"><BidHistory/></div>
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