import React, {Component} from 'react';

export default class BidHistory extends Component {

    render() {
        let trs;
        if (this.props.order !== 'desc') {
            trs = this.props.data.map((element, index) => {
                return <tr key={element.id}>
                    <td>{index + 1}</td>
                    <td>{element.bid_time}</td>
                    <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$ {element.lt_peak}</td>
                    <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$ {element.lt_off_peak}</td>
                    <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$ {element.hts_peak}</td>
                    <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$ {element.hts_off_peak}</td>
                    <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$ {element.htl_peak}</td>
                    <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$ {element.htl_off_peak}</td>
                    <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$ {element.eht_peak}</td>
                    <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$ {element.eht_off_peak}</td>
                </tr>
            })
        } else {
            let len = this.props.data.length;
            trs = [];
            for (let i = len - 1; i >= 0; i--) {
                let element = this.props.data[i];
                trs.push(<tr key={element.id}>
                    <td>{i + 1}</td>
                    <td>{element.bid_time}</td>
                    <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$ {element.lt_peak}</td>
                    <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$ {element.lt_off_peak}</td>
                    <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$ {element.hts_peak}</td>
                    <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$ {element.hts_off_peak}</td>
                    <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$ {element.htl_peak}</td>
                    <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$ {element.htl_off_peak}</td>
                    <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$ {element.eht_peak}</td>
                    <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$ {element.eht_off_peak}</td>
                </tr>)
            }
        }
        const a = this.props.isLtVisible ? 2 : 0;
        const b = this.props.isHtsVisible ? 2 : 0;
        const c = this.props.isHtlVisible ? 2 : 0;
        const d = this.props.isEhtVisible ? 2 : 0;
        return (
            <form>
                <h3>My Bid History</h3>
                <div className="table-head">
                <table className="retailer_fill u-mt2">
                    <colgroup>
                        <col style={{width: 50 +'px'}} />
                        <col style={{width: 100 +'px'}} />
                        <col style={this.props.isLtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isLtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtsVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtsVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtlVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtlVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isEhtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isEhtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th colSpan={2 + a + b + c + d} className="table_title">Bid Price</th>
                    </tr>
                    <tr>
                        <th>S/N</th>
                        <th>Time</th>
                        <th style={this.props.isLtVisible ? {} : {display: 'none'}}>LT (Peak)<br/>($/kWh)</th>
                        <th style={this.props.isLtVisible ? {} : {display: 'none'}}>LT (Off-Peak)<br/>($/kWh)</th>
                        <th style={this.props.isHtsVisible ? {} : {display: 'none'}}>HTS (Peak)<br/>($/kWh)</th>
                        <th style={this.props.isHtsVisible ? {} : {display: 'none'}}>HTS (Off-Peak)<br/>($/kWh)</th>
                        <th style={this.props.isHtlVisible ? {} : {display: 'none'}}>HTL (Peak)<br/>($/kWh)</th>
                        <th style={this.props.isHtlVisible ? {} : {display: 'none'}}>HTL (Off-Peak)<br/>($/kWh)</th>
                        <th style={this.props.isEhtVisible ? {} : {display: 'none'}}>EHT (Peak)<br/>($/kWh)</th>
                        <th style={this.props.isEhtVisible ? {} : {display: 'none'}}>EHT (Off-Peak)<br/>($/kWh)</th>
                    </tr>
                    </thead>
                </table>
                </div>
                <div className="table-body">
                <table className="retailer_fill">
                    <colgroup>
                        <col style={{width: 50 +'px'}} />
                        <col style={{width: 100 +'px'}} />
                        <col style={this.props.isLtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isLtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtsVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtsVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtlVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isHtlVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isEhtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                        <col style={this.props.isEhtVisible ? {width: 50 +'px'} : {display: 'none'}} />
                    </colgroup>
                    <tbody>
                    {trs}
                    </tbody>
                </table>
                </div>
            </form>
        );
    }
}

BidHistory.defaultProps = {
    order : 'asc',
    isLtVisible: true,
    isHtsVisible: true,
    isHtlVisible: true,
    isEhtVisible: true
}