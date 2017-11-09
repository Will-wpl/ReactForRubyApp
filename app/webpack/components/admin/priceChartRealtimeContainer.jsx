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
        if (this.list.length === 0) {
            this.list = this.list.concat(chartData);
        } else {
            chartData.forEach(newData => {
                let result = this.list.find(oldData => {
                    return oldData.id === newData.id;
                })
                if (result) {
                    result.data = result.data.concat(newData.data);
                }
            })
        }
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
