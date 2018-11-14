import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from '../../shared/show-modal';
import { retailerPproposeDeviations, retailerAcceptAll, getTenderdocuments } from '../../../javascripts/componentService/retailer/service';
import { formatPower } from '../../../javascripts/componentService/util';
export class Tenderdocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonType: '', aggregate: [], attachments: []
        }
    }
    componentDidMount() {
        getTenderdocuments(sessionStorage.arrangement_id).then(res => {
            //console.log(res);
            this.setState({
                aggregate: res.aggregate_consumptions,
                attachments: res.attachments
            })
            if (this.props.single === 5) {
                if (this.state.aggregate.total_lt_peak === '0.0' && this.state.aggregate.total_lt_off_peak === '0.0') {
                    $(".lt").hide();
                }
                if (this.state.aggregate.total_hts_peak === '0.0' && this.state.aggregate.total_hts_off_peak === '0.0') {
                    $(".hts").hide();
                }
                if (this.state.aggregate.total_htl_peak === '0.0' && this.state.aggregate.total_htl_off_peak === '0.0') {
                    $(".htl").hide();
                }
                if (this.state.aggregate.total_eht_peak === '0.0' && this.state.aggregate.total_eht_off_peak === '0.0') {
                    $(".eht").hide();
                }
            }
        })

    }
    showConfirm(type) {
        this.setState({ buttonType: type });
        if (type == "Propose_Deviations") {
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text: "Are you sure you want to propose deviations?"
            });
        } else {
            this.refs.Modal.showModal("comfirm");
            this.setState({
                // text: "Are you sure you want to participate in the auction? By clicking 'Yes', you confirm your participation in the auction and are bounded by the Retailer Platform Terms of Use. Please be reminded that you will not be allowed to withdraw your participation."
                text:"Are you sure you want to participate in the auction? <br><br>By clicking 'Yes', you confirm your participation in the auction and will not be allowed to withdraw your participation."
            });
        }
    }
    propose_deviations() {
        retailerPproposeDeviations(this.props.current.current.arrangement_id).then(res => {
            this.props.page();
        }, error => {

        })
    }
    accept_all() {
        retailerAcceptAll(this.props.current.current.arrangement_id).then(res => {
            this.props.page();
        }, error => {

        })
    }
    render() {
        return (
            <div className="col-sm-12 col-md-8 push-md-2 u-mt3 tender_documents">
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption<br /> (kWh/month):
                        </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.state.aggregate.map((item, index) => {
                            return <div className="col-sm-12" key={index}>
                                {this.props.single != 5 ? <h4 className={'u-mt1 u-mb1'}>{item.contract_duration} Months&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total number of buyers: {item.consumption_count}</h4> : ''}
                                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {item.has_lt?<th className="lt">LT</th>:<th style={{display:'none'}}></th>}
                                            {item.has_hts?<th className="hts">HTS</th>:<th style={{display:'none'}}></th>}
                                            {item.has_htl?<th className="htl">HTL</th>:<th style={{display:'none'}}></th>}
                                            {item.has_eht?<th className="eht">EHT</th>:<th style={{display:'none'}}></th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Peak (7am-7pm)</td>
                                            {item.has_lt?<td className="lt">{item.total_lt_peak ? formatPower(parseInt(Number(item.total_lt_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_hts?<td className="hts">{item.total_hts_peak ? formatPower(parseInt(Number(item.total_hts_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_htl?<td className="htl">{item.total_htl_peak ? formatPower(parseInt(Number(item.total_htl_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_eht?<td className="eht">{item.total_eht_peak ? formatPower(parseInt(Number(item.total_eht_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                        </tr>
                                        <tr>
                                            <td>Off-Peak (7pm-7am)</td>
                                            {item.has_lt?<td className="lt">{item.total_lt_off_peak ? formatPower(parseInt(Number(item.total_lt_off_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_hts?<td className="hts">{item.total_hts_off_peak ? formatPower(parseInt(Number(item.total_hts_off_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_htl?<td className="htl">{item.total_htl_off_peak ? formatPower(parseInt(Number(item.total_htl_off_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_eht?<td className="eht">{item.total_eht_off_peak ? formatPower(parseInt(Number(item.total_eht_off_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            {item.has_lt?<td className="lt">{item.total_lt_off_peak ? formatPower(parseInt(Number(item.total_lt_off_peak)+Number(item.total_lt_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_hts?<td className="hts">{item.total_hts_off_peak ? formatPower(parseInt(Number(item.total_hts_off_peak)+Number(item.total_hts_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_htl?<td className="htl">{item.total_htl_off_peak ? formatPower(parseInt(Number(item.total_htl_off_peak)+Number(item.total_htl_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_eht?<td className="eht">{item.total_eht_off_peak ? formatPower(parseInt(Number(item.total_eht_off_peak)+Number(item.total_eht_peak)), 0, '') : 0}</td>:<td style={{display:'none'}}></td>}
                                        </tr>
                                        <tr>
                                            <td>Total number of electricity accounts</td>
                                            {item.has_lt?<td className="lt">{item.lt_count}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_hts?<td className="hts">{item.hts_count}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_htl?<td className="htl">{item.htl_count}</td>:<td style={{display:'none'}}></td>}
                                            {item.has_eht?<td className="eht">{item.eht_count}</td>:<td style={{display:'none'}}></td>}
                                        </tr>
                                    </tbody>
                                </table>
                                {/*{this.props.single != 5 ? <a href={`/retailer/auctions/${this.props.auction.id}/consumption?type=2&contract_duration=${item.contract_duration}`} className="col-sm-4 lm--button lm--button--primary u-mt1 a_center">View Details</a> : ''}*/}
                            </div>
                        })}

                    </div>
                </div>
                {this.props.single==4?<div className="lm--formItem lm--formItem--inline string u-mt1">
                    <label className=" lm--formItem-label ">
                        Click on 'Accept & Proceed' if you do not wish to propose deviations to the <a target="_blank"  style={{"cursor": "pointer"}} disabled={this.props.propsdisabled} download={this.state.attachments.length>0?this.state.attachments[0].file_name:''} href={this.state.attachments.length>0?this.state.attachments[0].file_path:'#'}>Electricity Procurement Agreement.</a>
                    </label>
                </div>:''}
                {/*<div className="lm--formItem lm--formItem--inline string u-mt3 role_select">*/}
                    {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                        {/*Electricity Procurement Agreement:*/}
                    {/*</label>*/}
                    {/*<div className="lm--formItem-right lm--formItem-control">*/}
                        {/*<ul className="tender_list">*/}
                            {/*{this.state.attachments ? this.state.attachments.map((item, index) => {*/}
                                {/*return <li key={index}><a target="_blank" disabled={this.props.propsdisabled} download={item.file_name} href={item.file_path}>{item.file_name}</a></li>*/}
                            {/*}) : ''}*/}
                        {/*</ul>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="lm--formItem lm--formItem--inline string u-mt3 role_select">*/}
                    {/*<label className=" lm--formItem-label ">*/}
                        {/*{(this.props.single != 5 && this.props.single != 4) ? "You are bounded by the Electricity Procurement Agreement. Please click 'Proceed' to continue." : ""}*/}
                    {/*</label>*/}
                {/*</div>*/}
                {this.props.single === 5 ? (this.props.current.actions ?
                        <div className="workflow_btn u-mt3">
                            <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_propose_deviations)} onClick={this.showConfirm.bind(this, 'Propose_Deviations')} className="lm--button lm--button--primary">Propose Deviations</button>
                            <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_accept_all)} onClick={this.showConfirm.bind(this, 'Accept_All')} className="lm--button lm--button--primary">Accept All</button>
                        </div> : <div></div>) : (this.props.single === 4 ? <div className="workflow_btn u-mt3">
                            <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_propose_deviations)} onClick={this.showConfirm.bind(this, 'Propose_Deviations')} className="lm--button lm--button--primary">Propose Deviations</button>
                            <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_accept_all)} onClick={this.showConfirm.bind(this, 'Accept_All')} className="lm--button lm--button--primary">Accept & Proceed</button>
                        </div> : <div className="workflow_btn u-mt3">
                                <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_accept_all)} onClick={this.showConfirm.bind(this, 'Accept_All')} className="lm--button lm--button--primary">Proceed</button>
                            </div>)}
                    <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Propose_Deviations' ? this.propose_deviations.bind(this) : this.accept_all.bind(this)} ref="Modal" />
                </div>
                )
            }
        }
