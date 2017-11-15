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
  padZero(num, n) { 
    if(num){
      let len = num.split('.')[1].length; 
      while(len < n) { 
      num = num+"0"; 
      len++; 
      } 
      return num; 
    }
  } 
  render() {
    console.log(this.props.winner);
    return this.props.winner.data ? (
      this.props.winner.data.status ?
                    <div className="winnerPrice_main">
                              <h2 className={this.props.showOrhide}>{this.props.winner.data.status === 'win' ? <span className="green">Status : Awarded</span> : <span className="red">Status : Void</span> }</h2>
                              <h4 className="u-mt1">Summary of Lowest Bidder</h4>
                              <ul>
                                <li><span>Lowest Price Bidder: </span><span>{this.props.winner.data.lowest_price_bidder}</span></li>
                                <li><span>Lowest Average Price: </span><span>${Number(this.props.winner.data.lowest_average_price).toFixed(4)}/kWh</span></li>
                              </ul>
                              <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                                  <thead>
                                  <tr>
                                      <th></th>
                                      <th>LT</th>
                                      <th className="live_hide">HT (Small)</th>
                                      <th>HT (Large)</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr><td>Peak (7am-7pm)</td><td>{this.padZero(this.props.winner.data.lt_peak,4)}</td><td className="live_hide">{this.padZero(this.props.winner.data.hts_peak,4)}</td><td>{this.padZero(this.props.winner.data.htl_peak,4)}</td></tr>
                                      <tr><td>Off-Peak (7pm-7am)</td><td>{this.padZero(this.props.winner.data.lt_off_peak,4)}</td><td className="live_hide">{this.padZero(this.props.winner.data.hts_off_peak,4)}</td><td>{this.padZero(this.props.winner.data.htl_off_peak,4)}</td></tr>
                                  </tbody>
                            </table>
                              <ul>
                                <li><span>Contract Period: </span><span>{moment(this.props.winner.auction.contract_period_start_date).format('LL')} to {moment(this.props.winner.auction.contract_period_end_date).format('LL')}</span></li>
                                <li><span>Total Volume: </span><span>{this.props.winner.data.total_volume} kWh (forecasted)</span></li>
                                <li><span>Total Award Sum: </span><span>{this.props.winner.data.total_award_sum} (forecasted)</span></li>
                                </ul>
                            </div>
                  : <div className="winnerPrice_main">
                      <h2 className={this.props.showOrhide}>{this.props.winner.data.is_bidder ? <span className="green">Status : Awarded</span> : <span className="red">Status :Not Awarded</span>}</h2>
                      <h4 className="u-mt1">Summary of Lowest Bidder</h4>
                      <ul>
                        <li><span>Lowest Price Bidder: </span><span>{this.props.winner.data.company_name}</span></li>
                        <li><span>Lowest Average Price: </span><span>${Number(this.props.winner.data.average_price).toFixed(4)}/kWh</span></li>
                      </ul>
                      <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                          <thead>
                          <tr>
                              <th></th>
                              <th>LT</th>
                              <th className="live_hide">HT (Small)</th>
                              <th>HT (Large)</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr><td>Peak (7am-7pm)</td><td>{this.padZero(this.props.winner.data.lt_peak,4)}</td><td className="live_hide">{this.padZero(this.props.winner.data.hts_peak,4)}</td><td>{this.padZero(this.props.winner.data.htl_peak,4)}</td></tr>
                              <tr><td>Off-Peak (7pm-7am)</td><td>{this.padZero(this.props.winner.data.lt_off_peak,4)}</td><td className="live_hide">{this.padZero(this.props.winner.data.hts_off_peak,4)}</td><td>{this.padZero(this.props.winner.data.htl_off_peak,4)}</td></tr>
                          </tbody>
                    </table>
                      <ul>
                        <li><span>Contract Period: </span><span>{moment(this.props.winner.auction.contract_period_start_date).format('LL')} to {moment(this.props.winner.auction.contract_period_end_date).format('LL')}</span></li>
                        <li><span>Total Volume: </span><span>{this.props.winner.auction.total_volume} kWh (forecasted)</span></li>
                        <li><span>Total Award Sum: </span><span>{this.props.winner.data.total_award_sum} (forecasted)</span></li>
                        </ul>
                    </div>                       
    ):(
      <div className="winnerPrice_main">no data</div>
    )
  }
}
