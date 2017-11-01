import React, { Component } from 'react';

export default class ReservePrice extends Component {
  constructor(props){
    super(props);
    this.state={
        list_data:{
            priceNum:"0.0556",
            priceStatus:"fail",
            priceText:"Reserve Price Not Achieved"
        }
    }
}
  render() {
    return (
      <dl className="reservePrice">
        <dd>SP Group Reserve Auction</dd>
        <dd><span>Reserve Pice = $ {this.state.list_Data.priceNum} /KWh</span><span className={this.state.list_Data.priceStatus}>{this.state.list_Data.priceText}</span></dd>
      </dl>
    )
  }
}
