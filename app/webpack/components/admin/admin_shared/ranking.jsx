import React, {Component} from 'react';

export default class RetailerRanking extends Component {
    render() {
        console.log('ranking', this.props.ranking)
        return (
            <div className="retailrank_main">
                <h3>Retailer Ranking</h3>
                <div className="retailrank_box">
                    <div className="table-head">
                        <table className="retailer_fill">
                            <colgroup>
                                <col style={{width: 50 + 'px'}}/>
                                <col style={{width: 100 + 'px'}}/>
                                <col style={{width: 100 + 'px'}}/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Retailer</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-body">
                        <table className="retailer_fill">
                            <colgroup>
                                <col style={{width: 50 + 'px'}}/>
                                <col style={{width: 100 + 'px'}}/>
                                <col style={{width: 100 + 'px'}}/>
                            </colgroup>
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
            </div>
        )
    }
}

RetailerRanking.defaultProps = {
    ranking: []
}
