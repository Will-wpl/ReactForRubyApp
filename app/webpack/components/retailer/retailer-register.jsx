import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import { getRetailerUserInfo, retailManageInfo } from '../../javascripts/componentService/retailer/service'
export class RetailerRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            btn_status: false,
            disabled: false,
            havedata: false,
            allbtnStatus: true,

            email_address: "",
            company_name: "",
            unique_entity_number: "",
            company_address: "",
            billing_address: "",
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
            showAttachmentFlag: 1
        }
        this.auctionData = {};
    }
    componentWillMount() {

    }
    componentDidMount() {
        let fileObj;
        fileObj = this.state.fileData;
        getRetailerUserInfo().then(res => {
            console.log(res);
            if (res.retailer_base_info) {

                let item = res.retailer_base_info;
                this.setState({
                    id: item.id,
                    email_address: item.email ? item.email : '',
                    company_name: item.company_name ? item.company_name : '',
                    unique_entity_number: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                    company_address: item.company_address ? item.company_address : '',
                    billing_address: item.billing_address ? item.billing_address : '',
                    contact_name: item.name ? item.name : '',
                    mobile_number: item.account_mobile_number ? item.account_mobile_number : '',
                    office_number: item.account_office_number ? item.account_office_number : '',

                })
            }
        })
    }
    checkValidation() {

    }
    submit() {
        console.log(this.state)
    }
    save() {

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
            case 'billing_address':
                this.setState({ billing_address: itemValue });
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
        this.setState({ text: "This is upload Documents" });
        this.refs.Modal.showModal();
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
                                        <abbr title="required">*</abbr> Unique Entity Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="unique_entity_number" value={this.state.unique_entity_number} onChange={this.Change.bind(this, 'unique_entity_number')} disabled={this.state.disabled} ref="unique_entity_number" maxLength="50" required aria-required="true" ></input>
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
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Billing Address:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="billing_address" value={this.state.billing_address} onChange={this.Change.bind(this, 'billing_address')} disabled={this.state.disabled} ref="billing_address" maxLength="50" required aria-required="true" ></input>
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
                                        Upload Documents:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <UploadFile type="RETAILER_DOCUMENTS" required="required" showList="1" showWay="2" fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                    </div>
                                </div>

                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_buyer_tc"} /> I agree to Seller - Buyer T&C &nbsp;&nbsp;&nbsp; <a target="_blank" href="">adfasdfsafd</a></h4>
                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_revv_tc"} />  I agree to Seller - Revv T&C &nbsp;&nbsp;&nbsp;  <a target="_blank" href="">adfasdfsafd</a></h4>
                                 
                                <div className="retailer_btn">
                                    {btn_html}
                                </div>
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