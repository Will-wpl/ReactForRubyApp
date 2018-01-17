import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Proposedeviations extends React.Component{
    constructor(props){
        super(props);
        this.state={
            peak_lt:0,peak_hts:0,
            peak_htl:0,peak_eht:0,off_peak_lt:0,off_peak_hts:0,
            off_peak_htl:0,off_peak_eht:0,
        }
    }
    componentDidMount() {
        
    }
    render(){
        return(
            <div className="propose_deviations u-mt3">
                <h2 className="u-mt3 u-mb3">Propose Deviations</h2>
                <div className="col-sm-12 col-md-10 push-md-1">
                    <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Clause</th>
                                <th>Proposs Deviation</th>
                                <th>Retailer Response</th>
                                <th>SP Response</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!this.props.tender ? 
                                <tr>
                                    <td>
                                        <select>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </td>
                                    <td ><input type="text"/></td>
                                    <td ><input type="text"/></td>
                                    <td ><input type="text"/></td>
                                    <td >Accepted : this item should change to 10%</td>
                                    <td><a>History</a><a>Withdraw</a></td>
                                </tr>
                                :<tr>
                                    <td>1</td>
                                    <td >5.1</td>
                                    <td >xxxxxxxxxxx</td>
                                    <td >xxxxxxxxxxxxxxxxxxxx</td>
                                    <td >Accepted : this item should change to 10%</td>
                                    <td><a>History</a></td>
                                </tr>
                                }
                            </tbody>
                    </table>
                    {!this.props.tender ? <div className="workflow_btn u-mt3 u-mb3"><a>add</a></div> :''}
                    <div className="workflow_btn u-mt3">
                        {!this.props.tender ?
                        <div><a className="lm--button lm--button--primary">Withdraw All Deviations</a>
                        <a className="lm--button lm--button--primary">Save</a>
                        <a className="lm--button lm--button--primary">Submit Deviations</a></div> :
                        <a className="lm--button lm--button--primary">Next</a>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
