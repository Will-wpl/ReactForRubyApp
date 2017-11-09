import React, {Component} from 'react';

export default class ReservePrice extends Component {
    render() {
        let compareResult = parseFloat(this.props.realtimePrice) > parseFloat(this.props.price)
        return (
            <dl className="reservePrice">
                <dd>SP Group Reserve Auction</dd>
                <dd>
                    <span>Reserve Price = $ {this.props.price} /KWh</span>
                    <span className={compareResult ? 'success' : 'fail'}>
                {compareResult ? 'Reserve Price Achieved' : 'Reserve Price Not Achieved'}
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
