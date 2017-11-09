import React, {Component} from 'react';

export default class RetailerRanking extends Component {
    render() {
        console.log('realtimeRanking', this.props.ranking);
        return (
            <div className="retailrank_main">
                <h3>Retailer Ranking</h3>
                <div className="retailrank_box">
                    <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Retailer</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.ranking.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.company_name}</td>
                                        <td>{parseFloat(item.average_price).toFixed(4)}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

RetailerRanking.defaultProps = {
    ranking: []
}
