import React, { Component } from 'react';
import moment from 'moment';
export default class WinnerPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green"
        }
    }
}
  render() {
      console.log(this.props.winnerData);
    return (
      <div className="winnerPrice_main">
        <h2 className={this.props.showOrhide}><span className={this.props.statusColor}>Status : {this.props.showStatus}</span></h2>
        <h4 className="u-mt1">Summary of Lowest Bidder</h4>
        <ul>
          <li><span>Lowest Price Bidder : </span><span>{this.props.winnerData.company_name}</span></li>
          <li><span>Winning Price : </span><span>{Number(this.props.winnerData.average_price).toFixed(4)}</span></li>
        </ul>
        <table className="retailer_fill" cellPadding="0" cellSpacing="0">
            <thead>
            <tr>
                <th></th>
                <th>LT</th>
                <th>HT(Small)</th>
                <th>HT(Large)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Peak (7am-7pm)</td><td>{this.props.winnerData.lt_peak}</td><td>{this.props.winnerData.hts_peak}</td><td>{this.props.winnerData.htl_peak}</td></tr>
                <tr><td>Off-Peak (7pm-7am)</td><td>{this.props.winnerData.lt_off_peak}</td><td>{this.props.winnerData.hts_off_peak}</td><td>{this.props.winnerData.htl_off_peak}</td></tr>
            </tbody>
      </table>
        <ul>
          <li><span>Total Consumption Forecast : </span><span>{this.props.winnerData.total_award_sum} kWh</span></li>
          <li><span>Contact Period : </span><span>{moment(this.props.winnerData.updated_at).format('LLL')}</span></li>
          <li><span>Total Award Sum : </span><span>{this.props.winnerData.total_award_sum}</span></li>
          </ul>
      </div>
    )
  }
}
