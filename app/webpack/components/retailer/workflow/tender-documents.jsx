import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Tenderdocuments extends React.Component{
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
            <div className="col-sm-12 col-md-8 push-md-2 u-mt3 tender_documents">
                <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12">
                                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>LT</th>
                                            <th>HT (Small)</th>
                                            <th>HT (Large)</th>
                                            <th>EHT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Peak (7am-7pm)</td>
                                                <td >{this.state.peak_lt}</td>
                                                <td >{this.state.peak_hts}</td>
                                                <td >{this.state.peak_htl}</td>
                                                <td >{this.state.peak_eht}</td>
                                            </tr>
                                            <tr>
                                                <td>Off-Peak (7pm-7am)</td>
                                                <td >{this.state.off_peak_lt}</td>
                                                <td >{this.state.off_peak_hts}</td>
                                                <td >{this.state.off_peak_htl}</td>
                                                <td >{this.state.off_peak_eht}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
            <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                <label className="lm--formItem-left lm--formItem-label string required">
                Please see attached tender documents:
                </label>
                <div className="lm--formItem-right lm--formItem-control">
                    <ul className="tender_list">
                        {this.props.linklist ? this.props.linklist.map((item,index)=>{
                            return <li key={index}>item {index+1} : <a href={item.file_path}>{item.file_name}</a></li>
                        }) : ''}
                    </ul>
                </div>
            </div>
            <div className="workflow_btn u-mt3">
                        <a className="lm--button lm--button--primary">Propose Deviations</a>
                        <a className="lm--button lm--button--primary">Accept All</a>
                </div>
            </div>
        )
    }
}
