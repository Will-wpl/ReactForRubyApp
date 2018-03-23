import React, {Component} from 'react';
import {getStandardNumBref} from '../../javascripts/componentService/util';
import moment from 'moment';

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
            // let dataCopy = JSON.parse(JSON.stringify(next.dataStore));
            next.dataStore.forEach(newData => {
                let result = this.list.find(oldData => {
                    return oldData.id === newData.id;
                })
                if (result) {
                    // result.data = result.data.concat(newData.data);
                    // console.error('result ====>', result.id, newData.id)
                    if (result.data.length > 0 && newData.data.length > 0) {
                        let oldLast = result.data[result.data.length - 1];
                        let newLast = newData.data[newData.data.length - 1];
                        // console.error('oldLast, newLast ====>', oldLast, newLast)
                        if (oldLast.flag !== newLast.flag && moment(newLast.bid_time) > moment(oldLast.bid_time)) {
                            result.data = result.data.concat(newData.data);
                        } else {
                            // console.error('chart append error ====>', result, 'connect new data ===>', newData)
                        }
                    }

                }
            })
        }
        // console.log('chart data ====>', this.list);
        this.filterData();
    }

    updateIndentifications(ids) {
        this.ids = ids ? ids : [];
        // console.log('==================>', ids)
        // console.log('==================>', this.list)
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
                        d.template_ranking = `${d.company_name} Ranking: ${getStandardNumBref(d.ranking)} ${d.is_bidder && d.flag !== null ? '(Bid Submitter)' : ''}`;
                        if (!d.template_price) {
                            d.template_price = {};
                        }

                        d.template_price['company_price'] = `${d.company_name} $${parseFloat(d.average_price).toFixed(4)}/kWh`;
                        d.template_price['lt'] = `LT(P):$${parseFloat(d.lt_peak).toFixed(4)} LT(OP):$${parseFloat(d.lt_off_peak).toFixed(4)}`;
                        d.template_price['hts'] = `HTS(P):$${parseFloat(d.hts_peak).toFixed(4)} HTS(OP):$${parseFloat(d.hts_off_peak).toFixed(4)}`;
                        d.template_price['htl'] = `HTL(P):$${parseFloat(d.htl_peak).toFixed(4)} HTL(OP):$${parseFloat(d.htl_off_peak).toFixed(4)}`;
                        d.template_price['eht'] = `EHT(P):$${parseFloat(d.eht_peak).toFixed(4)} EHT(OP):$${parseFloat(d.eht_off_peak).toFixed(4)}`;
                    })
                    results.push(result);

                }
            }, this);
        }
        this.setState({data: results});
    }

    render() {
        return (
            <div style={{'width':'100%'}}>
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

