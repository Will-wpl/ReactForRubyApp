import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
//import {DuringCountDown} from '../shared/during-countdown';
import {createRa,getAuctionInVersionOne,retailManageComing} from '../../javascripts/componentService/admin/service';
import {Modal} from '../shared/show-modal';

export class RetailerManage extends Component {
    constructor(props){
        super(props);
        this.state={
            id:"",
            text:"",
            type:""
        }
    }
    componentDidMount() {
        getAuctionInVersionOne().then(res => {
            //console.log(res);
            this.setState({id:res.id})
        }, error => {
            console.log(error);
        })
    }
    dosubmit(type,e){
        this.setState({
            type:type
        })
    }
    checkSuccess(event,obj){
        event.preventDefault();
        retailManageComing({
            arrangement: {
                "id": this.state.id,
                "main_name": this.refs.main_name.value,
                "main_email_address": this.refs.main_email_address.value,
                "main_mobile_number": this.refs.main_mobile_number.value,
                "main_office_number": this.refs.main_office_number.value,
                "alternative_name": this.refs.alternative_name.value,
                "alternative_email_address": this.refs.alternative_email_address.value,
                "alternative_mobile_number": this.refs.alternative_mobile_number.value,
                "alternative_office_number": this.refs.alternative_office_number.value,
                "lt_peak": this.refs.lt_peak.value,
                "lt_off_peak": this.refs.lt_off_peak.value,
                "hts_peak": this.refs.hts_peak.value,
                "hts_off_peak": this.refs.hts_off_peak.value,
                "htl_peak": this.refs.htl_peak.value,
                "htl_off_peak": this.refs.htl_off_peak.value,
                "accept_status": "2"
            }
        }).then(res => {
                this.refs.Modal.showModal();
                this.setState({
                    text:"Submit Success"
                });
                setTimeout(() => {
                    window.location.href="/retailer/home"
                },3000);
            }, error => {
                console.log(error);
            })
    }
    render () {
        return (
            <div>
            <TimeCuntDown />
            {/* <DuringCountDown /> */}
            <form onSubmit={this.checkSuccess.bind(this)}>
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    <h3 className="u-mt3 u-mb1">Section A:Information on Reverse Auction</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Specifications:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Briefing Pack:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div>
                    <h3 className="u-mt3 u-mb1">Section B:Contact Person Details for Actual Day of Reverse Auction</h3>
                    <h4 className="lm--formItem lm--formItem--inline string">Main Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_name" ref="main_name" maxLength="150" required aria-required="true" title="The length must not be longer than 150 characters and must not contain numbers"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_email_address" ref="main_email_address" maxLength="50" required aria-required="true" pattern="^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$" title="Email must have @."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_mobile_number" ref="main_mobile_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_office_number" ref="main_office_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <h4 className="lm--formItem lm--formItem--inline string">Alternative Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_name" ref="alternative_name" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_email_address" ref="alternative_email_address" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_mobile_number" ref="alternative_mobile_number" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_office_number" ref="alternative_office_number" maxLength="50"></input>
                        </div>
                    </div>
                    <h3 className="u-mt3 u-mb1"><abbr title="required">*</abbr>Section C:Starting Bid Price</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                            <thead>
                                <tr><th></th><th>LT</th><th>HT(Small)</th><th>HT(Large)</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Peak</td>
                                    <td>$ 0.<input type="tel" className="col" name="lt_peak" ref="lt_peak"  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="hts_peak" ref="hts_peak"  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="htl_peak" ref="htl_peak"  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Off-Peak</td>
                                    <td>$ 0.<input type="tel" name="lt_off_peak" ref="lt_off_peak" aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="hts_off_peak" ref="hts_off_peak"  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="htl_off_peak" ref="htl_off_peak"  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="retailer_btn">
                        {/* <button className="lm--button lm--button--primary">Reject Participation</button> */}
                        <button className="lm--button lm--button--primary" onClick={this.dosubmit.bind(this,"submit")}>Submit</button>
                    </div>
                </div>
            </div>
            </form>
            <Modal text={this.state.text} ref="Modal" />
            </div>
        )
    }
}






function runs() {
    const domNode = document.getElementById('retailerManage');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerManage),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}