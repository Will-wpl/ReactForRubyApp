import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import { getBuyerUserInfo, saveBuyerUserInfo, submitBuyerUserInfo, getBuyerUserInfoByUserId, validateIsExist } from '../../javascripts/componentService/common/service';
import { validate_delete_reject_user } from '../../javascripts/componentService/admin/service';
import { approveBuyerUser, approveBuyerEntity, removeBuyer } from '../../javascripts/componentService/admin/service';
import { removeNanNum, validateNum, validateEmail, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate, setApprovalStatus } from '../../javascripts/componentService/util';
import { textChangeRangeIsUnchanged } from 'typescript';
import moment from 'moment';



export class BuyerUserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "", userid: "", text: "", btn_status: false, disabled: true, havedata: false, allbtnStatus: true, validate: true, use_type: "",
            email_address: "", company_name: "", unique_entity_number: "", company_address: "", billing_address: "", contact_name: "",
            mobile_number: "", office_number: "", entityStatus: "", approveStatus: false, status: '', main_id: '',
            user_entity_id: "", user_company_name: "", user_company_uen: "", user_company_address: "", user_billing_address: "", user_bill_attention_to: "",
            user_contact_name: "", user_contact_email: "", user_contact_mobile_no: "", user_contact_office_no: "", comment: "",
            buyerTCurl: "", buyerTCname: "", agree_seller_buyer: "0", commmentError: false,
            buyerRevvTCurl: "", buyerRevvTCname: "", agree_buyer_revv: "0", has_tenants: "1", entity_list: [], entityItemInfo: this.entityItem,
            user_entity_data: {
                "ENTITY_LIST": [
                    { buttonName: "none", entities: [] }
                ]
            },
            fileData: {
                "BUYER_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
            uploadUrl: "/api/buyer/user_attachments?file_type=",
            messageAttachmentUrl: "",
            usedEntityIdArr: [],
            submitStatus: false,
            buyerApproveStatus: 3,
            ismain: false, entityIndex: 0, entityId: 0, buyerLogList: [], loglist: [], entityStatusChanged: false

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
            this.setState({
                userid: userid
            });
        }
    }

    componentDidMount() {
        if (this.state.userid) {
            getBuyerUserInfoByUserId(this.state.userid).then(res => {
                this.setDefaultValue(res);
                $("#btnBuyerBack").bind('click', () => {
                    if (this.state.buyerApproveStatus === "5") {
                        window.location.href = "/admin/users/del_buyers";
                    }
                    else {
                        window.location.href = "/admin/users/buyers";
                    }
                })
            })
        }
        $("#buyer_management").addClass("tenant_management");
    }

    setDefaultValue(param) {
        this.setBuyerInfo(param);
        this.setEntityInfo(param);
        this.setDefaultTab(param);
    }
    setBuyerInfo(param) {
        let fileObj, entityObj;
        fileObj = this.state.fileData;
        entityObj = this.state.user_entity_data;
        if (param.user_base_info) {
            let item = param.user_base_info;
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
                agree_seller_buyer: item.agree_seller_buyer ? item.agree_seller_buyer : '0',
                agree_buyer_revv: item.agree_buyer_revv ? item.agree_buyer_revv : '0',
                has_tenants: item.has_tenants ? item.has_tenants : '1',

                user_company_name: item.company_name ? item.company_name : '',
                user_company_uen: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                user_company_address: item.company_address ? item.company_address : '',
                buyerApproveStatus: item.approval_status,
                approveStatus: (item.approval_status === "3" || item.approval_status === "5") ? true : false,
                status: setApprovalStatus(item.approval_status, item.approval_status === "5" ? item.deleted_at : item.approval_date_time === null ? item.created_at : item.approval_date_time),
                submitStatus: item.approval_status !== "1" ? true : false
            })

            $('#buyer_management').val(this.state.has_tenants);
            if (this.state.agree_seller_buyer === "1") {
                $('#chkRevv').attr("checked", true);
            }
            else {
                $('#chkRevv').attr("checked", false);
            }
            if (this.state.agree_buyer_revv === "1") {
                $('#chkBuyer').attr("checked", true);
            }
            else {
                $('#chkBuyer').attr("checked", false);
            }
        }

        if (param.self_attachments) {
            let attachments = param.self_attachments
            let attachementsArr = [];
            attachments.map(item => {
                let obj = {
                    id: item.id,
                    file_name: item.file_name,
                    file_path: item.file_path,
                    file_type: item.file_type
                }
                attachementsArr.push(obj)
            })
            fileObj["BUYER_DOCUMENTS"][0].files = attachementsArr;
            this.setState({
                fileData: fileObj
            })
        }
        if (param.letter_of_authorisation_attachment) {
            this.setState({
                messageAttachmentUrl: param.letter_of_authorisation_attachment.file_path
            })
        }
        if (param.buyer_revv_tc_attachment) {
            let buyer = param.buyer_revv_tc_attachment;
            this.setState({
                buyerTCurl: buyer.file_path,
                buyerTCname: buyer.file_name
            })
        }

        if (param.seller_buyer_tc_attachment) {
            let revv = param.seller_buyer_tc_attachment;
            this.setState({
                buyerRevvTCurl: revv.file_path,
                buyerRevvTCname: revv.file_name
            })
        }

        if (param.user_logs) {
            let list = param.user_logs;
            list.map((item) => {
                item.company_uen = item.company_unique_entity_number;
                // item.updated_at = moment(item.updated_at).format('YYYY-MM-DD');
            })
            this.setState({
                loglist: list,
                buyerLogList: list
            })
        }

    }
    setEntityInfo(param) {

        if (param.buyer_entities.length > 0) {
            let user_entity = param.buyer_entities;
            user_entity.map((item) => {
                item.approval_status_name = this.convertEntityStatus(item.approval_status);
                item.isApproved = item.approval_status === "1" ? true : false;
            })
            this.setState({
                entity_list: user_entity
            })
        }
        else {
            let item = [{
                id: "",
                user_id: this.state.id,
                main_id: "",
                user_entity_id: "",
                company_name: this.state.company_name,
                company_uen: this.state.unique_entity_number,
                company_address: this.state.company_address,
                billing_address: "",
                bill_attention_to: "",
                contact_name: "",
                contact_email: this.state.email_address,
                contact_mobile_no: "",
                contact_office_no: "",
                is_default: 1,
                approval_status: 2,
                approval_status_name: "Pending"
            }]

            this.setState({
                entity_list: item
            });
        }

    }

    setDefaultTab(param) {
        let buyer = 0, entity = 0;
        if (param.user_base_info) {
            let item = param.user_base_info;
            if (item.approval_status === "2" || item.approval_status === "3" || item.approval_status === "5") { //judge buyer approve_status
                buyer = 0;
            }
            else {
                buyer = 1;
            }
        }
        if (param.buyer_entities) {  //judge entity approve_status,if have any one is pending ,should display entity page
            let entityList = param.buyer_entities;
            entityList.map(item => {
                if (item.approval_status === "3" || item.approval_status === "2") {
                    entity++;
                }
            })
        }

        if (buyer === 0) {
            this.tab("base");
        }
        else {
            if (entity > 0) {
                this.tab("entity");
            }
            else {
                this.tab("base");
            }
        }
    }

    checkRejectAction() { //when admin reject the request 
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
                return flag;
            }
        })
        this.refs.Modal_Option.closeModal();
        return flag;
    }
    judgeUserAction(type) {

        if (type === 'reject') {
            if (this.checkRejectAction()) {
                // this.setState({
                //     text: 'Are you sure you want to reject the request?',
                // }, () => {
                //     this.refs.Modal_Option.showModal('comfirm', { action: 'reject', type: 'user' }, '');
                // });
                let param = {
                    user_id: this.state.userid
                }
                validate_delete_reject_user(param).then(res => {
                    switch (res.validate_result) {
                        case 0:
                            this.setState({
                                text: 'Are you sure you want to reject the '+this.state.company_name+'?',
                            }, () => {
                                this.refs.Modal_Option.showModal('comfirm', { action: 'reject', type: 'user' }, '');
                            });
                            break;
                        case 1:
                            this.setState({
                                text: ""+this.state.company_name+" cannot be rejected due to on-going auction(s).",
                            }, () => {
                                this.refs.Modal_Option.showModal();
                            });
                            break;
                        case 2:
                            this.setState({
                                text: ""+this.state.company_name+" cannot be rejected due to on-going auction(s).",
                            }, () => {
                                this.refs.Modal_Option.showModal();
                            });
                            break;
                        case 3:
                            this.setState({
                                text: ""+this.state.company_name+" has pending auction invitation, would you proceed anyway? Once proceeded, pending invitation will be cancelled as well. ",
                            }, () => {
                                this.refs.Modal_Option.showModal('comfirm', { action: 'reject', type: 'user' }, '');
                            });
                            break;
                    }
                })

            }
        }
        else {
            this.setState({ text: "Are you sure you want to approve the request?" });
            this.refs.Modal_Option.showModal('comfirm', { action: 'approve', type: 'user' }, '');
        }
    }

    submitEntity() {
        this.setState({
            text: 'Are you sure you want to submit the entity status?',
        }, () => {
            this.refs.Modal_Option.showModal('comfirm', { action: 'submit', type: 'entity' }, '');
        });
    }
    deleteUser() {
        let param = {
            user_id: this.state.userid
        }
        validate_delete_reject_user(param).then(res => {
            switch (res.validate_result) {
                case 0:
                    this.setState({
                        text: 'Are you sure you want to delete the '+this.state.company_name+'?',
                    }, () => {
                        this.refs.Modal_Option.showModal('comfirm', { action: 'delete', type: 'deleteBuyer' }, '');
                    });
                    break;
                case 1:
                    this.setState({
                        text: ""+this.state.company_name+" cannot be deleted due to on-going auction(s).",
                    }, () => {
                        this.refs.Modal_Option.showModal();
                    });
                    break;
                case 2:
                    this.setState({
                        text: ""+this.state.company_name+" cannot be deleted due to on-going auction(s).",
                    }, () => {
                        this.refs.Modal_Option.showModal();
                    });
                    break;
                case 3:
                    this.setState({
                        text: ""+this.state.company_name+" has pending auction invitation, would you proceed anyway? Once proceeded, pending invitation will be cancelled as well. ",
                    }, () => {
                        this.refs.Modal_Option.showModal('comfirm', { action: 'delete', type: 'deleteBuyer' });
                    });
                    break;
            }
        })

    }

    doAction(obj) {
        if (obj.type === 'user') {
            let param = {
                user_id: this.state.userid,
                comment: this.state.comment,
                approved: obj.action === 'reject' ? "" : 1
            };

            if (this.state.buyerApproveStatus === "0") {
                this.state.entity_list.map((item) => {
                    item.approval_status = "2";
                    item.approval_status_name = "Pending";
                })
            }
            approveBuyerUser(param).then(res => {
                if (obj.action !== 'reject') { //buyer approve
                    this.setState({
                        submitStatus: false
                    })
                    window.location.href = '/admin/users/' + this.state.userid + '/manage';
                    // this.tab("entity");
                }
                else { //buyer reject
                    this.setState({
                        submitStatus: true
                    })
                    location.href = "/admin/users/buyers";
                }
            })

        }
        else if (obj.type === 'deleteBuyer') {
            let param = {
                user_id: this.state.userid
            }
            removeBuyer(param).then(res => {
                location.href = "/admin/users/del_buyers";
            })
        }
        else { //entity submit
            let paramArr = [];
            this.state.entity_list.map((item) => {
                let entityId = item.id;
                let approveStatus = item.approval_status === "1" ? "1" : item.approval_status === "0" ? 0 : null;

                let entity = {
                    entity_id: entityId,
                    approved_status: approveStatus
                }
                paramArr.push(entity)
            })
            let param = {
                entity_statuses: JSON.stringify(paramArr)
            };
            approveBuyerEntity(param).then(res => {
                window.location.href = '/admin/users/' + this.state.userid + '/manage';
            })
        }
    }

    entity_approve(item, index) {

        let list = this.state.entity_list;
        list[index].approval_status = "1";
        list[index].isApproved = true;
        this.setState({
            entity_list: list,
            entityStatusChanged: true
        })
    }
    entity_reject(item, index) {

        let list = this.state.entity_list;
        list[index].approval_status = "0";
 
        list[index].isApproved = false;
        this.setState({
            entity_list: list,
            entityStatusChanged: true
        })

    }

    view_log() {
        this.setState({
            text: "",
            loglist: this.state.buyerLogList
        })

        this.refs.Modal_Log.showModal();
    }
    view_entity_log(item) {
        let log = item.entity_logs;
        this.setState({
            loglist: log
        })
        this.setState({
            text: ""
        })
        this.refs.Modal_Log.showModal();
    }
    tab(type) {
        $(".buyer_tab a").removeClass("selected");
        $("#tab_" + type).addClass("selected");
        $(".buyer_list1").hide();
        $("#buyer_" + type).fadeIn(500);
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
            case 'user_company_name':
                this.setState({ user_company_name: itemValue });
                break;
            case 'user_company_uen':
                this.setState({ user_company_uen: itemValue });
                break;
            case 'user_company_address':
                this.setState({ user_company_address: itemValue });
                break;
            case 'user_billing_address':
                this.setState({ user_billing_address: itemValue });
                break;
            case 'user_bill_attention_to':
                this.setState({ user_bill_attention_to: itemValue });
                break;
            case 'user_contact_name':
                this.setState({ user_contact_name: itemValue });
                break;
            case 'user_contact_email':
                this.setState({ user_contact_email: itemValue });
                break;
            case 'user_contact_mobile_no':
                this.setState({ user_contact_mobile_no: itemValue });
                break;
            case 'user_contact_office_no':
                this.setState({ user_contact_office_no: itemValue });
                break;

            case 'buyer_management':
                let val = $('#buyer_management').val();
                this.setState({ has_tenants: val });
                break;
            case 'chkBuyer':
                if ($('#chkBuyer').is(':checked')) {
                    this.setState({ agree_seller_buyer: 1 });
                } else {
                    this.setState({ agree_seller_buyer: 0 });
                }
                break;
            case 'chkRevv':
                if ($('#chkRevv').is(':checked')) {
                    this.setState({ agree_buyer_revv: 1 });
                } else {
                    this.setState({ agree_buyer_revv: 0 });
                }
                break;
            case 'comment':
                this.setState({ comment: itemValue });
                changeValidate('comment', itemValue);
                break;
        }
    }


    convertEntityStatus(value) {
        if (value) {
            if (value === "0") {
                return "Rejected";
            }
            else if (value === "1") {
                return "Approved";
            }
            else if (value === "3") {
                return "Registering";
            }
            else if(value==="5")
            {
                return "Deleted";
            }
            else {
                return "Pending"
            }
        }
        else {
            return "Pending"
        }
    }
    render() {
        let btn_html;
        btn_html = <div>
            <button id="save_form" className="lm--button lm--button--primary" onClick={this.view_log.bind(this)} disabled={this.state.buyerApproveStatus === "3" ? true : false}>View Log</button>
            <button id="save_form" className="lm--button lm--button--primary" onClick={this.deleteUser.bind(this)} disabled={this.state.approveStatus}>Delete</button>
            <button id="save_form" className="lm--button lm--button--primary" onClick={this.judgeUserAction.bind(this, 'reject')} disabled={this.state.approveStatus}>Reject</button>
            <button id="submit_form" className="lm--button lm--button--primary" onClick={this.judgeUserAction.bind(this, 'approve')} disabled={this.state.approveStatus}>Approve</button>
        </div>;
        return (
            <div className="u-grid mg0 div-center" >
                <h2 className="u-mt3 u-mb3"></h2>
                <div className="buyer_buyer_list col-sm-12 col-md-12">
                    <div className="col-sm-12 buyer_tab">
                        <a className="col-sm-4 col-md-2 selected" onClick={this.tab.bind(this, 'base')} id="tab_base">Buyer Information</a>
                        <a className="col-sm-4 col-md-2" onClick={this.tab.bind(this, 'entity')} id="tab_entity">Purchasing Entity</a>
                    </div>
                    <div className="col-sm-12 buyer_list1" id="buyer_base" >
                        <div className="retailer_manage_coming">
                            <div id="buyer_form" >
                                <div>
                                    <div className="u-grid admin_invitation">
                                        <div className="col-sm-12 col-md-8 push-md-2 validate_message">
                                            <div className="lm--formItem lm--formItem--inline string" style={{ marginTop: "15px" }}>
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    Status :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control lm--formItem-label">
                                                    {this.state.status}
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Email :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="email_address" value={this.state.email_address} onChange={this.Change.bind(this, 'email_address')} readOnly={this.state.disabled} ref="email_address" required aria-required="true" title="Please fill out this field" placeholder="Email" />
                                                    <div className='isPassValidate' id='email_address_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='email_address_format' >Incorrect mail format!</div>
                                                    <div className='isPassValidate' id='email_address_repeat' >Email has already been taken!</div>
                                                </div>
                                            </div>
                                            <h4 className="u-mt1 u-mb1">Company Info</h4>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Company Name :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="company_name" value={this.state.company_name} onChange={this.Change.bind(this, 'company_name')} readOnly={this.state.disabled} ref="company_name" required aria-required="true" title="Please fill out this field" ></input>
                                                    <div className='isPassValidate' id='company_name_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='company_name_repeat' >Company name has already been taken!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Unique Entity Number :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="unique_entity_number" value={this.state.unique_entity_number} onChange={this.Change.bind(this, 'unique_entity_number')} readOnly={this.state.disabled} ref="unique_entity_number" required aria-required="true" title="Please fill out this field"></input>
                                                    <div className='isPassValidate' id='unique_entity_number_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='unique_entity_number_repeat' >Unique entity number has already been taken!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Company Address :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="company_address" value={this.state.company_address} onChange={this.Change.bind(this, 'company_address')} readOnly={this.state.disabled} ref="company_address" required aria-required="true" title="Please fill out this field"></input>
                                                    <div className='isPassValidate' id='company_address_message' >This field is required!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Billing Address :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="billing_address" value={this.state.billing_address} onChange={this.Change.bind(this, 'billing_address')} readOnly={this.state.disabled} ref="billing_address" required aria-required="true" title="Please fill out this field"></input>
                                                    <div className='isPassValidate' id='billing_address_message' >This field is required!</div>
                                                </div>
                                            </div>
                                            <h4 className="u-mt1 u-mb1">Contact Information</h4>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Contact Name :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this, 'contact_name')} readOnly={this.state.disabled} ref="contact_name" required aria-required="true" title="Please fill out this field"></input>
                                                    <div className='isPassValidate' id='contact_name_message' >This field is required!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Mobile Number :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="mobile_number" value={this.state.mobile_number} onChange={this.Change.bind(this, 'mobile_number')} readOnly={this.state.disabled} ref="mobile_number" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field" required aria-required="true" ></input>
                                                    <div className='isPassValidate' id='mobile_number_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='mobile_number_format' >Number should contain 8 integers!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Office Number :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="office_number" value={this.state.office_number} onChange={this.Change.bind(this, 'office_number')} readOnly={this.state.disabled} ref="office_number" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field" required aria-required="true" ></input>
                                                    <div className='isPassValidate' id='office_number_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='office_number_format' >Number should contain 8 integers!</div>
                                                </div>
                                            </div>
                                            <h4 className="lm--formItem lm--formItem--inline string">Business Documentations</h4>
                                            <div className="lm--formItem lm--formItem--inline string ">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Upload Supporting Documents :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                    <UploadFile type="BUYER_DOCUMENTS" required="required" validate="true" deleteType="buyer" showList="1" col_width="10" showWay="1" fileData={this.state.fileData.BUYER_DOCUMENTS} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                                    <div className="col-sm-1 col-md-1 u-cell">
                                                        <button className={this.state.disabled ? "lm--button lm--button--primary buttonDisabled" : "lm--button lm--button--primary"} disabled={this.state.disabled} >?</button>
                                                    </div>
                                                    <div id="showMessage" className="isPassValidate">This field is required!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string"  style={{"display":"none"}}>
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Tenant Management Service Required :
                                                 </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <select name="buyer_management" id="buyer_management" onChange={this.Change.bind(this, 'buyer_management')} defaultValue={this.state.buyer_management} disabled={this.state.disabled} ref="buyer_management" aria-required="true">
                                                        <option value="1">Yes</option>
                                                        <option value="0">No</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-sm-12 col-md-10 push-md-3  margin-t" >
                                                <h4 className="lm--formItem lm--formItem--inline string chk">
                                                    <input type="checkbox" id="chkBuyer" onChange={this.Change.bind(this, 'chkBuyer')} name={"seller_buyer_tc"} disabled={this.state.disabled} />
                                                    <span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerTCurl} className="urlStyleUnderline">Buyer Platform Terms of Use</a></span>
                                                </h4>
                                                <div id="chkBuyer_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                                                <h4 className="lm--formItem lm--formItem--inline string chk">
                                                    <input type="checkbox" id="chkRevv" name={"seller_revv_tc"} onChange={this.Change.bind(this, 'chkRevv')} disabled={this.state.disabled} />
                                                    <span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerRevvTCurl} className="urlStyleUnderline">Electricity Procurement Agreement</a></span>
                                                </h4>
                                                <div id="chkRevv_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                                            </div>
                                            <div className="dividerline"></div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    Admin Comments :
                                                    </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <textarea name="comment" value={this.state.comment} onChange={this.Change.bind(this, 'comment')} ref="comment" aria-required="true"></textarea>
                                                    {/* <div id="commmentError" className={this.state.commmentError ? "isDispaly" : "isHide"} >
                                                      
                                                    </div> */}
                                                    <div id="comment_message" className="isPassValidate">This field is required!</div>
                                                </div>
                                            </div>

                                            <div className="retailer_btn btnFont" >
                                                {btn_html}
                                            </div>
                                            <div className="spaceDiv">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 buyer_list1 " id="buyer_entity">
                        <div className="table-head">
                            <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                                <colgroup>
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Purchase Entity/Company Name</th>
                                        <th>Company UEN</th>
                                        <th>Company Address</th>
                                        <th>Billing Address</th>
                                        <th>Bill Attention To</th>
                                        <th>Contact Name</th>
                                        <th>Contact Email</th>
                                        <th>Contact Mobile No.</th>
                                        <th>Contact Office No.</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="table-body">
                            <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                                <colgroup>
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <tbody>
                                    {
                                        this.state.entity_list.map((item, index) => {
                                            return <tr key={index}>
                                                <td>{item.company_name}</td>
                                                <td>{item.company_uen}</td>
                                                <td>{item.company_address}</td>
                                                <td>{item.billing_address}</td>
                                                <td>{item.bill_attention_to}</td>
                                                <td>{item.contact_name}</td>
                                                <td>{item.contact_email}</td>
                                                <td>{item.contact_mobile_no}</td>
                                                <td>{item.contact_office_no}</td>
                                                <td>{item.isApproved}{item.approval_status_name}</td>
                                                <td>{this.state.submitStatus ? true : (item.isApproved ? true : false)}
                                                    <button className="entityApprove" disabled={this.state.submitStatus ? true : ((item.approval_status === "2" || item.approval_status === null) ? false : (item.isApproved ? true : false))} onClick={this.entity_approve.bind(this, item, index)}>Approve</button>
                                                    <button className="entityApprove" disabled={this.state.submitStatus ? true : ((item.approval_status === "2" || item.approval_status === null) ? false : (!item.isApproved ? true : false))} onClick={this.entity_reject.bind(this, item, index)}>Reject</button>
                                                    <button className="entityApprove" disabled={item.approval_status === "3" ? true : false} onClick={this.view_entity_log.bind(this, item)}>View Log</button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="retailer_btn">

                            <button id="save_form" className="lm--button lm--button--primary" style={{ marginRight: "10px" }} onClick={this.submitEntity.bind(this)} disabled={this.state.submitStatus ? true : (this.state.entityStatusChanged ? false : true)}>Submit</button>
                        </div>
                    </div>
                    <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
                    <Modal formSize="viewlog" text={this.state.text} listdetailtype="viewLog" loglist={this.state.loglist} ref="Modal_Log" />
                </div>
            </div>
        )
    }
}

BuyerUserManage.propTypes = {
    onSubmitjest: () => { }
};

function runs() {
    const domNode = document.getElementById('buyer_manage');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerUserManage),
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
