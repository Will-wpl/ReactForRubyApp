import React, {Component} from 'react';
export default class ReservePrice extends Component {
    render() {
        let matched,reservePrice=<div></div>;
        if(this.props.realtimePrice){
            matched = parseFloat(this.props.realtimePrice).toFixed(4) <= parseFloat(this.props.price);
        }else{
            matched = false
        } 
        // console.log(this.props.realtimePrice, this.props.price)
        if(this.props.auction){
            reservePrice = <dl className="reservePrice">
                                <dd id="reservePrice_name">{this.props.auction.name}</dd>
                                <dd>
                                    <span>Reserve Price = $ {this.props.price}/kWh</span>
                                    <span className={matched ? 'success' : 'fail'}>
                                {matched ? 'Reserve Price Achieved' : 'Reserve Price Not Achieved'}
                                </span>
                                </dd>
                            </dl>
        }
        return reservePrice;
    }
}

ReservePrice.defaultProps = {
    price: '0.0000',
    realtimePrice: '0.0000'
}
