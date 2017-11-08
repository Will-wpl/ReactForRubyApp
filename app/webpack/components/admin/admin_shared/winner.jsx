import React, { Component } from 'react';

export default class WinnerPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green"
        },
        listData:{
            "name":"Senoko",
            "price":"$0.0850/kWh",
            "total":"1,270,199 kWh",
            "Period":"19 Oct 2018 to 30 Jun 2018",
            "sum":"$674,475.67(Forecasted)",
            "winnerPricetable":[
                {"peak":"Peak (7am-7pm)","lt":"$ 0.XXXX","ht_small":"$ 0.XXXX","ht_large":"$ 0.XXXX"},
                {"peak":"Off-Peak (7pm-7am)","lt":"$ 0.XXXX","ht_small":"$ 0.XXXX","ht_large":"$ 0.XXXX"}
            ]
        }
    }
}
  render() {
    return (
      <div className="winnerPrice_main">
        <h2 className={this.props.showOrhide}><span className={this.props.statusColor}>Status : {this.props.showStatus}</span></h2>
        <h4 className="u-mt1">Summary of Lowest Bidder</h4>
        <ul>
          <li><span>Lowest Price Bidder:</span><span>{this.state.listData.name}</span></li>
          <li><span>Winning Price:</span><span>{this.state.listData.price}</span></li>
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
                {
                this.state.listData.winnerPricetable.map((item,index)=>{
                    return(
                    <tr key={index}>
                    <td>{item.peak}</td>
                    <td>{item.lt}</td>
                    <td>{item.ht_small}</td>
                    <td>{item.ht_large}</td></tr>
                    )
                })
                }
            </tbody>
      </table>
        <ul>
          <li><span>Total Consumption Forecast:</span><span>{this.state.listData.total}</span></li>
          <li><span>Contact Period:</span><span>{this.state.listData.Period}</span></li>
          <li><span>Total Award Sum:</span><span>{this.state.listData.sum}</span></li>
          </ul>
      </div>
    )
  }
}
