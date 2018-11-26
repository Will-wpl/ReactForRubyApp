import React, { Component } from 'react';
import { Modal } from '../../shared/show-modal';
export default class RetailerRanking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }

    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="retailrank_main">
                    <h3>Retailer Ranking</h3>
                    <div className="retailrank_box">
                        <div className="table-head">
                            <table className="retailer_fill">
                                <colgroup>
                                    <col style={{ width: 50 + 'px' }} />
                                    <col style={{ width: 100 + 'px' }} />
                                    <col style={{ width: 100 + 'px' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Retailer</th>
                                        <th>Average Price<br />($/kWh)</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="table-body">
                            <table className="retailer_fill">
                                <colgroup>
                                    <col style={{ width: 50 + 'px' }} />
                                    <col style={{ width: 100 + 'px' }} />
                                    <col style={{ width: 100 + 'px' }} />
                                </colgroup>
                                <tbody>
                                    {
                                        this.props.ranking.map((item, index) => {

                                            return (
                                                <tr key={index} className={this.props.nobidder ? '' : (item.is_bidder ? 'isbidder' : '')}>
                                                    <td>{item.ranking}</td>
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
            </div>

        )
    }
}

RetailerRanking.defaultProps = {
    ranking: []
}
