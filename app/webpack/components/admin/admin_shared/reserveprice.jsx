import React, {Component} from 'react';
import {getAuction} from '../../../javascripts/componentService/common/service';
export default class ReservePrice extends Component {
    componentDidMount() {
        getAuction().then(auction => {
            this.name = auction.name;
        }, error => {
        })
    }
    render() {
        let matched
        if(this.props.realtimePrice){
            matched = parseFloat(this.props.realtimePrice).toFixed(4) <= parseFloat(this.props.price);
        }else{
            matched = false
        } 
        // console.log(this.props.realtimePrice, this.props.price)
        return (
            <dl className="reservePrice">
                <dd>{this.name}</dd>
                <dd>
                    <span>Reserve Price = $ {this.props.price}/kWh</span>
                    <span className={matched ? 'success' : 'fail'}>
                {matched ? 'Reserve Price Achieved' : 'Reserve Price Not Achieved'}
                </span>
                </dd>
            </dl>
        )
    }
}

ReservePrice.defaultProps = {
    price: '0.0000',
    realtimePrice: '0.0000'
}
