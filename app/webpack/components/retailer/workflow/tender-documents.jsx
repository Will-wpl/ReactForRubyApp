import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {retailerPproposeDeviations,retailerAcceptAll,getTenderdocuments} from '../../../javascripts/componentService/retailer/service';
export class Tenderdocuments extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buttonType:'',aggregate:{},attachments:[]
        }
    }
    componentDidMount() {
        getTenderdocuments(sessionStorage.arrangement_id).then(res=>{
            console.log(res);
            this.setState({
                aggregate:res.aggregate_consumptions,
                attachments:res.attachments
            })
        })
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Propose_Deviations"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to propose deviations?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to accept all?"
            });
        }
    }
    propose_deviations(){
        retailerPproposeDeviations(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        },error=>{

        })
    }
    accept_all(){
        retailerAcceptAll(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        },error=>{

        })
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
                                                <td >{this.state.aggregate.total_lt_peak?parseInt(Number(this.state.aggregate.total_lt_peak)):0}</td>
                                                <td >{this.state.aggregate.total_hts_peak?parseInt(Number(this.state.aggregate.total_hts_peak)):0}</td>
                                                <td >{this.state.aggregate.total_htl_peak?parseInt(Number(this.state.aggregate.total_htl_peak)):0}</td>
                                                <td >{this.state.aggregate.total_eht_peak?parseInt(Number(this.state.aggregate.total_eht_peak)):0}</td>
                                            </tr>
                                            <tr>
                                                <td>Off-Peak (7pm-7am)</td>
                                                <td >{this.state.aggregate.total_lt_off_peak?parseInt(Number(this.state.aggregate.total_lt_off_peak)):0}</td>
                                                <td >{this.state.aggregate.total_hts_off_peak?parseInt(Number(this.state.aggregate.total_hts_off_peak)):0}</td>
                                                <td >{this.state.aggregate.total_htl_off_peak?parseInt(Number(this.state.aggregate.total_htl_off_peak)):0}</td>
                                                <td >{this.state.aggregate.total_eht_off_peak?parseInt(Number(this.state.aggregate.total_eht_off_peak)):0}</td>
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
                        {this.state.attachments ? this.state.attachments.map((item,index)=>{
                            return <li key={index}>item {index+1} : <a download={item.file_name} href={item.file_path}>{item.file_name}</a></li>
                        }) : ''}
                    </ul>
                </div>
            </div>
            {this.props.current.actions ?
                <div className="workflow_btn u-mt3">                
                        <button disabled={!this.props.current.actions.node2_retailer_propose_deviations} onClick={this.showConfirm.bind(this,'Propose_Deviations')} className="lm--button lm--button--primary">Propose Deviations</button>
                        <button disabled={!this.props.current.actions.node2_retailer_accept_all} onClick={this.showConfirm.bind(this,'Accept_All')} className="lm--button lm--button--primary">Accept All</button>
                </div>:<div></div>}
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Propose_Deviations'?this.propose_deviations.bind(this):this.accept_all.bind(this)} ref="Modal" />
            </div>
        )
    }
}
