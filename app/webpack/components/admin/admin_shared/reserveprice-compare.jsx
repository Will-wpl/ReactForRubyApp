import React, { Component } from 'react';
export default class ReservePriceCompare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lt_peak: false, hts_peak: false, htl_peak: false, eht_peak: false,
            lt_off_peak: false, hts_off_peak: false, htl_off_peak: false, eht_off_peak: false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.compare && nextProps.contracts[0]) {
            this.compare(nextProps.contracts[0], nextProps.compare)
        }
    }
    compare(oldData, newData) {
        parseFloat(oldData.reserve_price_lt_peak) >= parseFloat(newData.lt_peak) ? this.setState({ lt_peak: true }) : this.setState({ lt_peak: false });
        parseFloat(oldData.reserve_price_hts_peak) >= parseFloat(newData.hts_peak) ? this.setState({ hts_peak: true }) : this.setState({ hts_peak: false });
        parseFloat(oldData.reserve_price_htl_peak) >= parseFloat(newData.htl_peak) ? this.setState({ htl_peak: true }) : this.setState({ htl_peak: false });
        parseFloat(oldData.reserve_price_eht_peak) >= parseFloat(newData.eht_peak) ? this.setState({ eht_peak: true }) : this.setState({ eht_peak: false });
        parseFloat(oldData.reserve_price_lt_off_peak) >= parseFloat(newData.lt_off_peak) ? this.setState({ lt_off_peak: true }) : this.setState({ lt_off_peak: false });
        parseFloat(oldData.reserve_price_hts_off_peak) >= parseFloat(newData.hts_off_peak) ? this.setState({ hts_off_peak: true }) : this.setState({ hts_off_peak: false });
        parseFloat(oldData.reserve_price_htl_off_peak) >= parseFloat(newData.htl_off_peak) ? this.setState({ htl_off_peak: true }) : this.setState({ htl_off_peak: false });
        parseFloat(oldData.reserve_price_eht_off_peak) >= parseFloat(newData.eht_off_peak) ? this.setState({ eht_off_peak: true }) : this.setState({ eht_off_peak: false });
    }
    mouthsHtml(data, index) {
        const html = <div className={"retailrank_main"} key={index}>
            <h3 className={"u-mt2 u-mb2"}>Reserve Price</h3>
            <div className="lm--formItem lm--formItem--inline string optional">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th></th>
                            {data.has_lt ? <th>LT<br />($/kWh)</th> : <th style={{ display: "none" }}></th>}
                            {data.has_hts ? <th>HTS<br />($/kWh)</th> : <th style={{ display: "none" }}></th>}
                            {data.has_htl ? <th>HTL<br />($/kWh)</th> : <th style={{ display: "none" }}></th>}
                            {data.has_eht ? <th>EHT<br />($/kWh)</th> : <th style={{ display: "none" }}></th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Peak<br />(7am-7pm)</td>
                            {data.has_lt ? <td><abbr className={this.state.lt_peak ? 'fill_yes' : 'fill_no'}>{parseFloat(data.reserve_price_lt_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_hts ? <td><abbr className={this.state.hts_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_hts_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_htl ? <td><abbr className={this.state.htl_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_htl_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_eht ? <td><abbr className={this.state.eht_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_eht_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                        </tr>
                        <tr>
                            <td>Off Peak<br />(7pm-7am)</td>
                            {data.has_lt ? <td><abbr className={this.state.lt_off_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_lt_off_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_hts ? <td><abbr className={this.state.hts_off_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_hts_off_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_htl ? <td><abbr className={this.state.htl_off_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_htl_off_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                            {data.has_eht ? <td><abbr className={this.state.eht_off_peak ? 'fill_yes' : 'fill_no'}> {parseFloat(data.reserve_price_eht_off_peak).toFixed(4)}</abbr></td> : <td style={{ display: "none" }}></td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        return html;
    }
    render() {
        return (
            <div>
                {this.props.contracts ?
                    (this.props.contracts.map((item, index) => {
                        return this.mouthsHtml(item, index);
                    }))
                    : ''}
            </div>
        )
    }
}

