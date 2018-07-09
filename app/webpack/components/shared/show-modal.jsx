import React, { Component } from 'react';
//共通弹出框组件
export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalshowhide: "modal_hide",
            type: 'default',
            secondStatus: "live_hide",
            props_data: {},
            strtype: '',
            email_subject: '',
            email_body: ''
        }
    }
    showModal(type, data, str) {
        if (str) {
            this.setState({ strtype: str });
        }
        this.setState({
            modalshowhide: "modal_show",
            props_data: data ? data : {}
        })
        if (data) {
            if (data.subject && data.body) {
                this.setState({
                    email_subject: data.subject,
                    email_body: decodeURI(data.body)
                })
            }
        }
        if (type == "comfirm") {
            this.setState({
                type: "comfirm"
            })
        } else {
            this.setState({
                type: "default"
            })
        }
    }
    do_text(text) {
        let show_text = text.replace(/<br>/g, "<br/>");
        setTimeout(() => {
            $(".modal_detail_nr").html(show_text);
        }, 50)
    }
    Accept() {
        if (this.state.strtype === "email_template") {
            let data = this.state.props_data;
            data.subject = this.state.email_subject;
            data.body = encodeURI(this.state.email_body);
            this.setState({ props_data: data });
        }
        if (this.props.acceptFunction) {
            this.props.acceptFunction(this.state.props_data);
            this.closeModal();
        }
        if (this.props.dodelete) {
            this.props.dodelete();
        }
        this.setState({
            type: "default"
        })
    }
    removefile(type, index, id) {
        if (confirm("Are you sure you want to delete this file?")) {
            if (this.props.otherFunction) {
                this.props.otherFunction(type, index, id)
            }
        }

    }
    Change(type, e) {
        let obj = e.target.value;
        if (type == "email_subject") {
            this.setState({ email_subject: obj });
        } else {
            this.setState({ email_body: obj })
        }
    }
    closeModal() {

        this.setState({
            modalshowhide: "modal_hide"
        })
    }
    componentDidMount() {

    }
    render() {
        let showDetail = '', secondary = '', secondStatus = '';
        if (this.props.showdetail && !this.props.text) {
            this.secondaryData = [
                this.props.showdetail.alternative_name,
                this.props.showdetail.alternative_email_address,
                this.props.showdetail.alternative_mobile_number,
                this.props.showdetail.alternative_office_number
            ]
            let isChanged = this.secondaryData.some((element, index) => {
                return element !== '' || null;
            })
            if (isChanged) {
                secondStatus = "live_show"
            } else {
                secondStatus = "live_hide"
            }
            secondary = <ol className={"showdetail " + secondStatus}>
                <li>Alternative Contact</li>
                <li>Company Name : {this.props.showdetail.alternative_name}</li>
                <li>Email : {this.props.showdetail.alternative_email_address}</li>
                <li>Mobile Number : {this.props.showdetail.alternative_mobile_number}</li>
                <li>Office Number : {this.props.showdetail.alternative_office_number}</li>
            </ol>
            showDetail = <ul className="showdetail">
                <li>Main Contact</li>
                <li>Company Name : {this.props.showdetail.main_name}</li>
                <li>Email : {this.props.showdetail.main_email_address}</li>
                <li>Mobile Number : {this.props.showdetail.main_mobile_number}</li>
                <li>Office Number : {this.props.showdetail.main_office_number}</li>
                {secondary}
            </ul>
        } else {
            showDetail = '';
        }
        if (this.props.listdetail) {
            if (this.props.listdetailtype === "Select Retailers") {
                showDetail = <ul className="showdetail">
                    <li>View Account</li>
                    <li>Email : {this.props.listdetail.email}</li>
                    <li>Company Name : {this.props.listdetail.company_name}</li>
                    <li>Company Address : {this.props.listdetail.company_address}</li>
                    <li>Unique Entity Number (UEN) : {this.props.listdetail.company_unique_entity_number}</li>
                    <li>Retailer Licence Number : {this.props.listdetail.company_license_number}</li>
                    <li>GST No. : {this.props.listdetail.gst_no}</li>
                    <li>Contact Name : {this.props.listdetail.name}</li>
                    <li>Mobile Number : {this.props.listdetail.account_mobile_number}</li>
                    <li>Office Number : {this.props.listdetail.account_office_number}</li>
                </ul>
            } else if (this.props.listdetailtype === "Link History") {
                showDetail = <ul className="showdetail history_files">
                    {this.props.listdetail.map((item, index) => {
                        return <li key={index}><a className="overflow_text" target="_blank" download={item.file_name} href={item.file_path}>{item.file_name}</a><abbr><font>|</font>{item.file_time}</abbr><span className="remove_file" onClick={this.removefile.bind(this, this.state.strtype, index, item.fileid)}></span></li>
                    })}
                </ul>
            } else if (this.props.listdetailtype === "Email Template") {
                if (this.props.text === '') {
                    showDetail = <div>
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-left lm--formItem-label string required">
                                Subject:
                            </label>
                            <div className="lm--formItem-right lm--formItem-control">
                                <input type="text" name="email_subject" value={this.state.email_subject} onChange={this.Change.bind(this, 'email_subject')} disabled={this.state.disabled} ref="email_subject" maxLength="50" required aria-required="true" />
                            </div>
                        </div>
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-left lm--formItem-label string required">
                                Body:
                            </label>
                            <div className="lm--formItem-right lm--formItem-control">
                                <textarea name="email_body" value={this.state.email_body} onChange={this.Change.bind(this, 'email_body')} disabled={this.state.disabled} ref="email_body" required aria-required="true" />
                            </div>
                        </div>
                    </div>
                } else {
                    showDetail = <div></div>
                }
            } else if (this.props.listdetailtype === "Select Company Buyers") {
                showDetail = <ul className="showdetail">
                    <li>View Account</li>
                    <li>Email : {this.props.listdetail.email}</li>
                    <li>Company Name : {this.props.listdetail.company_name}</li>
                    <li>Company Address : {this.props.listdetail.company_address}</li>
                    <li>Billing Address : {this.props.listdetail.billing_address}</li>
                    <li>Unique Entity Number (UEN) : {this.props.listdetail.company_unique_entity_number}</li>
                    <li>Contact Name : {this.props.listdetail.name}</li>
                    <li>Mobile Number : {this.props.listdetail.account_mobile_number}</li>
                    <li>Office Number : {this.props.listdetail.account_office_number}</li>
                </ul>
            } else if (this.props.listdetailtype === "Alternative Winner") {
                if (this.props.listdetail.length != 0) {
                    showDetail =
                        <ul className="showdetail">
                            {((this.props.listdetail.lt_peak == 0.0) && (this.props.listdetail.lt_off_peak == 0.0)) ?
                                "" :
                                <div>
                                    <li>LT Peak: $ {parseFloat(this.props.listdetail.lt_peak).toFixed(4)}</li>
                                    <li>LT Off Peak: $ {parseFloat(this.props.listdetail.lt_off_peak).toFixed(4)}</li>
                                </div>

                            }
                            {((this.props.listdetail.hts_peak == 0.0) && (this.props.listdetail.hts_off_peak == 0.0)) ?
                                "" :
                                <div>
                                    <li>HT (small) Peak: $ {parseFloat(this.props.listdetail.hts_peak).toFixed(4)}</li>
                                    <li>HT (small) Off Peak: $ {parseFloat(this.props.listdetail.hts_off_peak).toFixed(4)}</li>
                                </div>
                            }
                            {((this.props.listdetail.htl_peak == 0.0) && (this.props.listdetail.htl_peak == 0.0)) ?
                                "" :
                                <div>
                                    <li>HT (large) Peak: $ {parseFloat(this.props.listdetail.htl_peak).toFixed(4)}</li>
                                    <li>HT (large) Off Peak: $ {parseFloat(this.props.listdetail.htl_peak).toFixed(4)}</li>
                                </div>
                            }
                            {((this.props.listdetail.eht_peak == 0.0) && (this.props.listdetail.eht_off_peak == 0.0)) ?
                                "" :
                                <div>
                                    <li>EHT Peak: $ {parseFloat(this.props.listdetail.eht_peak).toFixed(4)}</li>
                                    <li>EHT Off Peak: $ {parseFloat(this.props.listdetail.eht_off_peak).toFixed(4)}</li>
                                </div>
                            }

                        </ul>
                }
            }
            else {
                showDetail = <ul className="showdetail">
                    <li>View Account</li>
                    <li>Email : {this.props.listdetail.email}</li>
                    <li>Name : {this.props.listdetail.name}</li>
                    <li>NRIC/FIN : {this.props.listdetail.account_fin}</li>
                    <li>Housing Type : {this.props.listdetail.account_housing_type === '0' ? 'HDB' : (this.props.listdetail.account_housing_type === '1' ? 'Private High-rise' : 'Landed')}</li>
                    <li>Home Address : {this.props.listdetail.account_home_address}</li>
                    <li>Billing Address : {this.props.listdetail.billing_address}</li>
                    <li>Mobile Number : {this.props.listdetail.account_mobile_number}</li>
                    <li>Home Number : {this.props.listdetail.account_home_number}</li>
                    <li>Office Number : {this.props.listdetail.account_office_number}</li>
                </ul>
            }
        }
        else {
            if (this.props.listdetailtype === 'Retailer Documents Message') {
                showDetail = <ul className="showdetail">
                    <li>Please upload the following documentations:</li>
                    <li>1) A print-out of this <a href='#'>Letter of Authorisation</a>, together with the Applicant's signature and Company Stamp.</li>
                    <li>2a) Your company's Accounting & Corporate Regulatory Authority (ACRA) Business Profile.</li>
                    <li>or</li>
                    <li>2b) Your company's Certificate of Incorporation if you are not registered with Accounting & Corporate Regulatory Authority (ACRA).</li>
                    <li>3) Directors' Resolution authorising the Authorised Representative to transact for and on behalf of the Company in this platform.</li>
                    <li>4) A copy of the Applicant's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>5) A copy of the Authorised Representative's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>All supporting documents submitted should be in English only.</li>
                </ul>
            }
            if (this.props.listdetailtype === 'Buyer Documents Message') {
                showDetail = <ul className="showdetail">
                <li>Please upload the following documentations:</li>
                <li>1) A print-out of this <a href='#'> Letter of Authorisation</a>, together with the Applicant's signature and Company Stamp.</li>
                <li>2a) Your company's Accounting & Corporate Regulatory Authority (ACRA) Business Profile.</li>
                <li>or</li>
                <li>2b) Your company's Certificate of Incorporation if you are not registered with Accounting & Corporate Regulatory Authority (ACRA).</li>
                <li>3) Directors' Resolution authorising the Authorised Representative to transact for and on behalf of the Company in this platform.</li>
                <li>4) A copy of the Applicant's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                <li>5) A copy of the Authorised Representative's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                <li>All supporting documents submitted should be in English only.</li>
            </ul>
            }
        }
        let btn_html = '';
        if (this.state.type == "default") {
            btn_html = <div className="modal_btn"><a onClick={this.closeModal.bind(this)}>OK</a></div>;
        } else {
            btn_html = <div className="modal_btn"><a onClick={this.Accept.bind(this)}>Yes</a><a onClick={this.closeModal.bind(this)}>No</a></div>;
        }
        return (
            <div id="modal_main" className={this.state.modalshowhide}>
                <h4><a onClick={this.closeModal.bind(this)}>X</a></h4>
                <div className="modal_detail"><div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}</div>
                {btn_html}
            </div>
        )
    }
}