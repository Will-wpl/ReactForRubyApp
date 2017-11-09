import React, {Component} from 'react';
import {createWebsocket} from '../../javascripts/componentService/admin/service';
import Price from '../common/chart/price';
import moment from 'moment';

export default class PriceRealtimeHoc extends Component {
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
        this.list = this.list.concat(chartData)
        this.forceUpdate();
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

    }

    render() {
        return (
            <div><Price data={this.state.data}/></div>
        )
    }
}
