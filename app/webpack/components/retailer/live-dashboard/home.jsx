import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiveCountdown from './countdown-timer';
import Description from './description';
import Ranking from '../../common/chart/ranking';
import BidForm from './bid-form';
import BidHistory from './bid-history';

export default class LiveHomePage extends Component {

    render() {
        let data = [{ time: '2017-01-01 10:00:00', ranking: 1 }
            , { time: '2017-01-01 10:01:00', ranking: 2 }
            , { time: '2017-01-01 10:02:00', ranking: 1 }
            , { time: '2017-01-01 10:03:00', ranking: 3 }
            , { time: '2017-01-01 10:04:00', ranking: 8 }]
        return (
            <div>
                <LiveCountdown />
                <div className="row">
                    <div className="col-sm-4"><Description /></div>
                    <div className="col-sm-8"><Ranking initialData={data} /></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"><BidForm /></div>
                    <div className="col-sm-8"><BidHistory /></div>
                </div>
            </div>
        );
    }
}

function runes() {
    const domNode = document.getElementById('retailerlive1');
    if(domNode !== null){
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