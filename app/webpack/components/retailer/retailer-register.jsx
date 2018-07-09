import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import { getRetailerUserInfo, saveRetailManageInfo, submitRetailManageInfo } from '../../javascripts/componentService/retailer/service'
export class RetailerRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            btn_status: false,
            disabled: false,
            havedata: false,
            allbtnStatus: true,
            text: "",
            email_address: "",
            company_name: "",
            unique_entity_number: "",
            company_address: "",
            licence_number: "",
            gst_num: "",
            contact_name: "",
            mobile_number: "",
            office_number: "",
            files: [],
            fileData: {
                "RETAILER_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
            uploadUrl: '/api/retailer/user_attachments?file_type=',
            showAttachmentFlag: 1,
            buyerTCurl: "",
            buyerTCname: "",
            revvTCurl: "",
            revvTCname: ""
        }

    }
    componentWillMount() {

    }
    componentDidMount() {
        let fileObj;
        fileObj = this.state.fileData;
        getRetailerUserInfo().then(res => {
            console.log(res);
            if (res.user_base_info) {
                let item = res.user_base_info;
                this.setState({
                    id: item.id,
                    email_address: item.email ? item.email : '',
                    company_name: item.company_name ? item.company_name : '',
                    unique_entity_number: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                    company_address: item.company_address ? item.company_address : '',
                    licence_number: item.company_license_number ? item.company_license_number : '',
                    gst_num: item.gst_no ? item.gst_no : '',
                    contact_name: item.name ? item.name : '',
                    mobile_number: item.account_mobile_number ? item.account_mobile_number : '',
                    office_number: item.account_office_number ? item.account_office_number : '',
                })
            }
            if (res.self_attachment) {
                let attachment = res.self_attachment
                let obj = {
                    file_name: attachment.file_name,
                    file_path: attachment.file_path,
                    file_type: attachment.file_type
                }
                fileObj[attachment.file_type][0].files.push(obj);
                this.setState({
                    fileData: fileObj
                })
            }
            if (res.seller_buyer_tc_attachment) {
                let buyer = res.seller_buyer_tc_attachment;
                this.setState({
                    buyerTCurl: buyer.file_path,
                    buyerTCname: buyer.file_name
                })
            }
            if (res.seller_revv_tc_attachment) {
                let revv = res.seller_revv_tc_attachment;
                this.setState({
                    revvTCurl: revv.file_path,
                    revvTCname: revv.file_name
                })
            }

        })
    }
    checkValidation() {

    }
    submit() {
        submitRetailManageInfo({
            user: {
                'id': this.state.id,
                'email': this.state.email_address,
                'company_name': this.state.company_name,
                'company_unique_entity_number': this.state.unique_entity_number,
                'company_address': this.state.company_address,
                'company_license_number': this.state.license_number,
                'gst_no': this.state.gst_num,
                'name': this.state.contact_name,
                'account_mobile_number': this.state.mobile_number,
                'account_office_number': this.state.office_number
            }
        }).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: "Your details have been successfully saved. "
            });

        })
    }
    save() {
        saveRetailManageInfo({
            user: {
                'id': this.state.id,
                'email': this.state.email_address,
                'company_name': this.state.company_name,
                'company_unique_entity_number': this.state.unique_entity_number,
                'company_address': this.state.company_address,
                'company_license_number': this.state.license_number,
                'gst_no': this.state.gst_num,
                'name': this.state.contact_name,
                'account_mobile_number': this.state.mobile_number,
                'account_office_number': this.state.office_number
            }
        }).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: "Your details have been successfully submitted. "
            });
        })
    }
    Change(type, e) {
        let itemValue = e.target.value;
        switch (type) {
            case 'email_address':
                this.setState({ email_address: itemValue });
                break;
            case 'company_name':
                this.setState({ company_name: itemValue });
                break;
            case 'unique_entity_number':
                this.setState({ unique_entity_number: itemValue });
                break;
            case 'company_address':
                this.setState({ company_address: itemValue });
                break;
            case 'license_number':
                this.setState({ license_number: itemValue });
                break;
            case 'gst_num':
                this.setState({ gst_num: itemValue });
                break;
            case 'contact_name':
                this.setState({ contact_name: itemValue });
                break;
            case 'mobile_number':
                this.setState({ mobile_number: itemValue });
                break;
            case 'office_number':
                this.setState({ office_number: itemValue });
                break;

        }
    }
    showView() {
        this.refs.Modal_upload.showModal();
    }
    render() {
        let btn_html = <div>
            <button id="save_form" className="lm--button lm--button--primary" onClick={this.save.bind(this)}>Save</button>
            <button id="submit_form" className="lm--button lm--button--primary" onClick={this.submit.bind(this)} >Complete Sign Up</button>
        </div>;
        return (
            <div className="retailer_manage_coming">
                <div id="retailer_form" >
                    <div>
                        <div className="u-grid admin_invitation">
                            <div className="col-sm-12 col-md-6 push-md-3">
                                <h3 className="u-mt3 u-mb1">Retailer Register Page</h3>
                                {/* <h4 className="u-mt1 u-mb1">Account Info</h4> */}
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Email:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="email_address" value={this.state.email_address} onChange={this.Change.bind(this, 'email_address')} disabled={this.state.disabled} ref="email_address" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" placeholder="Email" />
                                    </div>
                                </div>
                                <h4 className="u-mt1 u-mb1">Company Info</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_name" value={this.state.company_name} onChange={this.Change.bind(this, 'company_name')} disabled={this.state.disabled} ref="company_name" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Unique Entity Number(UEN):
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="unique_entity_number" value={this.state.unique_entity_number} onChange={this.Change.bind(this, 'unique_entity_number')} disabled={this.state.disabled} ref="unique_entity_number" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Retailer Licence Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="billing_address" value={this.state.licence_number} onChange={this.Change.bind(this, 'licence_number')} disabled={this.state.disabled} ref="licence_number" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> GST No.:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="billing_address" value={this.state.gst_num} onChange={this.Change.bind(this, 'gst_num')} disabled={this.state.disabled} ref="gst_num" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Address
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_address" value={this.state.company_address} onChange={this.Change.bind(this, 'company_address')} disabled={this.state.disabled} ref="company_address" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                                    </div>
                                </div>

                                <h4 className="u-mt1 u-mb1">Contact Information</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this, 'contact_name')} disabled={this.state.disabled} ref="contact_name" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Mobile Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="mobile_number" value={this.state.mobile_number} onChange={this.Change.bind(this, 'mobile_number')} disabled={this.state.disabled} ref="mobile_number" maxLength="50" pattern="^(\d{8})$" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Office Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="office_number" value={this.state.office_number} onChange={this.Change.bind(this, 'office_number')} disabled={this.state.disabled} ref="office_number" maxLength="50" pattern="^(\d{8})$" required aria-required="true" ></input>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Upload Documents:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                        <UploadFile type="RETAILER_DOCUMENTS" required="required" showList="1" col_width="10" showWay="2" fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                        <div className="col-sm-12 col-md-2 u-cell">
                                            <button className="lm--button lm--button--primary" onClick={this.showView.bind(this)}  >?</button>
                                        </div>
                                    </div>

                                </div>

                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_buyer_tc"} /> I agree to Seller - Buyer T&C &nbsp;&nbsp;&nbsp; <a target="_blank" href={this.state.buyerTCurl}>{this.state.buyerTCname}</a></h4>
                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_revv_tc"} />  I agree to Seller - Revv T&C &nbsp;&nbsp;&nbsp;  <a target="_blank" href={this.state.revvTCurl}>{this.state.revvTCname}</a></h4>

                                <div className="retailer_btn">
                                    {btn_html}
                                </div>
                                <Modal listdetailtype="Retailer Documents Message" ref="Modal_upload" />
                                <Modal text={this.state.text} ref="Modal" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

RetailerRegister.propTypes = {
    onSubmitjest: () => { }
};

function runs() {
    const domNode = document.getElementById('retailer_register');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(RetailerRegister),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}