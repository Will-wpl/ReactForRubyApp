import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import { getRetailerUserInfo, saveRetailManageInfo, submitRetailManageInfo, getRetailerUserInfoByUserId, validateIsExist } from '../../javascripts/componentService/retailer/service';
import { approveRetailerUser } from '../../javascripts/componentService/admin/service';
import { validateNum, validateEmail, validator_Object, setValidationFaild, setValidationPass, changeValidate } from '../../javascripts/componentService/util';
export class RetailerRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            userid: "",
            btn_status: false,
            disabled: this.props.disabled ? this.props.disabled : false,
            havedata: false,
            allbtnStatus: true,
            text: "",
            use_type: "",
            email_address: "",
            company_name: "",
            unique_entity_number: "",
            company_address: "",
            license_number: "",
            gst_no: "",
            contact_name: "",
            mobile_number: "",
            office_number: "",
            comment: "",
            validate: true,

            fileData: {
                "RETAILER_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
            uploadUrl: '/api/retailer/user_attachments?file_type=',
            showAttachmentFlag: 1,
            sellerTCurl: "",
            sellerTCname: "",
            agree_seller_buyer: "0",
            revvTCurl: "",
            revvTCname: "",
            agree_seller_revv: "0",
            messageAttachmentUrl: ""

        }
        this.validatorItem = {
            office_number: { cate: 'num' },
            mobile_number: { cate: 'num' },
            contact_name: { cate: 'required' },
            gst_no: { cate: 'required' },
            license_number: { cate: 'required' },
            company_address: { cate: 'required' },
            unique_entity_number: { cate: 'required' },
            company_name: { cate: 'required' },
            email_address: { cate: 'email' }
        }
        this.validatorComment = {
            comment: { cate: 'required' }
        }
    }
    componentWillMount() {
        let userid;
        if (window.location.href.indexOf("admin/users/") > -1) {
            userid = window.location.href.split("admin/users/")[1].split("/manage")[0];
        }
        if (userid) {
            this.setState({ userid: userid });
        }

        if (window.location.href.indexOf('retailer/home') > 0) {
            this.setState({ use_type: 'sign_up' });
        }
        else if (window.location.href.indexOf('users/edit') > 0) {
            this.setState({ use_type: 'manage_acount' });
        }
        else {
            this.setState({ use_type: 'admin_approve' });
            this.setState({ disabled: true });
        }
    }

    componentDidMount() {
        if (this.state.userid) {
            getRetailerUserInfoByUserId(this.state.userid).then(res => {
                this.setDefult(res);
            })
        }
        else {
            getRetailerUserInfo().then(res => {
                this.setDefult(res);
            })
        }

    }

    setDefult(param) {
        let fileObj;
        fileObj = this.state.fileData;
        if (param.user_base_info) {
            let item = param.user_base_info;
            this.setState({
                id: item.id,
                email_address: item.email ? item.email : '',
                company_name: item.company_name ? item.company_name : '',
                unique_entity_number: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                company_address: item.company_address ? item.company_address : '',
                license_number: item.company_license_number ? item.company_license_number : '',
                gst_no: item.gst_no ? item.gst_no : '',
                contact_name: item.name ? item.name : '',
                mobile_number: item.account_mobile_number ? item.account_mobile_number : '',
                office_number: item.account_office_number ? item.account_office_number : '',
                agree_seller_buyer: item.agree_seller_buyer ? item.agree_seller_buyer : '0',
                agree_seller_revv: item.agree_seller_revv ? item.agree_seller_revv : '0'
            })
            if (this.state.agree_seller_buyer === '1') {
                $('#chkBuyer').attr("checked", true);
            }
            else {
                $('#chkBuyer').attr("checked", false);
            }
            if (this.state.agree_seller_revv === '1') {
                $('#chkRevv').attr("checked", true);
            }
            else {
                $('#chkRevv').attr("checked", false);
            }

        }
        if (param.self_attachment) {
            let attachment = param.self_attachment
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
        if (param.seller_buyer_tc_attachment) {
            let seller = param.seller_buyer_tc_attachment;
            this.setState({
                sellerTCurl: seller.file_path,
                sellerTCname: seller.file_name
            })
        }
        if (param.seller_revv_tc_attachment) {
            let revv = param.seller_revv_tc_attachment;
            this.setState({
                revvTCurl: revv.file_path,
                revvTCname: revv.file_name
            })
        }
        if (param.letter_of_authorisation_attachment) {
            this.setState({
                messageAttachmentUrl: param.letter_of_authorisation_attachment.file_path
            })
        }
    }

    checkRejectAction() {
        let flag = true;
        let arr = validator_Object(this.state, this.validatorComment);
        if (arr) {
            arr.map((item, index) => {
                let column = item.column;
                let cate = item.cate;
                setValidationFaild(column, cate)
            })
        }
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                flag = false;
                return false;
            }
        })
        this.refs.Modal_Option.closeModal();
        return flag;
    }

    checkValidation() {
        let flag = true, hasDoc = true;
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        //validate form 
        let arr = validator_Object(this.state, this.validatorItem);
        if (arr) {
            arr.map((item, index) => {
                let column = item.column;
                let cate = item.cate;
                setValidationFaild(column, cate)
            })
        }

        if ($('#chkBuyer').is(':checked')) {
            setValidationPass('chkBuyer', 1);

        } else {
            setValidationFaild('chkBuyer', 1);
        }
        if ($('#chkRevv').is(':checked')) {
            setValidationPass('chkRevv', 1);
        } else {
            setValidationFaild('chkRevv', 1);
        }

        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                if (!($(this).attr("id").indexOf('repeat') > -1)) {
                    flag = false;
                    return false;
                }
            }
        })
        //validate upload form 
        if (this.state.fileData['RETAILER_DOCUMENTS'][0].files.length > 0) {
            hasDoc = true;
            this.setState({
                validate: true
            })
        }
        else {
            hasDoc = false;
            this.setState({
                validate: false
            })
        }
        return flag && hasDoc;
    }

    Change(type, e) {
        let itemValue = e.target.value;
        switch (type) {
            case 'email_address':
                this.setState({ email_address: itemValue });
                if (!validateEmail(itemValue)) {
                    setValidationFaild('email_address', 2)
                } else {
                    setValidationPass('email_address', 2)
                }
                break;
            case 'company_name':
                this.setState({ company_name: itemValue });
                changeValidate('company_name', itemValue);
                break;
            case 'unique_entity_number':
                this.setState({ unique_entity_number: itemValue });
                changeValidate('unique_entity_number', itemValue);
                break;
            case 'company_address':
                this.setState({ company_address: itemValue });
                changeValidate('company_address', itemValue);
                break;
            case 'license_number':
                this.setState({ license_number: itemValue });
                changeValidate('license_number', itemValue);
                break;
            case 'gst_no':
                this.setState({ gst_no: itemValue });
                changeValidate('gst_no', itemValue);
                break;
            case 'contact_name':
                this.setState({ contact_name: itemValue });
                changeValidate('contact_name', itemValue);
                break;
            case 'mobile_number':
                this.setState({ mobile_number: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('mobile_number', 2)
                } else {
                    setValidationPass('mobile_number', 2)
                }
                break;
            case 'office_number':
                this.setState({ office_number: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('office_number', 2)
                } else {
                    setValidationPass('office_number', 2)
                }
                break;
            case 'chkBuyer':
                if ($('#chkBuyer').is(':checked')) {
                    this.setState({ agree_seller_buyer: 1 });
                    setValidationPass('chkBuyer', 1)
                } else {
                    this.setState({ agree_seller_buyer: 0 });
                    setValidationFaild('chkBuyer', 1);
                }
                break;
            case 'chkRevv':
                if ($('#chkRevv').is(':checked')) {
                    this.setState({ agree_seller_revv: 1 });
                    setValidationPass('chkRevv', 1)
                } else {
                    setValidationFaild('chkRevv', 1);
                    this.setState({ agree_seller_revv: 0 });
                }
                break;

            case "comment":
                this.setState({ comment: itemValue });
                changeValidate('comment', itemValue);
                break;
        }
    }
    submit(type) {
        let param = {
            'id': this.state.id,
            'email': this.state.email_address,
            'company_name': this.state.company_name,
            'company_unique_entity_number': this.state.unique_entity_number,
            'company_address': this.state.company_address,
            'company_license_number': this.state.license_number,
            'gst_no': this.state.gst_no,
            'name': this.state.contact_name,
            'account_mobile_number': this.state.mobile_number,
            'account_office_number': this.state.office_number,
            'agree_seller_buyer': this.state.agree_seller_buyer,
            'agree_seller_revv': this.state.agree_seller_revv
        }
        if (this.checkValidation()) {
            validateIsExist({
                user: param
            }).then(res => {
                if (res.validate_result)//validate pass
                {
                    submitRetailManageInfo({
                        user: param
                    }).then(res => {
                        $('#license_number_repeat').removeClass('errormessage').addClass('isPassValidate');
                        if (type === "sign_up") {
                            window.location.href = `/buyer/home`;
                        }
                        else {
                            this.refs.Modal.showModal();
                            this.setState({
                                text: "Your details have been successfully submitted. "
                            });
                        }
                    })
                }
                else {
                    if (res.error_fields) {
                        for (let item of res.error_fields) {
                            if (item === 'company_license_number') {
                                $('#license_number_repeat').removeClass('isPassValidate').addClass('errormessage');
                                $("input[name='license_number']").focus();
                            }
                        }
                    }
                }
            })
        }
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
                'gst_no': this.state.gst_no,
                'name': this.state.contact_name,
                'account_mobile_number': this.state.mobile_number,
                'account_office_number': this.state.office_number,
                'agree_seller_buyer': this.state.agree_seller_buyer,
                'agree_seller_revv': this.state.agree_seller_revv

            }
        }).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: "Your details have been successfully saved . "
            });
        })
    }
    cancel() {
        window.location.href = `/users/edit`;
    }
    judgeAction(type) {
        if (type === 'reject') {
            if (this.checkRejectAction()) {
                this.setState({
                    text: 'Are you sure you want to reject the request?',
                }, () => {
                    this.refs.Modal_Option.showModal('comfirm', { action: 'reject' }, '');
                });
            }
        }
        else {
            this.setState({ text: "Are you sure you want to approve the request?" });
            this.refs.Modal_Option.showModal('comfirm', { action: 'approve' }, '');
        }
    }
    doAction(obj) {
        let param = {
            user_id: this.state.userid,
            comment: this.state.comment,
            approved: obj.action === 'reject' ? "" : 1
        };
        approveRetailerUser(param).then(res => {
            location.href = "/admin/users/retailers";
        })
    }

    showView() {
        this.refs.Modal_upload.showModal();
    }
    render() {
        let btn_html;
        if (this.state.use_type === 'admin_approve') {
            btn_html = <div>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'reject')}>Reject</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'approve')}>Approve</button>
            </div>;
        }
        else if (this.state.use_type === 'manage_acount') {
            btn_html = <div>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.cancel.bind(this)}>Cancel</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.submit.bind(this, "save")}>Save</button>
            </div>;
            $('#chkBuyer').attr('disabled', true);
            $('#chkRevv').attr('disabled', true);
        }
        else {
            btn_html = <div>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.save.bind(this)}>Save</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.submit.bind(this, "sign_up")}>Complete Sign Up</button>
            </div>;
        }
        return (
            <div className="retailer_manage_coming">
                <div id="retailer_form" >
                    <div>
                        <div className="u-grid admin_invitation">
                            <div className="col-sm-12 col-md-6 push-md-3 validate_message ">
                                {/* <h3 className="u-mt3 u-mb1">Retailer Register Page</h3> */}
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Email:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="email_address" value={this.state.email_address} onChange={this.Change.bind(this, 'email_address')} disabled={this.state.disabled} ref="email_address" placeholder="Email" required aria-required="true" title="Please fill out this field" />
                                        <div className='isPassValidate' id='email_address_message' >This field is required!</div>
                                        <div className='isPassValidate' id='email_address_format' >Incorrect mail format!</div>
                                    </div>
                                </div>
                                <h4 className="u-mt1 u-mb1">Company Info</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_name" value={this.state.company_name} onChange={this.Change.bind(this, 'company_name')} disabled={this.state.disabled} ref="company_name" required aria-required="true" title="Please fill out this field" ></input>
                                        <div className='isPassValidate' id='company_name_message' >This field is required!</div>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Unique Entity Number(UEN):
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="unique_entity_number" value={this.state.unique_entity_number} onChange={this.Change.bind(this, 'unique_entity_number')} disabled={this.state.disabled} ref="unique_entity_number" required aria-required="true" title="Please fill out this field" ></input>
                                        <div className='isPassValidate' id='unique_entity_number_message' >This field is required!</div>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Retailer License Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="license_number" value={this.state.license_number} onChange={this.Change.bind(this, 'license_number')} disabled={this.state.disabled} ref="license_number" required aria-required="true" title="Please fill out this field" ></input>
                                        <div className='isPassValidate' id='license_number_message' >This field is required!</div>
                                        <div className='isPassValidate' id='license_number_repeat' >Retailer license number has already been taken!</div>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> GST No.:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="gst_no" value={this.state.gst_no} onChange={this.Change.bind(this, 'gst_no')} disabled={this.state.disabled} ref="gst_no" required aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id='gst_no_message' >This field is required!</div>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Address
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_address" value={this.state.company_address} onChange={this.Change.bind(this, 'company_address')} disabled={this.state.disabled} ref="company_address" required aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id='company_address_message' >This field is required!</div>
                                    </div>
                                </div>

                                <h4 className="u-mt1 u-mb1">Contact Information</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this, 'contact_name')} disabled={this.state.disabled} ref="contact_name" required aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id='contact_name_message' >This field is required!</div>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Mobile Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="mobile_number" value={this.state.mobile_number} onChange={this.Change.bind(this, 'mobile_number')} disabled={this.state.disabled} placeholder="Number should contain 8 integers." title="Please fill out this field" ref="mobile_number" maxLength="8" required aria-required="true" ></input>
                                        <div className='isPassValidate' id='mobile_number_message' >This field is required!</div>
                                        <div className='isPassValidate' id='mobile_number_format' >Number should contain 8 integers!</div>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Office Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="office_number" value={this.state.office_number} onChange={this.Change.bind(this, 'office_number')} disabled={this.state.disabled} placeholder="Number should contain 8 integers." ref="office_number" maxLength="8" title="Please fill out this field" required aria-required="true" ></input>
                                        <div className='isPassValidate' id='office_number_message' >This field is required!</div>
                                        <div className='isPassValidate' id='office_number_format' >Number should contain 8 integers!</div>
                                    </div>
                                </div>

                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Upload Documents:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                        <UploadFile type="RETAILER_DOCUMENTS" required="required" validate={this.state.validate} showList="1" col_width="10" showWay="2" fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                        <div className="col-sm-12 col-md-2 u-cell">
                                            <button className="lm--button lm--button--primary" onClick={this.showView.bind(this)} disabled={this.state.disabled} >?</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.use_type === 'admin_approve' ? 'isDisplay' : 'isHide'}>
                                    <div className="lm--formItem lm--formItem--inline string optional"  >
                                        <label className="lm--formItem-left lm--formItem-label">
                                            Comment:
                                    </label>
                                        <div className="lm--formItem-right lm--formItem-control">
                                            <div className="lm--formItem text optional user_comment">
                                                <div className="lm--formItem-control">
                                                    <textarea name="comment" value={this.state.comment} onChange={this.Change.bind(this, 'comment')} ref="comment" aria-required="true"></textarea>
                                                    <div className='isPassValidate' id='comment_message' >This field is required!</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="lm--formItem lm--formItem--inline string"><input id="chkBuyer" type="checkbox" onChange={this.Change.bind(this, 'chkBuyer')} name={"seller_buyer_tc"} disabled={this.state.disabled} /> I agree to Seller - Buyer T&C &nbsp;&nbsp;&nbsp; <a target="_blank" href={this.state.sellerTCurl} className="urlStyle">{this.state.sellerTCname}</a></h4>
                                <div id="chkBuyer_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                                <h4 className="lm--formItem lm--formItem--inline string"><input id="chkRevv" type="checkbox" onChange={this.Change.bind(this, 'chkRevv')} name={"seller_revv_tc"} disabled={this.state.disabled} />  I agree to Seller - Revv T&C &nbsp;&nbsp;&nbsp;  <a target="_blank" href={this.state.revvTCurl} className="urlStyle">{this.state.revvTCname}</a></h4>
                                <div id="chkRevv_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                                <div className="retailer_btn">
                                    {btn_html}
                                </div>
                                <Modal listdetailtype="Documents Message" ref="Modal_upload" attatchment={this.state.messageAttachmentUrl} />
                                <Modal text={this.state.text} ref="Modal" />
                                <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
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