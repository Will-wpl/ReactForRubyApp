import React, { Component } from 'react';

export default class ReservePrice extends Component {
  constructor(props){
    super(props);
    this.state={
            priceNum:"0.0556",
            priceStatus:"fail",
            priceText:"Reserve Price Not Achieved"
    }
}
  render() {
    return (
      <dl className="reservePrice">
        <dd>SP Group Reserve Auction</dd>
        <dd><span>Reserve Pice = $ {this.state.priceNum} /KWh</span><span className={this.state.priceStatus}>{this.state.priceText}</span></dd>
      </dl>
    )
  }
}
