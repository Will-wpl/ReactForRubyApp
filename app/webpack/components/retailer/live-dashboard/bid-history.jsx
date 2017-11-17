import React, {Component} from 'react';

export default class BidHistory extends Component {

    render() {
        let trs;
        if (this.props.order !== 'desc') {
            trs = this.props.data.map((element, index) => {
                return <tr key={element.id}>
                    <td>{index + 1}</td>
                    <td>{element.bid_time}</td>
                    <td>$ {element.lt_peak}</td>
                    <td>$ {element.lt_off_peak}</td>
                    <td style={{display: 'none'}}>$ {element.hts_off_peak}</td>
                    <td style={{display: 'none'}}>$ {element.hts_peak}</td>
                    <td>$ {element.htl_peak}</td>
                    <td>$ {element.htl_off_peak}</td>
                </tr>
            })
        } else {
            let len = this.props.data.length;
            trs = [];
            for (let i = len - 1; i >= 0; i--) {
                let element = this.props.data[i];
                trs.push(<tr key={element.id}>
                    <td>{i + 1}</td>
                    <td>{element.bid_time}</td>
                    <td>$ {element.lt_peak}</td>
                    <td>$ {element.lt_off_peak}</td>
                    <td style={{display: 'none'}}>$ {element.hts_off_peak}</td>
                    <td style={{display: 'none'}}>$ {element.hts_peak}</td>
                    <td>$ {element.htl_peak}</td>
                    <td>$ {element.htl_off_peak}</td>
                </tr>)
            }
        }

        return (
            <form>
                <h3>My Bid History</h3>
                <div className="table-head">
                <table className="retailer_fill u-mt2">
                    <colgroup>  
                        <col style={{width: 50 +'px'}} />  
                        <col style={{width: 100 +'px'}} />
                        <col style={{width: 50 +'px'}} /> 
                        <col style={{width: 50 +'px'}} /> 
                        <col style={{width: 50 +'px', display: 'none'}} />
                        <col style={{width: 50 +'px', display: 'none'}} />
                        <col style={{width: 50 +'px'}} /> 
                        <col style={{width: 50 +'px'}} /> 
                    </colgroup>  
                    <thead>
                    <tr>
                        <th colSpan="6" className="table_title">Bid Price</th>
                    </tr>
                    <tr>
                        <th>S/N</th>
                        <th>Time</th>
                        <th>LT (Peak)</th>
                        <th>LT (Off-Peak)</th>
                        <th style={{display: 'none'}}>HTS (Off-Peak)</th>
                        <th style={{display: 'none'}}>HTS (Peak)</th>
                        <th>HTL (Peak)</th>
                        <th>HTL (Off-Peak)</th>
                    </tr>
                    </thead>
                </table>
                </div>
                <div className="table-body">
                <table className="retailer_fill">
                    <colgroup>  
                    <col style={{width: 50 +'px'}} />  
                    <col style={{width: 100 +'px'}} />
                    <col style={{width: 50 +'px'}} /> 
                    <col style={{width: 50 +'px'}} /> 
                    <col style={{width: 50 +'px', display: 'none'}} />
                    <col style={{width: 50 +'px', display: 'none'}} />
                    <col style={{width: 50 +'px'}} /> 
                    <col style={{width: 50 +'px'}} /> 
                    </colgroup>  
                    <tbody>
                    {trs}
                    </tbody>
                </table>
                </div>
            </form>
        );
    }
}

BidHistory.defaultProps = {
    order : 'asc'
}