import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import { getBuyerUserInfo, saveBuyerUserInfo, submitBuyerUserInfo, getBuyerUserInfoByUserId, validateIsExist } from '../../javascripts/componentService/common/service';
import { approveBuyerUser } from '../../javascripts/componentService/admin/service';
import { removeNanNum, validateNum, validateEmail, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate, setApprovalStatus } from '../../javascripts/componentService/util';
import { textChangeRangeIsUnchanged } from 'typescript';

export class BuyerUserEntityRegister extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "", userid: "", text: "", btn_status: false, disabled: false, havedata: false, allbtnStatus: true, validate: true, use_type: "",
            email_address: "", company_name: "", unique_entity_number: "", company_address: "", billing_address: "", contact_name: "",
            mobile_number: "", office_number: "", entityStatus: "", approveStatus: false, status: '', main_id: '',
            user_entity_id: "", user_company_name: "", user_company_uen: "", user_company_address: "", user_billing_address: "", user_bill_attention_to: "",
            user_contact_name: "", user_contact_email: "", user_contact_mobile_no: "", user_contact_office_no: "", comment: "",
            buyerTCurl: "", buyerTCname: "", agree_seller_buyer: "0",
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
            mainEntityFinished: false,
            ismain:false
        }
        this.entityItem = {
            id: 0,
            company_name: "",
            company_uen: "",
            company_address: "",
            billing_address: "",
            bill_attention_to: "",
            contact_name: "",
            contact_email: "",
            contact_mobile_no: "",
            contact_office_no: "",
            option: "",
            is_default: 0
        }
        this.validatorItem = {
            user_contact_office_no: { cate: 'num' },
            user_contact_mobile_no: { cate: 'num' },
            user_contact_email: { cate: 'email' },
            user_contact_name: { cate: 'required' },
            user_bill_attention_to: { cate: 'required' },
            user_billing_address: { cate: 'required' },
            user_company_address: { cate: 'required' },
            user_company_uen: { cate: 'required' },
            user_company_name: { cate: 'required' },

            office_number: { cate: 'num' },
            mobile_number: { cate: 'num' },
            contact_name: { cate: 'required' },
            billing_address: { cate: 'required' },
            company_address: { cate: 'required' },
            unique_entity_number: { cate: 'required' },
            company_name: { cate: 'required' },
            email_address: { cate: 'email' },
        }
        this.validatorBuyerInfo = {
            office_number: { cate: 'num' },
            mobile_number: { cate: 'num' },
            contact_name: { cate: 'required' },
            billing_address: { cate: 'required' },
            company_address: { cate: 'required' },
            unique_entity_number: { cate: 'required' },
            company_name: { cate: 'required' },
            email_address: { cate: 'email' }
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        if (this.state.userid) {
            getBuyerUserInfoByUserId(this.state.userid).then(res => {
                this.setDefaultValue(res);
            })
        }
        else {
            getBuyerUserInfo().then(res => {
                this.setDefaultValue(res);
            })
        }
        if (this.isApprove) {
            $("#buyer_management").addClass("tenant_management");
        }
    }
    setDefaultValue(param) {
        this.setBuyerInfo(param);
        this.setEntityInfo(param);
        this.setButton(param);
    }
    setButton(param) {
        let userid;
        console.log(param.buyer_entities)
        if (param.buyer_entities.length > 0) {
            if (window.location.href.indexOf("admin/users/") > -1) {
                userid = window.location.href.split("admin/users/")[1].split("/manage")[0];
            }
            if (userid) {
                this.setState({
                    userid: userid
                });
            }
            if (window.location.href.indexOf('buyer/home') > 0) {
                this.setState({
                    use_type: 'sign_up', entityStatus: "register"
                });
                this.isApprove = false;
            }
            else if (window.location.href.indexOf('users/edit') > 0) {
                this.setState({ use_type: 'manage_acount', entityStatus: "manage", disabled: true });
                this.isApprove = false;
            }
            else {
                this.setState({ use_type: 'admin_approve', entityStatus: "approve" });
                this.setState({ disabled: true });
                this.isApprove = true;
            }
            this.setState({
                mainEntityFinished: true
            })
        }
        else {
            this.setState({
                use_type: 'first_register', entityStatus: "register",
                mainEntityFinished: false
            })
        }
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
                approveStatus: item.approval_status === "3" ? true : false,
                user_company_name: item.company_name ? item.company_name : '',
                user_company_uen: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                user_company_address: item.company_address ? item.company_address : '',
                status: setApprovalStatus(item.approval_status, item.approval_date_time === null ? item.created_at : item.approval_date_time)
            })
            $('#buyer_management').val(this.state.has_tenants);
            if (this.state.agree_seller_buyer === "1") {
                $('#chkBuyer').attr("checked", true);
            }
            else {
                $('#chkBuyer').attr("checked", false);
            }
            if (this.state.agree_buyer_revv === "1") {
                $('#chkRevv').attr("checked", true);
            }
            else {
                $('#chkRevv').attr("checked", false);
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
        if (param.seller_buyer_tc_attachment) {
            let buyer = param.seller_buyer_tc_attachment;
            this.setState({
                buyerTCurl: buyer.file_path,
                buyerTCname: buyer.file_name
            })
        }

        if (param.buyer_revv_tc_attachment) {
            let revv = param.buyer_revv_tc_attachment;
            this.setState({
                buyerRevvTCurl: revv.file_path,
                buyerRevvTCname: revv.file_name
            })
        }

        if (param.buyer_entities) {
            let entity = param.buyer_entities;
            if (entity.length === 0) {
                setTimeout((item) => {
                    this.setState({
                        user_contact_email: this.state.email_address
                    })
                }, 300);
            }
        }
    }
    setEntityInfo(param) {
        if (param.buyer_entities) {
            let user_entity = param.buyer_entities;
            this.setState({
                entity_list: user_entity
            })
        }
    }


    tab(type) {
        if (this.state.mainEntityFinished) {
            $(".buyer_tab a").removeClass("selected");
            $("#tab_" + type).addClass("selected");
            $(".buyer_list").hide();
            $("#buyer_" + type).fadeIn(500);
        }
    }
    tab_next(type) {
        if (this.state.mainEntityFinished) {
            $(".buyer_tab a").removeClass("selected");
            $("#tab_" + type).addClass("selected");
            $(".buyer_list").hide();
            $("#buyer_" + type).fadeIn(0);
        }
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
            case 'billing_address':
                this.setState({ billing_address: itemValue });
                changeValidate('billing_address', itemValue);
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
            case 'user_company_name':
                this.setState({ user_company_name: itemValue });
                changeValidate('user_company_name', itemValue);
                break;
            case 'user_company_uen':
                this.setState({ user_company_uen: itemValue });
                changeValidate('user_company_uen', itemValue);
                break;
            case 'user_company_address':
                this.setState({ user_company_address: itemValue });
                changeValidate('user_company_address', itemValue);
                break;
            case 'user_billing_address':
                this.setState({ user_billing_address: itemValue });
                changeValidate('user_billing_address', itemValue);
                break;
            case 'user_bill_attention_to':
                this.setState({ user_bill_attention_to: itemValue });
                changeValidate('user_bill_attention_to', itemValue);
                break;
            case 'user_contact_name':
                this.setState({ user_contact_name: itemValue });
                changeValidate('user_contact_name', itemValue);
                break;
            case 'user_contact_email':
                this.setState({ user_contact_email: itemValue });
                if (!validateEmail(itemValue)) {
                    setValidationFaild('user_contact_email', 2)
                } else {
                    setValidationPass('user_contact_email', 2)
                }
                break;
            case 'user_contact_mobile_no':
                this.setState({ user_contact_mobile_no: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('user_contact_mobile_no', 2)
                } else {
                    setValidationPass('user_contact_mobile_no', 2)
                }
                break;
            case 'user_contact_office_no':
                this.setState({ user_contact_office_no: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('user_contact_office_no', 2)
                } else {
                    setValidationPass('user_contact_office_no', 2)
                }
                break;

            case 'buyer_management':
                let val = $('#buyer_management').val();
                this.setState({ has_tenants: val });
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
                    this.setState({ agree_buyer_revv: 1 });
                    setValidationPass('chkRevv', 1)
                } else {
                    this.setState({ agree_buyer_revv: 0 });
                    setValidationFaild('chkRevv', 1);
                }
                break;
            case 'comment':
                this.setState({ comment: itemValue });
                changeValidate('comment', itemValue);
                break;
        }
    }
    removeInputNanNum(value) {
        removeNanNum(value);
    }
    showView() {
        this.refs.Modal_upload.showModal();
    }
    next() {
        if (this.checkRequired(this.validatorItem)) {
            let mainEntityObj = {
                id:"",
                company_name: this.state.company_name,
                company_uen: this.state.unique_entity_number,
                company_address: this.state.company_address,
                billing_address: this.state.user_billing_address,
                bill_attention_to: this.state.user_bill_attention_to,
                contact_name: this.state.user_contact_name,
                contact_email: this.state.user_contact_email,
                contact_mobile_no: this.state.user_contact_mobile_no,
                contact_office_no: this.state.user_contact_office_no,
                is_default: 1
            }
            let mainEntityArr = [];
            mainEntityArr.push(mainEntityObj)
            this.setState({
                entity_list: mainEntityArr
            });
            setTimeout(() => {
                this.tab_next('entity');
            })
            this.setState({
                mainEntityFinished: true,
                use_type: 'sign_up', entityStatus: "register",
            })
        }
    }
    checkRequired(item) {
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        let flag = true, hasDoc = true, checkSelect = true;
        let arr = validator_Object(this.state, item);

        if (arr) {
            arr.map((item, index) => {
                let column = item.column;
                let cate = item.cate;
                setValidationFaild(column, cate)
            })
        }
        if (this.state.fileData['BUYER_DOCUMENTS'][0].files.length > 0) {
            hasDoc = true;
            $("#showMessage").removeClass("errormessage").addClass("isPassValidate");
        }
        else {
            hasDoc = false;
            $("#showMessage").removeClass("isPassValidate").addClass("errormessage");
        }
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                flag = false;
                return false;
            }
        })
        if ($('#chkBuyer').is(':checked') && $('#chkRevv').is(':checked')) {
            checkSelect = true;
        }
        else {
            checkSelect = false;
            if (!$('#chkBuyer').is(':checked')) {
                $("#chkBuyer_message").removeClass('isPassValidate').addClass('errormessage');
            }
            if (!$('#chkRevv').is(':checked')) {
                $("#chkRevv_message").removeClass('isPassValidate').addClass('errormessage');
            }
        }
        return flag && hasDoc && checkSelect;
    }

    save(type) {

    }
    submit(type) {

    }

    edit() {
        this.setState({
            disabled: false
        })
    }
    cancel() {
        this.setState({
            disabled: true
        })
        //window.location.href = `/users/edit`;
    }
    judgeAction(type) {
    }
    refreshForm(obj) {
        if (obj === "refrsesh") {
            window.location.href = `/users/edit`;
        }
    }
    doAction(obj) {
        // let param = {
        //     user_id: this.state.userid,
        //     comment: this.state.comment,
        //     approved: obj.action === 'reject' ? "" : 1
        // };
        // approveBuyerUser(param).then(res => {
        //     location.href = "/admin/users/buyers";
        // })
    }
    acceptAddEntity(entityInfo) {
        let item = {
            id: entityInfo.id ? entityInfo.id : "",
            company_name: entityInfo.company_name,
            company_uen: entityInfo.company_uen,
            company_address: entityInfo.company_address,
            billing_address: entityInfo.billing_address,
            bill_attention_to: entityInfo.bill_attention_to,
            contact_name: entityInfo.contact_name,
            contact_email: entityInfo.contact_email,
            contact_mobile_no: entityInfo.contact_mobile_no,
            contact_office_no: entityInfo.contact_office_no
        };

        let entity = this.state.entity_list;
        if (entityInfo.index >= 0) { entity[entityInfo.index] = item; }
        else { entity.push(item) }
        this.setState({
            entity_list: entity
        })
    }
    add_entity() {
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        this.entityItem.id = '';
        this.entityItem.company_name = '';
        this.entityItem.company_uen = '';
        this.entityItem.company_address = '';
        this.entityItem.billing_address = '';
        this.entityItem.bill_attention_to = '';
        this.entityItem.contact_name = '';
        this.entityItem.contact_email = '';
        this.entityItem.contact_mobile_no = '';
        this.entityItem.contact_office_no = '';
        this.entityItem.is_default=0;
        this.setState({
            entityItemInfo: this.entityItem,
            ismain:false,
            text: " "
        })
        this.refs.Modal_Entity.showModal('custom', {}, '', '-1')
    }
    edit_entity(item, index) {
        this.setState({ entityItemInfo: {} });
        this.entityItem.id = item.id;
        this.entityItem.company_name = item.company_name;
        this.entityItem.company_uen = item.company_uen;
        this.entityItem.company_address = item.company_address;
        this.entityItem.billing_address = item.billing_address;
        this.entityItem.bill_attention_to = item.bill_attention_to;
        this.entityItem.contact_name = item.contact_name;
        this.entityItem.contact_email = item.contact_email;
        this.entityItem.contact_mobile_no = item.contact_mobile_no;
        this.entityItem.contact_office_no = item.contact_office_no;
        if (index === 0) {
            this.entityItem.is_default = 1;
            this.setState({
                ismain:true
            });
        }
        else {
            this.entityItem.is_default = 0;
            this.setState({
                ismain:false
            });
        }

        this.entityItem.option = 'update';
        this.setState({
            text: " ",
            entityItemInfo: this.entityItem
        })
        this.refs.Modal_Entity.showModal('custom', {}, '', index)
    }
    delete_entity(item) {

    }
    render() {
        let btn_html;
        if (this.state.use_type === "first_register") {
            btn_html =
                <div><button id="save_new" className="lm--button lm--button--primary" onClick={this.next.bind(this)}>Next</button></div>
        }
        // else if (this.state.use_type === 'admin_approve') {
        //     btn_html = <div>
        //         <button id="save_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'reject')} disabled={this.state.approveStatus}>Reject</button>
        //         <button id="submit_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'approve')} disabled={this.state.approveStatus}>Approve</button>
        //     </div>;
        // }
        else if (this.state.use_type === 'manage_acount') {
            btn_html = this.state.disabled ?
                <div><button id="save_edit" className="lm--button lm--button--primary" onClick={this.edit.bind(this)}>Edit</button></div>
                : <div>
                    <button id="save_form" className="lm--button lm--button--primary" onClick={this.cancel.bind(this)}>Cancel</button>
                    <button id="submit_form" className="lm--button lm--button--primary" onClick={this.save.bind(this, 'save')}>Save</button>
                </div>;
        }
        else {
            btn_html = <div>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.save.bind(this, "register")}>Save</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.submit.bind(this, 'sign_up')}>Complete Sign Up</button>
            </div>;
        }
        return (
            <div className="u-grid mg0 div-center" >
                <h2 className="u-mt3 u-mb3"></h2>
                <div className="buyer_buyer_list col-sm-12 col-md-12">
                    <div className="col-sm-12 buyer_tab">
                        <a className="col-sm-4 col-md-2 selected" onClick={this.tab.bind(this, 'base')} id="tab_base">Buyer Information</a>
                        <a className="col-sm-4 col-md-2" onClick={this.tab.bind(this, 'entity')} id="tab_entity"  >Entity</a>
                    </div>
                    <div className="col-sm-12 buyer_list" id="buyer_base" >
                        <div className="retailer_manage_coming">
                            <div id="buyer_form" >
                                <div>
                                    <div className="u-grid admin_invitation">
                                        <div className="col-sm-12 col-md-8 push-md-3 validate_message">
                                            <div className="lm--formItem lm--formItem--inline string">
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
                                                    <input type="text" name="mobile_number" value={this.state.mobile_number} onKeyUp={this.removeInputNanNum.bind(this)} onChange={this.Change.bind(this, 'mobile_number')} readOnly={this.state.disabled} ref="mobile_number" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field" required aria-required="true" ></input>
                                                    <div className='isPassValidate' id='mobile_number_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='mobile_number_format' >Number should contain 8 integers!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Office Number :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="office_number" value={this.state.office_number} onKeyUp={this.removeInputNanNum.bind(this)} onChange={this.Change.bind(this, 'office_number')} readOnly={this.state.disabled} ref="office_number" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field" required aria-required="true" ></input>
                                                    <div className='isPassValidate' id='office_number_message' >This field is required!</div>
                                                    <div className='isPassValidate' id='office_number_format' >Number should contain 8 integers!</div>
                                                </div>
                                            </div>
                                            <h4 className="lm--formItem lm--formItem--inline string">Business Documentations</h4>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Upload Supporting Documents :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                    <UploadFile type="BUYER_DOCUMENTS" required="required" validate="true" deleteType="buyer" showList="1" col_width="10" showWay="1" fileData={this.state.fileData.BUYER_DOCUMENTS} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                                    <div className="col-sm-1 col-md-1 u-cell">
                                                        <button className={this.state.disabled ? "lm--button lm--button--primary buttonDisabled" : "lm--button lm--button--primary"} disabled={this.state.disabled} onClick={this.showView.bind(this)} >?</button>
                                                    </div>
                                                    <div id="showMessage" className="isPassValidate">This field is required!</div>
                                                </div>
                                            </div>
                                            <div className="spaceDiv">

                                            </div>
                                            <div className={this.state.mainEntityFinished ? "isHide" : "isDisplay"}>
                                                <h4 className="lm--formItem lm--formItem--inline string">Electricity Purchase Information</h4>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Purchase Entity/<br />Company Name :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_company_name" style={{ background: '#35404c' }} value={this.state.user_company_name} onChange={this.Change.bind(this, 'user_company_name')} disabled={true} ref="user_company_name" aria-required="true" ></input>

                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr>  Company UEN :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_company_uen" style={{ background: '#35404c' }} disabled={true} value={this.state.user_company_uen} onChange={this.Change.bind(this, 'user_company_uen')} ref="user_company_uen" aria-required="true"></input>
                                                        <div className='isPassValidate' id='user_company_uen_message' >This field is required!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Company Address :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_company_address" style={{ background: '#35404c' }} value={this.state.user_company_address} onChange={this.Change.bind(this, 'user_company_address')} disabled={true} ref="user_company_address" aria-required="true"></input>
                                                        <div className='isPassValidate' id='user_company_address_message' >This field is required!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Billing Address :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_billing_address" value={this.state.user_billing_address} onChange={this.Change.bind(this, 'user_billing_address')} readOnly={this.state.disabled} ref="user_billing_address" aria-required="true" title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_billing_address_message' >This field is required!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Bill Attention To :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_bill_attention_to" value={this.state.user_bill_attention_to} onChange={this.Change.bind(this, 'user_bill_attention_to')} readOnly={this.state.disabled} ref="user_bill_attention_to" aria-required="true" title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_bill_attention_to_message' >This field is required!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Contact Name :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_contact_name" value={this.state.user_contact_name} onChange={this.Change.bind(this, 'user_contact_name')} readOnly={this.state.disabled} ref="user_contact_name" aria-required="true" title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_contact_name_message' >This field is required!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr>  Contact Email :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_contact_email" value={this.state.user_contact_email} onChange={this.Change.bind(this, 'user_contact_email')} readOnly={this.state.disabled} ref="user_contact_email" aria-required="true" title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_contact_email_message' >This field is required!</div>
                                                        <div className='isPassValidate' id='user_contact_email_format' >Incorrect mail format!</div>
                                                        <div className='isPassValidate' id='user_contact_email_repeat' >Contact email has already been taken!</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Contact Mobile No. :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_contact_mobile_no" value={this.state.user_contact_mobile_no} onChange={this.Change.bind(this, 'user_contact_mobile_no')} onKeyUp={this.removeInputNanNum.bind(this)} readOnly={this.state.disabled} ref="user_contact_mobile_no" maxLength="8" aria-required="true" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_contact_mobile_no_message' >This field is required!</div>
                                                        <div className='isPassValidate' id='user_contact_mobile_no_format' >Number should contain 8 integers.</div>
                                                    </div>
                                                </div>
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Contact Office No. :
                                                    </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <input type="text" name="user_contact_office_no" value={this.state.user_contact_office_no} onChange={this.Change.bind(this, 'user_contact_office_no')} onKeyUp={this.removeInputNanNum.bind(this)} readOnly={this.state.disabled} ref="user_contact_office_no" maxLength="8" aria-required="true" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                                        <div className='isPassValidate' id='user_contact_office_no_message' >This field is required!</div>
                                                        <div className='isPassValidate' id='user_contact_office_no_format' >Number should contain 8 integers.</div>
                                                    </div>
                                                </div>
                                                <div className="spaceDiv">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 buyer_list" id="buyer_entity">
                        <table className="buyer_entity" cellPadding="0" cellSpacing="0">
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
                                    <th></th>
                                </tr>
                            </thead>
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
                                            <td>
                                                <div className="editSite"><a className="btnOption" onClick={this.edit_entity.bind(this, item, index)}>Edit </a></div>
                                                <div className={index === 0 ? "isHide" : "isDisplay"}>
                                                    <div className="delSite"><a className="btnOption" onClick={this.delete_entity.bind(this, index)}>Delete </a></div>
                                                </div>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="" style={{ paddingLeft: "20px" }}>
                            {/* <a href="" >Add Entity</a> */}
                            {/* {this.state.checked ? '' : <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Entity</a></div>} */}
                            <a onClick={this.add_entity.bind(this)}>Add Entity</a>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 push-md-3 validate_message margin-t buyer_list_select">
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-left lm--formItem-label string required">
                                <abbr title="required">*</abbr> Tenant Management Service Required :
                                    </label>
                            <div className="lm--formItem-right lm--formItem-control">
                                <select className="selectController" name="buyer_management" id="buyer_management" onChange={this.Change.bind(this, 'buyer_management')} defaultValue={this.state.buyer_management} disabled={this.state.disabled} ref="buyer_management" aria-required="true">
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 push-md-3 validate_message margin-t" >
                        <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                            <input type="checkbox" id="chkBuyer" onChange={this.Change.bind(this, 'chkBuyer')} name={"seller_buyer_tc"} disabled={this.state.disabled} />
                            <span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerTCurl} className="urlStyleUnderline">Buyer Platform Terms of Use</a></span>
                        </h4>
                        <div id="chkBuyer_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                        <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                            <input type="checkbox" id="chkRevv" name={"seller_revv_tc"} onChange={this.Change.bind(this, 'chkRevv')} disabled={this.state.disabled} />
                            <span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerRevvTCurl} className="urlStyleUnderline">Energy Procurement Agreement</a></span>
                        </h4>
                        <div id="chkRevv_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                        <div className={this.state.use_type === 'admin_approve' ? 'isDisplay' : 'isHide'}>
                            <div className="dividerline"></div>
                            <div >
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        Admin Comments :
                                        </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <textarea name="comment" value={this.state.comment} onChange={this.Change.bind(this, 'comment')} ref="comment" aria-required="true"></textarea>
                                        <div className='isPassValidate' id='comment_message' >This field is required!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Modal text={this.state.text} acceptFunction={this.refreshForm.bind(this)} ref="Modal" />
                        <Modal listdetailtype="Documents Message" ref="Modal_upload" attatchment={this.state.messageAttachmentUrl} /> */}
                        <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
                        <Modal formSize="big" listdetailtype="entity_detail" text={this.state.text} acceptFunction={this.acceptAddEntity.bind(this)} entitList={this.state.entity_list} disabled={this.state.ismain} entityDetailItem={this.state.entityItemInfo} ref="Modal_Entity" />
                        {/* */}
                    </div>
                    <div className="retailer_btn">
                        {btn_html}
                    </div>
                </div>
            </div>
        )
    }
}

BuyerUserEntityRegister.propTypes = {
    onSubmitjest: () => { }
};

function runs() {
    const domNode = document.getElementById('buyer_register');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerUserEntityRegister),
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