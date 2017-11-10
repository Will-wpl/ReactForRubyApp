import React, {Component} from 'react';

export default class ReservePrice extends Component {
    render() {
        let matched = parseFloat(this.props.realtimePrice) < parseFloat(this.props.price);
        console.log(this.props.realtimePrice, this.props.price)
        return (
            <dl className="reservePrice">
                <dd>SP Group Reserve Auction</dd>
                <dd>
                    <span>Reserve Price = $ {this.props.price} /KWh</span>
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
