import React, {Component} from 'react';
import Price from '../common/chart/price';

export default class PriceRealtimeHoc extends Component {
    constructor(props) {
        super(props);
        this.list = [];
        this.state = {data: []};

    }

    componentWillReceiveProps(next) {
        if (this.list.length === 0) {
            this.list = this.list.concat(next.dataStore);
        } else {
            next.dataStore.forEach(newData => {
                let result = this.list.find(oldData => {
                    return oldData.id === newData.id;
                })
                if (result) {
                    result.data = result.data.concat(newData.data);
                }
            })
        }
    }

    updateIndentifications(ids) {
        this.filterData(ids ? ids : []);
    }

    filterData(ids) {
        let results = [];
        if (ids.length > 0) {
            ids.forEach(idColor => {
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

    render() {
        return (
            <div><Price data={this.state.data}/></div>
        )
    }
}

PriceRealtimeHoc.defaultProps = {
    dataStore:[]
}
