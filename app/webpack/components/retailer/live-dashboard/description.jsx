import React, { Component } from 'react';
export default class Description extends Component {
    mouthsHtml(data,index){
        const html = <div key={index} className="col-sm-12">
            <h3 className={"u-mt1 u-mb1"}>Starting Price ({data.contract_duration} months)</h3>
            <div className="lm--formItem lm--formItem--inline string optional">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                    <tr>
                        <th></th>
                        {data.has_lt?<th>LT<br/>($/kWh)</th>:<th style={{display:"none"}}></th>}
                        {data.has_hts?<th>HTS<br/>($/kWh)</th>:<th style={{display:"none"}}></th>}
                        {data.has_htl?<th>HTL<br/>($/kWh)</th>:<th style={{display:"none"}}></th>}
                        {data.has_eht?<th>EHT<br/>($/kWh)</th>:<th style={{display:"none"}}></th>}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Peak<br/>(7am-7pm)</td>
                        {data.has_lt?<td>{parseFloat(data.starting_price_lt_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_hts?<td>{parseFloat(data.starting_price_hts_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_htl?<td>{parseFloat(data.starting_price_htl_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_eht?<td>{parseFloat(data.starting_price_eht_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                    </tr>
                    <tr>
                        <td>Off Peak<br/>(7am-7pm)</td>
                        {data.has_lt?<td>{parseFloat(data.starting_price_lt_off_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_hts?<td>{parseFloat(data.starting_price_hts_off_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_htl?<td>{parseFloat(data.starting_price_htl_off_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                        {data.has_eht?<td>{parseFloat(data.starting_price_eht_off_peak).toFixed(4)}</td>:<td style={{display:"none"}}></td>}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        return html;
    }
    render() {
        return (
            <div className="user_form u-grid">
                <div className="col-sm-6 col-md-6">
                    <div className="rankinglogo"></div>
                </div>
                <div className="col-sm-6 col-md-6">
                    <div className="u-grid user_info">
                        <div className="col-sm-5">
                            <div className="userlogo"></div>
                        </div>
                        <div className="col-sm-7">
                            <h2>{this.props.ranking}</h2>
                            <label>My Ranking</label>
                        </div>
                    </div>
                </div>
                <div className={'col-sm-12 col-md-12 u-mt2'}>
                    {this.props.constractArr.length>0?
                        this.props.constractArr.map((item,index)=>{
                            return this.mouthsHtml(item,index)
                        }):''
                    }</div>
            </div>
        );
    }
}