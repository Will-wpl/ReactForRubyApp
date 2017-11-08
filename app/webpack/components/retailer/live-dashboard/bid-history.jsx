import React, {Component} from 'react';

export default class BidHistory extends Component {

    render() {
        let trs = this.props.data.map((element, index) => {
            return <tr key={element.id}>
                <td>{index + 1}</td>
                <td>{element.bid_time}</td>
                <td>${element.lt_off_peak}</td>
                <td>${element.lt_peak}</td>
                <td>${element.hts_off_peak}</td>
                <td>${element.hts_peak}</td>
                <td>${element.htl_off_peak}</td>
                <td>${element.htl_peak}</td>
            </tr>
        })
        return (
            <form>
                <h3>My Bid History</h3>
                <table className="retailer_fill u-mt2">
                    <thead>
                    <tr>
                        <th colSpan="8" className="table_title">Bid Price</th>
                    </tr>
                    <tr>
                        <th>S/N</th>
                        <th>Time</th>
                        <th>LT (Off-Peak)</th>
                        <th>LT (Peak)</th>
                        <th>HTS (Off-Peak)</th>
                        <th>HTS (Peak)</th>
                        <th>HTL (Off-Peak)</th>
                        <th>HTL (Peak)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trs}
                    </tbody>
                </table>
            </form>
        );
    }
}