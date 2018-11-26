import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { UserEntity } from '../shared/user-entity';
import { Modal } from '../shared/show-modal';
import { getBuyerUserInfo, saveBuyerUserInfo, submitBuyerUserInfo, getBuyerUserInfoByUserId, validateIsExist } from '../../javascripts/componentService/common/service';
import { approveBuyerUser } from '../../javascripts/componentService/admin/service';
import { removeNanNum, validateNum, validateEmail, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate, setApprovalStatus } from '../../javascripts/componentService/util';

export class BuyerRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "", userid: "", text: "", btn_status: false, disabled: false, havedata: false, allbtnStatus: true, validate: true, use_type: "",
            email_address: "", company_name: "", unique_entity_number: "", company_address: "", billing_address: "", contact_name: "",
            mobile_number: "", office_number: "", entityStatus: "", approveStatus: false, status: '', main_id: '',
            user_entity_id: "", user_company_name: "", user_company_uen: "", user_company_address: "", user_billing_address: "", user_bill_attention_to: "",
            user_contact_name: "", user_contact_email: "", user_contact_mobile_no: "", user_contact_office_no: "", comment: "",
            buyerTCurl: "", buyerTCname: "", agree_seller_buyer: "0",
            buyerRevvTCurl: "", buyerRevvTCname: "", agree_buyer_revv: "0", has_tenants: "1",
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
            messageAttachmentUrlArr: [],
            usedEntityIdArr: []
        };
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
        this.validatorEntity = {
            contact_office_no: { cate: 'num' },
            contact_mobile_no: { cate: 'num' },
            contact_email: { cate: 'email' },
            contact_name: { cate: 'required' },
            bill_attention_to: { cate: 'required' },
            billing_address: { cate: 'required' },
            company_address: { cate: 'required' },
            company_uen: { cate: 'required' },
            company_name: { cate: 'required' },

        }
        this.validatorComment = {
            comment: { cate: 'required' }
        }
        this.isApprove = false;
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
    }

    componentDidMount() {
        if (this.state.userid) {
            getBuyerUserInfoByUserId(this.state.userid).then(res => {
                this.setDefault(res);
            })
        }
        else {
            getBuyerUserInfo().then(res => {
                this.setDefault(res);
            })
        }
        if (this.isApprove) {
            $("#buyer_management").addClass("tenant_management");
        }
    }

    setDefault(param) {
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
                user_company_name: item.company_name ? item.company_name : '',
                user_company_uen: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                user_company_address: item.company_address ? item.company_address : '',
                agree_seller_buyer: item.agree_seller_buyer ? item.agree_seller_buyer : '0',
                agree_buyer_revv: item.agree_buyer_revv ? item.agree_buyer_revv : '0',
                has_tenants: item.has_tenants ? item.has_tenants : '1',
                approveStatus: item.approval_status === "3" ? true : false,
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
                messageAttachmentUrlArr: param.letter_of_authorisation_attachment
            })
        }

        if (param.buyer_entities) {
            let entity = param.buyer_entities;
            let user_entity = [];
            if (entity.length > 0) {
                this.setState({
                    user_entity_id: entity[0].user_entity_id,
                    main_id: entity[0].id,
                    user_company_name: entity[0].company_name ? entity[0].company_name : '',
                    user_company_uen: entity[0].company_uen ? entity[0].company_uen : '',
                    user_company_address: entity[0].company_address ? entity[0].company_address : '',
                    user_billing_address: entity[0].billing_address ? entity[0].billing_address : '',
                    user_bill_attention_to: entity[0].bill_attention_to ? entity[0].bill_attention_to : '',
                    user_contact_name: entity[0].contact_name ? entity[0].contact_name : '',
                    user_contact_email: entity[0].contact_email ? entity[0].contact_email : '',
                    user_contact_mobile_no: entity[0].contact_mobile_no ? entity[0].contact_mobile_no : '',
                    user_contact_office_no: entity[0].contact_office_no ? entity[0].contact_office_no : ''
                })

                if (entity.length > 1) {
                    param.buyer_entities.map((item, index) => {
                        if (index > 0) {
                            user_entity.push({
                                user_entity_id: entity[index].user_entity_id,
                                main_id: entity[index].id,
                                company_name: entity[index].company_name ? entity[index].company_name : '',
                                company_uen: entity[index].company_uen ? entity[index].company_uen : '',
                                company_address: entity[index].company_address ? entity[index].company_address : '',
                                billing_address: entity[index].billing_address ? entity[index].billing_address : '',
                                bill_attention_to: entity[index].bill_attention_to ? entity[index].bill_attention_to : '',
                                contact_name: entity[index].contact_name ? entity[index].contact_name : '',
                                contact_email: entity[index].contact_email ? entity[index].contact_email : '',
                                contact_mobile_no: entity[index].contact_mobile_no ? entity[index].contact_mobile_no : '',
                                contact_office_no: entity[index].contact_office_no ? entity[index].contact_office_no : '',
                                approval_status: entity[index].approval_status
                            });
                        }
                    })
                    entityObj['ENTITY_LIST'][0].entities = user_entity;
                    this.setState({
                        user_entity_data: entityObj
                    })
                }
            }
            else {
                setTimeout((item) => {
                    this.setState({
                        user_contact_email: this.state.email_address
                    })
                }, 300);

            }
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
        if (param.used_buyer_entity_ids) {
            this.setState({
                usedEntityIdArr: param.used_buyer_entity_ids
            })
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
                return false;
            }
        })
        this.refs.Modal_Option.closeModal();
        return flag;
    }


    checkSuccess() { //buyer register or manage account

        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        let flag = true, hasDoc = true, checkSelect = true;
        let arr = validator_Object(this.state, this.validatorItem);
        if (arr) {
            arr.map((item, index) => {
                let column = item.column;
                let cate = item.cate;
                setValidationFaild(column, cate)
            })
        }
        let entity = validator_Array(this.state.user_entity_data['ENTITY_LIST'][0].entities, this.validatorEntity);
        if (entity) {
            entity.map((item, index) => {
                item.map((it, i) => {
                    let column = it.column;
                    let cate = it.cate;
                    let ind = it.ind;
                    setValidationFaild("user_" + column + "_" + ind, cate)
                })
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

    setParams(type) {
        let entity = [
            {
                main_id: this.state.main_id,
                user_entity_id: this.state.user_entity_id,
                company_name: this.state.company_name,
                company_uen: this.state.unique_entity_number,
                company_address: this.state.company_address,
                billing_address: this.state.user_billing_address,
                bill_attention_to: this.state.user_bill_attention_to,
                contact_name: this.state.user_contact_name,
                contact_email: this.state.user_contact_email,
                contact_mobile_no: this.state.user_contact_mobile_no,
                contact_office_no: this.state.user_contact_office_no,
                is_default: 1,
                user_id: this.state.id
            }
        ];

        if (this.state.user_entity_data['ENTITY_LIST'][0].entities) {
            let list = this.state.user_entity_data['ENTITY_LIST'][0].entities;
            list.map((item, index) => {
                let paramObj = {
                    main_id: item.main_id,
                    user_entity_id: item.user_entity_id,
                    company_name: item.company_name,
                    company_uen: item.company_uen,
                    company_address: item.company_address,
                    billing_address: item.billing_address,
                    bill_attention_to: item.bill_attention_to,
                    contact_name: item.contact_name,
                    contact_email: item.contact_email,
                    contact_mobile_no: item.contact_mobile_no,
                    contact_office_no: item.contact_office_no,
                    is_default: 0,
                    user_id: this.state.id
                }
                entity.push(paramObj);
            })
        }

        let params = {
            user: {
                'id': this.state.id,
                'email': this.state.email_address,
                'company_name': this.state.company_name,
                'company_unique_entity_number': this.state.unique_entity_number,
                'company_address': this.state.company_address,
                'billing_address': this.state.billing_address,
                'name': this.state.contact_name,
                'account_mobile_number': this.state.mobile_number,
                'account_office_number': this.state.office_number,
                'agree_seller_buyer': this.state.agree_seller_buyer,
                'agree_buyer_revv': this.state.agree_buyer_revv,
                'has_tenants': this.state.has_tenants,
            },
            buyer_entities: JSON.stringify(entity)
        };
        if (type == 1) {
            params.update_status_flag = 1;
        }
        return params;
    }
    removeInputNanNum(value) {
        removeNanNum(value);
    }
    addUserEntity() {
        let entityObj;
        entityObj = this.state.user_entity_data;
        let entity = {
            company_name: "",
            company_uen: "",
            company_address: "",
            billing_address: "",
            bill_attention_to: "",
            contact_name: "",
            contact_email: "",
            contact_mobile_no: "",
            contact_office_no: "",
        }
        // entityObj['ENTITY_LIST'][0].entities.splice(0, 0, entity);
        entityObj['ENTITY_LIST'][0].entities.push(entity);
        this.setState({
            user_entity_data: entityObj,
        })
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

    showView() {
        this.refs.Modal_upload.showModal();
    }

    save(type) {
        let isValidator = this.checkSuccess();
        if (isValidator) {
            validateIsExist(this.setParams()).then(res => {
                if (res.validate_result) {
                    saveBuyerUserInfo(this.setParams(type == "save" ? 1 : null)).then(res => {
                        if (res.result === "failed") {
                            this.setState(
                                {
                                    text: "Failure to save,the entity have available auction can't be deleted."
                                }
                            );
                            this.refs.Modal.showModal();
                        }
                        else {
                            this.setState(
                                {
                                    user_company_name: this.state.company_name,
                                    user_company_uen: this.state.unique_entity_number,
                                    user_company_address: this.state.company_address,
                                    text: "Your details have been successfully saved. "
                                }
                            );
                            //  this.refs.Modal.showModal("defaultCallBack");
                            if (type !== "save") {
                                this.refs.Modal.showModal();
                            }
                            else {
                                this.refs.Modal.showModal("defaultCallBack");
                            }
                        }
                    })
                }
                else {
                    this.validateRepeatColumn(res);
                }
            })
        }
    }

    submit(type) {
        let isValidator = this.checkSuccess();
        if (isValidator) {
            let buyerParam = this.setParams();
            validateIsExist(buyerParam).then(res => {
                if (res.validate_result) {
                    submitBuyerUserInfo(buyerParam).then(res => {
                        if (res.result === "failed") {
                            this.setState(
                                {
                                    text: "Failure to submit,the entity have available auction can't be deleted . "
                                }
                            );
                            this.refs.Modal.showModal();
                        }
                        else {
                            window.location.href = `/buyer/home`;
                        }
                    })
                }
                else {
                    this.validateRepeatColumn(res);
                }
            })
        }
    }
    validateRepeatColumn(res) {
        if (res.error_fields) {
            for (let item of res.error_fields) {
                if (item === "company_unique_entity_number") {
                    $('#unique_entity_number_repeat').removeClass('isPassValidate').addClass('errormessage');
                    $("input[name='unique_entity_number']").focus();
                }
                else if (item === "email") {
                    $('#email_address_repeat').removeClass('isPassValidate').addClass('errormessage');
                    $("input[name='email_address']").focus();
                }
                else {
                    $('#company_name_repeat').removeClass('isPassValidate').addClass('errormessage');
                    $("input[name='company_name']").focus();
                }
            }
        }
        if (res.error_entity_indexes) {
            for (let item of res.error_entity_indexes) {
                let index = item.entity_index;
                let fieldName = item.error_field_name;
                if (index === 0) {
                    $('#user_contact_email_repeat').removeClass('isPassValidate').addClass('errormessage');
                    $("input[name='user_contact_email']").focus();
                }
                else {
                    if (fieldName === "contact_email") {
                        $("#user_contact_email_" + (index - 1) + "_repeat").removeClass('isPassValidate').addClass('errormessage');
                        $("#contact_email_" + (index - 1)).focus();
                    }
                    else if (fieldName === "company_name") {
                        $("#user_company_name_" + (index - 1) + "_repeat").removeClass('isPassValidate').addClass('errormessage');
                        $("#company_name_" + (index - 1)).focus();
                    }
                    else {
                        $("#user_company_uen_" + (index - 1) + "_repeat").removeClass('isPassValidate').addClass('errormessage');
                        $("#company_uen_" + (index - 1)).focus();
                    }
                }
            }
        }
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
    refreshForm(obj) {
        if (obj === "refrsesh") {
            window.location.href = `/users/edit`;
        }
    }

    doAction(obj) {
        let param = {
            user_id: this.state.userid,
            comment: this.state.comment,
            approved: obj.action === 'reject' ? "" : 1
        };
        approveBuyerUser(param).then(res => {
            location.href = "/admin/users/buyers";
        })
    }

    render() {
        let btn_html;
        if (this.state.use_type === 'admin_approve') {
            btn_html = <div>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'reject')} disabled={this.state.approveStatus}>Reject</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'approve')} disabled={this.state.approveStatus}>Approve</button>
            </div>;
        }
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
            <div className="retailer_manage_coming">
                <div id="buyer_form" >
                    <div>
                        <div className="u-grid admin_invitation">
                            <div className="col-sm-12 col-md-6 push-md-3 validate_message">
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
                                        <input type="text" name="user_contact_mobile_no" value={this.state.user_contact_mobile_no} onChange={this.Change.bind(this, 'user_contact_mobile_no')} readOnly={this.state.disabled} ref="user_contact_mobile_no" maxLength="8" aria-required="true" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                        <div className='isPassValidate' id='user_contact_mobile_no_message' >This field is required!</div>
                                        <div className='isPassValidate' id='user_contact_mobile_no_format' >Number should contain 8 integers.</div>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Office No. :
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_contact_office_no" value={this.state.user_contact_office_no} onChange={this.Change.bind(this, 'user_contact_office_no')} readOnly={this.state.disabled} ref="user_contact_office_no" maxLength="8" aria-required="true" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                        <div className='isPassValidate' id='user_contact_office_no_message' >This field is required!</div>
                                        <div className='isPassValidate' id='user_contact_office_no_format' >Number should contain 8 integers.</div>
                                        <div className={this.state.disabled ? "isHide" : "addEntity"} >
                                            <a onClick={this.addUserEntity.bind(this)} >Add</a>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                <UserEntity entityStatus={this.state.entityStatus} usedEntity={this.state.usedEntityIdArr} disabled={this.state.disabled} entityList={this.state.user_entity_data} ref="userEntity" className={this.state.disabled === 'admin_approve' ? '' : ''} />
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
                                <h4 className="lm--formItem lm--formItem--inline string chkBuyer"><input type="checkbox" id="chkBuyer" onChange={this.Change.bind(this, 'chkBuyer')} name={"seller_buyer_tc"} disabled={this.state.disabled} /><span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerTCurl} className="urlStyleUnderline">Terms & Conditions of Use (Buyer)</a></span></h4>
                                <div id="chkBuyer_message" className='isPassValidate'>Please check this box if you want to proceed.</div>
                                <h4 className="lm--formItem lm--formItem--inline string chkBuyer"><input type="checkbox" id="chkRevv" name={"seller_revv_tc"} onChange={this.Change.bind(this, 'chkRevv')} disabled={this.state.disabled} /><span>Check here to indicate that you have read and agree to the <a target="_blank" href={this.state.buyerRevvTCurl} className="urlStyleUnderline">Electricity Purchase Contract</a></span></h4>
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
                                <div className="retailer_btn">
                                    {btn_html}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal text={this.state.text} acceptFunction={this.refreshForm.bind(this)} ref="Modal" />
                    <Modal listdetailtype="Documents Message" ref="Modal_upload" attatchment={this.state.messageAttachmentUrlArr} />
                    <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
                </div>
            </div>
        )
    }
}

BuyerRegister.propTypes = {
    onSubmitjest: () => { }
};

function runs() {
    const domNode = document.getElementById('buyer_register');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerRegister),
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