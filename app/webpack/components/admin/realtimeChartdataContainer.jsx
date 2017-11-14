import React, {Component} from 'react';
import {getStandardNumBref} from '../../javascripts/componentService/util';

export default class ChartRealtimeHoc extends Component {
    constructor(props) {
        super(props);
        this.ids = [];
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
        this.filterData();
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
                    result.color = idColor.color;
                    result.data.forEach(d => {
                        d.template_ranking = `${d.company_name} Ranking: ${getStandardNumBref(d.ranking)} ${d.is_bidder && d.flag !== null ? '(Bit Submitter)' : ''}`;
                        if (!d.template_price) {
                            d.template_price = {};
                        }
                        d.template_price['company_price'] = `${d.company_name} ${parseFloat(d.average_price).toFixed(4)}/kWh`;
                        d.template_price['lt'] = `LT(P):$${parseFloat(d.lt_peak).toFixed(4)} LT(OP):$${parseFloat(d.lt_off_peak).toFixed(4)}`;
                        d.template_price['hts'] = `HTS(P):$${parseFloat(d.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(d.hts_off_peak).toFixed(4)}`;
                        d.template_price['htl'] = `HTL(P):$${parseFloat(d.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(d.htl_off_peak).toFixed(4)}`;
                    })
                    results.push(result);
                }
            }, this);
        }
        this.setState({data: results});
    }

    render() {
        return (
            <div>
                {
                    React.Children.map(this.props.children,
                        (child) => React.cloneElement(child, {data: this.state.data}))
                }
            </div>
        )
    }
}

ChartRealtimeHoc.defaultProps = {
    dataStore:[]
}

