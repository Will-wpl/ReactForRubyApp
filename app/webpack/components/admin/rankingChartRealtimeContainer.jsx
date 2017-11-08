import React, {Component} from 'react';
import {createWebsocket} from '../../javascripts/componentService/admin/service';
import Ranking from '../common/chart/ranking';

export default class RankingRealtimeHoc extends Component {
    constructor(props) {
        super(props);
        this.ids = [];
        this.list = [];
        this.state = {data: []};

    }

    updateIndentifications(ids) {
        this.ids = ids ? ids : [];
        this.filterData();
    }

    filterData() {
        let results = [];
        if (this.ids.length > 0) {
            this.ids.forEach(idColor => {
                let result = this.list.find(element => {
                    return element.id === idColor.id;
                });
                if (result) {
                    result.color = idColor.color
                    results.push(result);
                }
            }, this);
        }
        this.setState({data: results});
    }

    componentDidMount() {
        // let ws = createWebsocket(1);
        // console.log(ws)
        // ws.onConnected(() => {
        //     console.log('---message client connected ---');
        // }).onDisconnected(() => {
        //     console.log('---message client disconnected ----')
        // }).onReceivedData(data => {
        //     console.log('---message client received data ---', data);
        // })
        let list = [{
            id: 1,
            data: [{time: '2017-01-01 10:00:00', ranking: 1}
                , {time: '2017-01-01 10:01:00', ranking: 2}
                , {time: '2017-01-01 10:02:00', ranking: 1}
                , {time: '2017-01-01 10:03:00', ranking: 3}
                , {time: '2017-01-01 10:04:00', ranking: 8}]
        }, {
            id: 2,
            data: [{time: '2017-01-01 10:00:00', ranking: 2}
                , {time: '2017-01-01 10:01:00', ranking: 3}
                , {time: '2017-01-01 10:02:00', ranking: 2}
                , {time: '2017-01-01 10:03:00', ranking: 8}
                , {time: '2017-01-01 10:04:00', ranking: 1}]
        }, {
            id: 3,
            data: [{time: '2017-01-01 10:00:00', ranking: 3}
                , {time: '2017-01-01 10:01:00', ranking: 4}
                , {time: '2017-01-01 10:02:00', ranking: 1}
                , {time: '2017-01-01 10:03:00', ranking: 3}
                , {time: '2017-01-01 10:04:00', ranking: 8}]
        }, {
            id: 4,
            data: [{time: '2017-01-01 10:00:00', ranking: 4}
                , {time: '2017-01-01 10:01:00', ranking: 6}
                , {time: '2017-01-01 10:02:00', ranking: 2}
                , {time: '2017-01-01 10:03:00', ranking: 8}
                , {time: '2017-01-01 10:04:00', ranking: 1}]
        }, {
            id: 5,
            data: [{time: '2017-01-01 10:00:00', ranking: 5}
                , {time: '2017-01-01 10:01:00', ranking: 5}
                , {time: '2017-01-01 10:02:00', ranking: 1}
                , {time: '2017-01-01 10:03:00', ranking: 3}
                , {time: '2017-01-01 10:04:00', ranking: 8}]
        }, {
            id: 6,
            data: [{time: '2017-01-01 10:00:00', ranking: 6}
                , {time: '2017-01-01 10:01:00', ranking: 8}
                , {time: '2017-01-01 10:02:00', ranking: 2}
                , {time: '2017-01-01 10:03:00', ranking: 8}
                , {time: '2017-01-01 10:04:00', ranking: 1}]
        }];
        setTimeout(() => {
            this.list = list;
            // this.filterData();
        }, 4000);
    }

    render() {
        return (
            <div><Ranking data={this.state.data}/></div>
            // <div>
            //     {
            //         React.Children.map(this.props.children
            //             , (child) => React.cloneElement(child, {data: this.state.data}
            //             ))
            //     }
            // </div>
        )
    }
}
