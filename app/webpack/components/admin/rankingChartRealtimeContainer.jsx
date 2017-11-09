import React, {Component} from 'react';
import {createWebsocket} from '../../javascripts/componentService/admin/service';
import Ranking from '../common/chart/ranking';
import moment from 'moment';

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

    appendChartData(chartData) {
        console.log(chartData)
        this.list = this.list.concat(chartData);
        this.filterData();
    }

    filterData() {
        console.log(this.list);
        let results = [];
        if (this.ids.length > 0) {
            this.ids.forEach(idColor => {
                let result = this.list.find(element => {
                    return element.id === idColor.id;
                });
                if (result) {
                    console.log(result)
                    result.color = idColor.color
                    results.push(result);
                }
            }, this);
        }
        this.setState({data: results});
    }

    componentDidMount() {

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
