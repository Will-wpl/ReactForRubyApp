import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from '../../shared/show-modal';
import { retailerPproposeDeviations, retailerAcceptAll, getTenderdocuments, getUndertaking } from '../../../javascripts/componentService/retailer/service';
import { formatPower } from '../../../javascripts/componentService/util';
export class Tenderdocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonType: '', aggregate: [], attachments: [], file: []
        }
    }
    componentDidMount() {
        getUndertaking(sessionStorage.arrangement_id).then(res => {
            console.log(res);
            this.setState({
                file: res
            })
        })
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
            //if(this.props.single!=4){
            if ($("#chkAgree_declare").is(':checked')) {

            } else {
                $(".check_error").fadeIn(300).text("Please check this box if you want to proceed");
                setTimeout(() => {
                    $(".check_error").fadeOut(100);
                }, 5000);
                return;
            }
            //}
            this.refs.Modal.showModal("comfirm");
            this.setState({
                // text: "Are you sure you want to participate in the auction? By clicking 'Yes', you confirm your participation in the auction and are bounded by the Retailer Platform Terms of Use. Please be reminded that you will not be allowed to withdraw your participation."
                text: "Are you sure you want to proceed? Please note that this step cannot be reversed."
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
                                            {item.has_lt ? <th className="lt">LT</th> : <th style={{ display: 'none' }}></th>}
                                            {item.has_hts ? <th className="hts">HTS</th> : <th style={{ display: 'none' }}></th>}
                                            {item.has_htl ? <th className="htl">HTL</th> : <th style={{ display: 'none' }}></th>}
                                            {item.has_eht ? <th className="eht">EHT</th> : <th style={{ display: 'none' }}></th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Peak (7am-7pm)</td>
                                            {item.has_lt ? <td className="lt">{item.total_lt_peak ? formatPower(parseInt(Number(item.total_lt_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_hts ? <td className="hts">{item.total_hts_peak ? formatPower(parseInt(Number(item.total_hts_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_htl ? <td className="htl">{item.total_htl_peak ? formatPower(parseInt(Number(item.total_htl_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_eht ? <td className="eht">{item.total_eht_peak ? formatPower(parseInt(Number(item.total_eht_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                        </tr>
                                        <tr>
                                            <td>Off-Peak (7pm-7am)</td>
                                            {item.has_lt ? <td className="lt">{item.total_lt_off_peak ? formatPower(parseInt(Number(item.total_lt_off_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_hts ? <td className="hts">{item.total_hts_off_peak ? formatPower(parseInt(Number(item.total_hts_off_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_htl ? <td className="htl">{item.total_htl_off_peak ? formatPower(parseInt(Number(item.total_htl_off_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_eht ? <td className="eht">{item.total_eht_off_peak ? formatPower(parseInt(Number(item.total_eht_off_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            {item.has_lt ? <td className="lt">{item.total_lt_off_peak ? formatPower(parseInt(Number(item.total_lt_off_peak) + Number(item.total_lt_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_hts ? <td className="hts">{item.total_hts_off_peak ? formatPower(parseInt(Number(item.total_hts_off_peak) + Number(item.total_hts_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_htl ? <td className="htl">{item.total_htl_off_peak ? formatPower(parseInt(Number(item.total_htl_off_peak) + Number(item.total_htl_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_eht ? <td className="eht">{item.total_eht_off_peak ? formatPower(parseInt(Number(item.total_eht_off_peak) + Number(item.total_eht_peak)), 0, '') : 0}</td> : <td style={{ display: 'none' }}></td>}
                                        </tr>
                                        <tr>
                                            <td><div style={{ "wordBreak": "keep-all" }}>Total number of electricity accounts</div></td>
                                            {item.has_lt ? <td className="lt">{item.lt_count}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_hts ? <td className="hts">{item.hts_count}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_htl ? <td className="htl">{item.htl_count}</td> : <td style={{ display: 'none' }}></td>}
                                            {item.has_eht ? <td className="eht">{item.eht_count}</td> : <td style={{ display: 'none' }}></td>}
                                        </tr>
                                    </tbody>
                                </table>
                                {/*{this.props.single != 5 ? <a href={`/retailer/auctions/${this.props.auction.id}/consumption?type=2&contract_duration=${item.contract_duration}`} className="col-sm-4 lm--button lm--button--primary u-mt1 a_center">View Details</a> : ''}*/}
                            </div>
                        })}

                    </div>
                </div>
                {this.props.single == 4 ?
                    <div>
                        <br></br>
                        <h4 className="lm--formItem lm--formItem--inline string u-mt1">
                            Option 1: Check the box below and click on 'Accept & Participate' if you do not wish to propose deviation(s) to the Electricity Purchase Contract.<br />
                        </h4>
                        {!this.props.propsdisabled ? <div className="lm--formItem--inline string">
                            <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                                <input name="agree_declare" type="checkbox" id="chkAgree_declare" disabled={this.props.propsdisabled} required />
                                <span>By clicking on the “Accept & Participate” button, we acknowledge and agree that per the <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_name : ""} href={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_path : "#"}>Terms & Conditions of Use (Retailer)</a>, if our bid met Closing Condition and Auto-Closing occurred after the Reverse Auction, our submitted bid will constitute as an acceptance to the Buyer’s Purchase Order and that an agreement for sale and purchase of electricity between us and the Buyer shall be formed accordingly based on the terms and conditions set out in <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_name : ""} href={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_path : "#"}>Electricity Purchase Contract</a> and be legally binding on us and the Buyer. </span>
                                <div className="check_error">Please fill in this field</div>
                            </h4>
                        </div> : <div className="lm--formItem--inline string">
                                <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                                    <input name="agree_declare" type="checkbox" id="chkAgree_declare" checked disabled={this.props.propsdisabled} required />
                                    <span>By clicking on the “Accept & Participate” button, we acknowledge and agree that per the <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_name : ""} href={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_path : "#"}>Terms & Conditions of Use (Retailer)</a>, if our bid met Closing Condition and Auto-Closing occurred after the Reverse Auction, our submitted bid will constitute as an acceptance to the Buyer’s Purchase Order and that an agreement for sale and purchase of electricity between us and the Buyer shall be formed accordingly based on the terms and conditions set out in <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_name : ""} href={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_path : "#"}>Electricity Purchase Contract</a> and be legally binding on us and the Buyer. </span>
                                    <div className="check_error">Please fill in this field</div>
                                </h4>
                            </div>}
                         
                        <h4>
                            Option 2: Click on 'Propose Deviations' if you wish to propose deviation(s) to the Electricity Purchase Contract.
                        </h4>
                    </div> : <div>
                        <div className="lm--formItem lm--formItem--inline string u-mt1">
                            <h4 className="lm--formItem lm--formItem--inline string chkBuyer" style={{ "width": "100%" }}>Please click ‘Participate’ to confirm your participation in this Reverse Auction.</h4>
                        </div>
                        {!this.props.propsdisabled ? <div className="lm--formItem--inline string">
                            <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                                <input name="agree_declare" type="checkbox" id="chkAgree_declare" disabled={this.props.propsdisabled} required />
                                <span>By clicking on the “Participate” button, we acknowledge and agree that per the <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_name : ""} href={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_path : "#"}>Terms & Conditions of Use (Retailer)</a>, if our bid met Closing Condition and Auto-Closing occurred after the Reverse Auction, our submitted bid will constitute as an acceptance to the Buyer’s Purchase Order and that an agreement for sale and purchase of electricity between us and the Buyer shall be formed accordingly based on the terms and conditions set out in <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_name : ""} href={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_path : "#"}>Electricity Purchase Contract</a> and be legally binding on us and the Buyer. </span>
                                <div className="check_error">Please fill in this field</div>
                            </h4>
                        </div> : <div className="lm--formItem--inline string">
                                <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                                    <input name="agree_declare" type="checkbox" id="chkAgree_declare" checked disabled={this.props.propsdisabled} required />
                                    <span>By clicking on the “Participate” button, we acknowledge and agree that per the <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_name : ""} href={this.state.file.length > 0 && this.state.file[0] ? this.state.file[0].file_path : "#"}>Terms & Conditions of Use (Retailer)</a>, if our bid met Closing Condition and Auto-Closing occurred after the Reverse Auction, our submitted bid will constitute as an acceptance to the Buyer’s Purchase Order and that an agreement for sale and purchase of electricity between us and the Buyer shall be formed accordingly based on the terms and conditions set out in <a className="download_ico cursor_link" target="_blank" download={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_name : ""} href={this.state.file.length > 0 && this.state.file[1] ? this.state.file[1].file_path : "#"}>Electricity Purchase Contract</a> and be legally binding on us and the Buyer. </span>
                                    <div className="check_error">Please fill in this field</div>
                                </h4>
                            </div>}</div>}
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
                        <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_accept_all)} onClick={this.showConfirm.bind(this, 'Accept_All')} className="lm--button lm--button--primary">Accept & Participate</button>
                    </div> : <div className="workflow_btn u-mt3">
                            <button disabled={this.props.propsdisabled ? true : (!this.props.current.actions.node2_retailer_accept_all)} onClick={this.showConfirm.bind(this, 'Accept_All')} className="lm--button lm--button--primary">Participate</button>
                        </div>)}
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Propose_Deviations' ? this.propose_deviations.bind(this) : this.accept_all.bind(this)} ref="Modal" />
            </div>
        )
    }
}
