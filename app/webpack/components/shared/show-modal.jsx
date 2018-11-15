import React, { Component } from 'react';
import { constants } from 'os';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { validateConsumptionDetailRepeat } from './../../javascripts/componentService/common/service';
import { formatPower, validateInteger, validateLess100, removeDecimal, removeAsInteger, removeAsIntegerPercent, replaceSymbol, trim, validateNum, validateNum4, validateNum10, validateDecimal, validateEmail, validateTwoDecimal, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate, removeNanNum, removePostCode, validatePostCode } from '../../javascripts/componentService/util';
//共通弹出框组件
import { UploadFile } from '../shared/upload';
import E from 'wangeditor';

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalshowhide: "modal_hide",
            type: 'default', secondStatus: "live_hide", itemIndex: "", props_data: {},
            strtype: '', email_subject: '', email_body: '', consumptionItem: [],
            contracted_capacity_disabled: true, contract_expiry_disabled: true, disabled: false, id: "", orignal_id: "", consumption_id: "", account_number: '',
            existing_plan: [], existing_plan_selected: '', contract_expiry: '', purchasing_entity: [], purchasing_entity_selectd: '', premise_address: '',
            intake_level: [], intake_level_selected: '',
            contracted_capacity: '', blk_or_unit: '', street: '', unit_number: '', postal_code: '',
            totals: '', peak_pct: '', peak: ""
            , attachment_ids: '', option: '', cate_type: '',
            isSaved: false, uploadUrl: "/api/buyer/user_attachments?file_type=", validate: false,
            fileData: {
                "CONSUMPTION_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
            modalSize: this.props.modalSize, approval_status: 2,
            entityid: '', is_default: '', user_id: "", main_id: "", user_entity_id: "",
            entity_company_name: '', entity_company_uen: '', entity_company_address: '', entity_billing_address: '', entity_bill_attention_to: '', entity_contact_name: '',
            entity_contact_email: '', entity_contact_mobile_no: '', entity_contact_office_no: '', entitList: [], entityErrorList: [], loglist: [], attatchment: [],
            attatchment_file_name: "", attatchment_file_path: "",
            advisory: ""
        }
    }

    componentWillReceiveProps(next) {
        let fileObj;
        fileObj = this.state.fileData;
        if (next.consumptionAccountItem) {
            this.setState({
                consumption_id: next.consumptionAccountItem.consumption_id,
                id: next.consumptionAccountItem.id,
                orignal_id: next.consumptionAccountItem.orignal_id,
                isSaved: next.consumptionAccountItem.id ? true : false,
                account_number: next.consumptionAccountItem.account_number,
                existing_plan: next.consumptionAccountItem.existing_plan,
                existing_plan_selected: next.consumptionAccountItem.existing_plan_selected,
                contract_expiry: next.consumptionAccountItem.contract_expiry === "" ? "" : moment(next.consumptionAccountItem.contract_expiry),
                purchasing_entity: next.consumptionAccountItem.purchasing_entity,
                // purchasing_entity_selectd: next.
                //     consumptionAccountItem.purchasing_entity_selectd ? next.consumptionAccountItem.purchasing_entity_selectd :
                //     next.consumptionAccountItem.purchasing_entity.length > 0 ? next.consumptionAccountItem.purchasing_entity[0].id : "",
                purchasing_entity_selectd: next.
                    consumptionAccountItem.purchasing_entity_selectd ? next.consumptionAccountItem.purchasing_entity_selectd : "",
                premise_address: next.consumptionAccountItem.premise_address,
                intake_level: next.consumptionAccountItem.intake_level,
                intake_level_selected: next.consumptionAccountItem.intake_level_selected,
                contracted_capacity: next.consumptionAccountItem.contracted_capacity ? formatPower(parseInt(next.consumptionAccountItem.contracted_capacity), 0, '') : "",
                blk_or_unit: next.consumptionAccountItem.blk_or_unit,
                street: next.consumptionAccountItem.street,
                unit_number: next.consumptionAccountItem.unit_number,
                postal_code: next.consumptionAccountItem.postal_code,
                totals: next.consumptionAccountItem.totals ? formatPower(parseInt(next.consumptionAccountItem.totals), 0, '') : "",
                peak_pct: next.consumptionAccountItem.peak_pct === "" ? "" : parseInt(Math.round(next.consumptionAccountItem.peak_pct)),
                peak: next.consumptionAccountItem.peak_pct ? (100 - parseFloat(next.consumptionAccountItem.peak_pct)) : "",
                option: next.consumptionAccountItem.option,
                cate_type: next.consumptionAccountItem.cate_type
            });

            if (next.consumptionAccountItem.type === "preDay") {
                this.setState({
                    contract_expiry_disabled: true
                })
            }

            if (next.consumptionAccountItem.attachment_ids) {

                fileObj["CONSUMPTION_DOCUMENTS"][0].files = [];
                fileObj["CONSUMPTION_DOCUMENTS"][0].files = next.consumptionAccountItem.attachment_ids;
                this.setState({
                    fileData: fileObj
                })
            }
            else {
                fileObj["CONSUMPTION_DOCUMENTS"][0].files = [];
                this.setState({
                    fileData: fileObj
                })
            }

            if (next.consumptionAccountItem.existing_plan_selected === "Retailer plan") {
                this.setState({
                    contract_expiry_disabled: false
                })
            }
            else {
                this.setState({
                    contract_expiry_disabled: true
                })
            }
            if (next.consumptionAccountItem.intake_level_selected === "LT") {
                this.setState({
                    contracted_capacity_disabled: true
                })
            }
            else {
                this.setState({
                    contracted_capacity_disabled: false
                })
            }
        }
        if (next.siteList) {
            this.setState({ consumptionItem: next.siteList });
        }


        if (next.attatchment) {

            if (next.attatchment[0]) {
                this.setState({
                    attatchment_file_name: next.attatchment[0].file_name,
                    attatchment_file_path: next.attatchment[0].file_path
                })
            }
        }
        if (next.advisory) {
            this.setState({
                advisory: next.advisory
            })
        }
        if (next.entityDetailItem) {
            this.setState({
                entityid: next.entityDetailItem.id,
                entity_company_name: next.entityDetailItem.company_name,
                entity_company_uen: next.entityDetailItem.company_uen,
                entity_company_address: next.entityDetailItem.company_address,
                entity_billing_address: next.entityDetailItem.billing_address,
                entity_bill_attention_to: next.entityDetailItem.bill_attention_to,
                entity_contact_name: next.entityDetailItem.contact_name,
                entity_contact_email: next.entityDetailItem.contact_email,
                entity_contact_mobile_no: next.entityDetailItem.contact_mobile_no,
                entity_contact_office_no: next.entityDetailItem.contact_office_no,
                is_default: next.entityDetailItem.is_default,
                user_id: next.entityDetailItem.user_id,
                main_id: next.entityDetailItem.main_id,
                user_entity_id: next.entityDetailItem.user_entity_id,
                option: next.entityDetailItem.option,
                approval_status: next.entityDetailItem.approval_status
            })
        }
        if (next.entitList) {
            this.setState({ entitList: next.entitList })
        }

        if (next.entityErrorList) {
            this.setState({
                entityErrorList: next.entityErrorList
            })
        }
        if (next.loglist) {
            this.setState({
                loglist: next.loglist
            })
        }

        $(".btn").css("pointer-events", "auto");
        $("#permise_address_taken_message").removeClass("errormessage").addClass('isPassValidate');
        $("#account_number_taken_message").removeClass("errormessage").addClass('isPassValidate');
        $("#account_number_taken_already_message").removeClass("errormessage").addClass('isPassValidate');

    }

    componentDidMount() {
        if (this.props.formSize === "big") {
            $("#btnUpload").removeClass("col-md-2 u-cell").addClass("col-md-3");
        }
        else {
            $("#btnUpload").removeClass("col-md-3").addClass("col-md-2 u-cell");
        }
        $(".react-datepicker-wrapper").click(function () {
            let status = $(".react-datepicker-wrapper").find("input").attr("disabled");
            if (status !== "disabled") {
                $(".react-datepicker-popper").removeClass("isHide");
            }
        })
    }

    showModal(type, data, str, index) {
        if (str) {
            this.setState({ strtype: str });
        }
        this.setState({
            modalSize: "big",
            modalshowhide: "modal_show",
            props_data: data ? data : {}
        })
        if (data) {
            if (str == "email_template_la") {
                $(".w-e-text p").html("");
                if ($("#email_body").html() == "") {
                    var editor = new E('#email_body');
                    // editor.customConfig.menus = [
                    //     'head',
                    //     'bold',
                    //     'fontSize',
                    //     'fontName',
                    //     'italic',
                    //     'underline',
                    //     'strikeThrough',
                    //     'foreColor',
                    //     'backColor',
                    //     'justify',
                    //     'undo',
                    //     'redo'
                    // ];
                    editor.customConfig.lang = {
                        '字号': 'font size',
                        '字体': 'font',
                        '文字颜色': 'font color',
                        '背景色': 'background color',
                        '对齐方式': 'alignment',
                        '靠左': 'left',
                        '靠右': 'right',
                        '居中': 'center',
                        '宋体': 'song',
                        '微软雅黑': 'yahei',
                        "设置标题": "Header",
                        "设置列表": "set List",
                        "有序列表": "ordered list",
                        "无序列表": "unordered list",
                        "图片链接": "picture link",
                        "插入": "Insert",
                        "创建": "Create",
                        "行": "Row",
                        "列": "Column",
                        "格式如": "Format like",
                        "链接文字": "Text Link",
                        "的表格": "'s table",
                        "正文": "Content",
                        "删除链接": "Delete Link",
                        "最大宽度": "Maximum Width",
                        "删除图片": "Delete Picture",
                        "增加": "Add ",
                        "删除": "Delete ",
                        "表格": "Table"
                    };
                    setTimeout(() => { editor.create(); });
                }
                setTimeout(() => { $(".w-e-text").html("").html(data == "" ? "<p></p>" : data) }, 300);
            }
            if (data.subject && data.body) {
                $(".w-e-text p").html("");
                if ($("#email_body").html() == "") {
                    var editor = new E('#email_body');
                    // editor.customConfig.menus = [
                    //     'head',
                    //     'bold',
                    //     'fontSize',
                    //     'fontName',
                    //     'italic',
                    //     'underline',
                    //     'strikeThrough',
                    //     'foreColor',
                    //     'backColor',
                    //     'justify',
                    //     'undo',
                    //     'redo'
                    // ];
                    editor.customConfig.lang = {
                        '字号': 'font size',
                        '字体': 'font',
                        '文字颜色': 'font color',
                        '背景色': 'background color',
                        '对齐方式': 'alignment',
                        '靠左': 'left',
                        '靠右': 'right',
                        '居中': 'center',
                        '宋体': 'song',
                        '微软雅黑': 'yahei',
                        "设置标题": "Header",
                        "设置列表": "set List",
                        "有序列表": "ordered list",
                        "无序列表": "unordered list",
                        "图片链接": "picture link",
                        "插入": "Insert",
                        "创建": "Create",
                        "行": "Row",
                        "列": "Column",
                        "格式如": "Format like",
                        "链接文字": "Text Link",
                        "的表格": "'s table",
                        "正文": "Content",
                        "删除链接": "Delete Link",
                        "最大宽度": "Maximum Width",
                        "删除图片": "Delete Picture",
                        "增加": "Add ",
                        "删除": "Delete ",
                        "表格": "Table"
                    };
                    setTimeout(() => { editor.create(); })
                }
                this.setState({
                    email_subject: data.subject,
                    email_body: data.body
                })
                setTimeout(() => { $(".w-e-text").html("").html(this.state.email_body == "" ? "<p></p>" : this.state.email_body) }, 300);
            }
        }
        if (type == "comfirm") {
            this.setState({
                type: "comfirm"
            })
        } else if (type === 'custom') {
            this.setState({
                type: "custom"
            })
        }
        else if (type === 'defaultCallBack') {
            this.setState({
                type: "defaultCallBack"
            })
        }
        else if (type === 'chkSelectedBuyers') {
            this.setState({
                type: "chkSelectedBuyers"
            })
        }
        else {
            this.setState({
                type: "default"
            })
        }
        if (index !== null && index !== "") {
            this.setState({
                itemIndex: index
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
        if (this.state.strtype == "email_template" ||
            this.state.strtype == "email_template_la") {
            if (this.state.strtype == "email_template_la") {
                this.setState({ props_data: $(".w-e-text").html() });
            } else {
                let data = this.state.props_data;
                data.subject = this.state.email_subject;
                data.body = $(".w-e-text").html();
                this.setState({ props_data: data });
            }
        }
        if (this.props.acceptFunction) {
            setTimeout(() => {
                let data = this.state.props_data;
                if (data.action === "proceed") {
                    this.props.acceptFunction(this.state.props_data);
                    this.setState({
                        modalSize: "small",
                        modalshowhide: "modal_hide"
                    })
                }
                else {
                    this.props.acceptFunction(this.state.props_data);
                    this.closeModal();
                }
            })
        }

        if (this.props.dodelete) {
            this.props.dodelete();
        }
        this.setState({
            type: "default"
        })

        if (this.props.formSize === "middle") {
            $("#modal_main").css({ "width": "50%", "height": "310px", "top": "40%", "marginLeft": "-25%" });
            $(".email_body").css({ "height": "170px" });
        }
    }

    Add() {
        $(".btn").css("pointer-events", "none");
        if (this.props.listdetailtype === 'entity_detail') {
            this.checkEntitySuccess();
        }
        else {
            this.checkModelSuccess();
        }
    }

    addEntity() { //buyer entity
        // $(".btn").css("pointer-events", "none");
        let entityItem = {
            id: this.state.entityid,
            company_name: this.state.entity_company_name,
            company_uen: this.state.entity_company_uen,
            company_address: this.state.entity_company_address,
            billing_address: this.state.entity_billing_address,
            bill_attention_to: this.state.entity_bill_attention_to,
            contact_name: this.state.entity_contact_name,
            contact_email: this.state.entity_contact_email,
            contact_mobile_no: this.state.entity_contact_mobile_no,
            contact_office_no: this.state.entity_contact_office_no,
            is_default: this.state.is_default,
            user_id: this.state.user_id,
            main_id: this.state.main_id,
            user_entity_id: this.state.user_entity_id,
            approval_status: this.state.approval_status,
            index: this.state.itemIndex
        }
        if (this.props.acceptFunction) {
            this.props.acceptFunction(entityItem);
            this.setState({
                modalshowhide: "modal_hide"
            })
        }
    }

    checkEntitySuccess() {//  user entity validate
        let flag = true;
        let validateItem = {
            // company_name:"required",
            entity_contact_office_no: { cate: 'num' },
            entity_contact_mobile_no: { cate: 'num' },
            entity_contact_email: { cate: 'email' },
            entity_contact_name: { cate: 'required' },
            entity_bill_attention_to: { cate: 'required' },
            entity_billing_address: { cate: 'required' },
            entity_company_address: { cate: 'required' },
            entity_company_uen: { cate: 'required' },
            entity_company_name: { cate: 'required' }
        }
        let validateResult = validator_Object(this.state, validateItem);
        flag = validateResult.length > 0 ? false : true;
        if (flag) {
            //need  validate
            this.addEntity();
        }
        else {
            $('.validate_message').find('div').each(function () {
                let className = $(this).attr('class');
                if (className === 'errormessage') {
                    let divid = $(this).attr("id");
                    $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
                }
            })
            validateResult.map((item, index) => {
                let column = item.column;
                let cate = item.cate;
                setValidationFaild(column, cate);
            })
            $(".btn").css("pointer-events", "auto");
        }
    }

    changeEntity(type, e) {
        let itemValue = e.target.value;
        switch (type) {
            case "entityid":
                this.setState({
                    entityid: value
                })
                break;
            case "entity_company_name":
                this.setState(
                    { entity_company_name: itemValue }
                );
                changeValidate('entity_company_name', itemValue);
                break;

            case 'entity_company_uen':
                this.setState({ entity_company_uen: itemValue });
                changeValidate('entity_company_uen', itemValue);
                break;
            case 'entity_company_address':
                this.setState({ entity_company_address: itemValue });
                changeValidate('entity_company_address', itemValue);
                break;
            case 'entity_billing_address':
                this.setState({ entity_billing_address: itemValue });
                changeValidate('entity_billing_address', itemValue);
                break;
            case 'entity_bill_attention_to':
                this.setState({ entity_bill_attention_to: itemValue });
                changeValidate('entity_bill_attention_to', itemValue);
                break;
            case 'entity_contact_name':
                this.setState({ entity_contact_name: itemValue });
                changeValidate('entity_contact_name', itemValue);
                break;
            case 'entity_contact_email':
                this.setState({ entity_contact_email: itemValue });
                if (!validateEmail(itemValue)) {
                    setValidationFaild('entity_contact_email', 2)
                } else {
                    setValidationPass('entity_contact_email', 2)
                }
                break;
            case 'entity_contact_mobile_no':
                this.setState({ entity_contact_mobile_no: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('entity_contact_mobile_no', 2)
                } else {
                    setValidationPass('entity_contact_mobile_no', 2)
                }
                break;
            case 'entity_contact_office_no':
                this.setState({ entity_contact_office_no: itemValue });
                if (!validateNum(itemValue)) {
                    setValidationFaild('entity_contact_office_no', 2)
                } else {
                    setValidationPass('entity_contact_office_no', 2)
                }
                break;
        }
    }


    addToMainForm() { // consumption detail validate-behand side
        // $(".btn").css("pointer-events", "none");
        let siteItem = {
            consumption_id: this.state.consumption_id,
            id: this.state.id,
            orignal_id: this.state.orignal_id,
            account_number: this.state.account_number,
            existing_plan_selected: (this.state.existing_plan_selected !== null && this.state.existing_plan_selected !== "") ? this.state.existing_plan_selected : this.state.existing_plan[0],
            contract_expiry: this.state.contract_expiry ? this.state.contract_expiry : "",
            purchasing_entity_selectd: this.state.purchasing_entity.length === 1 ? this.state.purchasing_entity[0].id : this.state.purchasing_entity_selectd,
            intake_level_selected: this.state.intake_level_selected,
            contracted_capacity: this.state.contracted_capacity,
            blk_or_unit: this.state.blk_or_unit,
            street: this.state.street,
            unit_number: this.state.unit_number,
            postal_code: this.state.postal_code,
            totals: Math.round(this.state.totals),
            peak_pct: this.state.peak_pct,
            index: this.state.itemIndex,
            cate_type: this.state.cate_type,
            attachment_ids: "",
            user_attachment: []
        }

        if (this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0) {
            let idsArr = [];
            this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.map((item) => {
                idsArr.push(item.id);
            })
            siteItem.attachment_ids = JSON.stringify(idsArr);
            siteItem.user_attachment = this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files;
        }

        let validateItem = {
            id: this.state.id,
            account_number: this.state.account_number,
            unit_number: this.state.unit_number,
            postal_code: this.state.postal_code,
            orignal_id: this.state.orignal_id
        }

        let param = {
            detail: validateItem,
            consumption_id: this.state.consumption_id,
            is_new: this.state.cate_type === 'current' ? 1 : 0
        }

        validateConsumptionDetailRepeat(param).then(res => {
            if (res.validate_result) {
                if (this.props.acceptFunction) {
                    this.props.acceptFunction(siteItem);
                    this.setState({
                        modalshowhide: "modal_hide"
                    })
                }
            }
            else {
                $(".btn").css("pointer-events", "auto");
                if (res.error_details) {

                    res.error_details.map(item => {
                        if (this.state.cate_type === 'current') {
                            if (item.error_field_name === "account_number") {
                                $("#account_number_taken_message").removeClass("isPassValidate").addClass('errormessage');
                                $("#account_number").focus();
                            }
                        }
                        else {
                            if (item.error_field_name === "account_number") {
                                $("#account_number_taken_already_message").removeClass("isPassValidate").addClass('errormessage');
                                $("#account_number").focus();
                            }
                        }
                        if (item.error_field_name === "premise_addresses") {
                            $("#permise_address_taken_message").removeClass("isPassValidate").addClass('errormessage');
                            $("#unit_number").focus();
                        }

                    })
                }
            }
        })
    }

    changeConsumption(type, e) {
        let value = e.target.value;
        switch (type) {
            case "id":
                this.setState({
                    id: value
                })
                break;
            case "account_number":
                this.setState({
                    account_number: value
                })
                changeValidate('account_number', value);
                break;
            case "existing_plan":
                let existing_plan_dis = true;
                if (value === 'Retailer plan') {
                    existing_plan_dis = false;
                }
                else {
                    this.setState({
                        contract_expiry: ""
                    })
                    existing_plan_dis = true;

                }
                this.setState({
                    existing_plan_selected: value,
                    contract_expiry_disabled: existing_plan_dis
                })
                break;
            case "contract_expiry":
                this.setState({
                    contract_expiry: value//moment(value).format('YYYY-MM-DD')
                })
                changeValidate('contract_expiry', value);
                break;
            case "purchasing_entity":
                this.setState({
                    purchasing_entity_selectd: value
                })
                if (value) {
                    setValidationPass('purchasing_entity_selectd', 1)
                }
                else {
                    setValidationFaild('purchasing_entity_selectd', 1)
                }
                break;
            case "intake_level":
                let contracted_capacity_dis = true;
                if (value === 'LT') {
                    this.setState({
                        contracted_capacity: ""
                    })
                    contracted_capacity_dis = true;
                }
                else {
                    contracted_capacity_dis = false;
                }
                this.setState({
                    contracted_capacity_disabled: contracted_capacity_dis,
                    intake_level_selected: value
                })
                break;
            case "contracted_capacity":
                let capacity = replaceSymbol(value)
                this.setState({
                    contracted_capacity: capacity
                })
                if (!validateNum4(value)) {
                    setValidationFaild('contracted_capacity', 2)
                } else {
                    setValidationPass('contracted_capacity', 2)
                }
                break;
            case "blk_or_unit":
                this.setState({
                    blk_or_unit: value
                })
                changeValidate('blk_or_unit', value);
                break;
            case "street":
                this.setState({
                    street: value
                })
                changeValidate('street', value);
                break;
            case "unit_number":
                this.setState({
                    unit_number: value
                })
                changeValidate('unit_number', value);
                break;
            case "postal_code":
                this.setState({
                    postal_code: value
                })
                if (!validatePostCode(value)) {
                    setValidationFaild('postal_code', 2)
                } else {
                    setValidationPass('postal_code', 2)
                }
                break;
            case "totals":
                // let total = replaceSymbol(value)
                // let decimalValue = total.split('.')[1];
                // if (decimalValue) {
                //     if (decimalValue.length > 2) {
                //         decimalValue = decimalValue.substr(0, 2);
                //         total = value.split('.')[0] + "." + decimalValue;
                //     }
                // }
                value = removeAsInteger(value);
                this.setState({
                    totals: value
                })
                if (!validateInteger(value)) {
                    setValidationFaild('totals', 2)
                } else {
                    setValidationPass('totals', 2)
                }
                break;
            case "peak_pct":

                value = removeAsIntegerPercent(value)
                this.setState({
                    peak_pct: value
                })

                if (!validateLess100(value)) {
                    setValidationFaild('peak_pct', 2)
                } else {
                    setValidationPass('peak_pct', 2)
                }
                if (Number(value)) {
                    this.setState({
                        peak: (100 - parseFloat(value))
                    })
                }
                else {
                    this.setState({
                        peak: 100
                    })
                }
                break;
        }
    }

    checkModelSuccess(event) { //check consumption account form
        let flag = true, hasDoc = true;
        let validateItem = {
            peak_pct: { cate: 'less100integer' },
            totals: { cate: 'integer' },
            postal_code: { cate: 'postcode' },
            unit_number: { cate: 'required' },
            street: { cate: 'required' },
            blk_or_unit: { cate: 'required' },
            contracted_capacity: { cate: 'num4' },
            purchasing_entity_selectd: { cate: 'required' },
            contract_expiry: { cate: 'required' },
            account_number: { cate: 'required' }
        }
        if (this.state.existing_plan_selected !== "Retailer plan") {
            delete validateItem.contract_expiry;
        }
        if (this.state.intake_level_selected === "LT") {
            delete validateItem.contracted_capacity;
        }

        this.setState({
            totals: replaceSymbol(this.state.totals),
            contracted_capacity: replaceSymbol(this.state.contracted_capacity)
        })



        setTimeout(() => {
            let validateResult = validator_Object(this.state, validateItem);
            flag = validateResult.length > 0 ? false : true;
            if (flag) {
                let status = this.account_address_repeat();

                switch (status) {
                    case 'false|true':
                        $("#permise_address_taken_message").removeClass("isPassValidate").addClass('errormessage');
                        $("#account_number_taken_message").removeClass("errormessage").addClass('isPassValidate');
                        $("#unit_number").focus();
                        $(".btn").css("pointer-events", "auto")
                        break;
                    case 'true|false':
                        $("#permise_address_taken_message").removeClass("errormessage").addClass('isPassValidate');
                        $("#account_number_taken_message").removeClass("isPassValidate").addClass('errormessage');
                        $("#account_number").focus();
                        $(".btn").css("pointer-events", "auto")
                        break;
                    case 'true|true':
                        $("#permise_address_taken_message").removeClass("isPassValidate").addClass('errormessage');
                        $("#account_number_taken_message").removeClass("isPassValidate").addClass('errormessage');
                        $("#account_number").focus();
                        $(".btn").css("pointer-events", "auto")
                        break;
                    default:
                        $("#permise_address_taken_message").removeClass("errormessage").addClass('isPassValidate');
                        $("#account_number_taken_message").removeClass("errormessage").addClass('isPassValidate');
                        this.addToMainForm();
                        break;
                }
            }
            else {
                $('.validate_message').find('div').each(function () {
                    let className = $(this).attr('class');
                    if (className === 'errormessage') {
                        let divid = $(this).attr("id");
                        $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
                    }
                })
                validateResult.map((item, index) => {
                    let column = item.column;
                    let cate = item.cate;
                    setValidationFaild(column, cate);
                    if (column === "contract_expiry") {
                        setTimeout(() => {
                            $(".react-datepicker-popper").addClass("isHide");
                        });
                    }
                })
                $(".btn").css("pointer-events", "auto")
            }
        }, 500);
    }

    removefile(type, index, id) {
        if (confirm("Are you sure you want to delete this file?")) {
            if (this.props.otherFunction) {
                this.props.otherFunction(type, index, id)
            }
        }
    }

    Change(type, e) { }

    removeInputNanNum(value) {
        removeNanNum(value)
    }
    // removeAsInteger(value)
    // {
    //     removeAsInteger(value)
    // }

    removeTwoDemical(value) {
        removeDecimal(value);
    }
    removeInputPostCode(value) {
        removePostCode(value);
    }

    account_address_repeat() {
        let address = false, account = false;
        let address_count = 0, account_count = 0;
        this.state.consumptionItem.map((item, index) => {
            if (this.state.option === 'update') {
                if (item.id) {

                    if ((trim(this.state.unit_number) == trim(item.unit_number)) && (trim(this.state.postal_code) == trim(item.postal_code)) && (this.state.id !== item.id)) {
                        address_count++;
                    }
                    if (trim(this.state.account_number) === trim(item.account_number) && (this.state.id !== item.id)) {
                        account_count++;
                    }
                }
                else {
                    if (item.orignal_id) {
                        if ((trim(this.state.unit_number) == trim(item.unit_number)) && (trim(this.state.postal_code) == trim(item.postal_code)) && (this.state.orignal_id !== item.orignal_id)) {
                            address_count++;
                        }
                        if (trim(this.state.account_number) === trim(item.account_number) && (this.state.orignal_id !== item.orignal_id)) {
                            account_count++;
                        }
                    } else {
                        if ((trim(this.state.unit_number) == trim(item.unit_number)) && (trim(this.state.postal_code) == (item.postal_code))) {
                            if (index != this.state.itemIndex) {
                                address_count++;
                            }
                        }
                        if (trim(this.state.account_number) == trim(item.account_number)) {
                            if (index != this.state.itemIndex) {
                                account_count++;
                            }
                        }
                    }

                }
            }
            else {
                if ((trim(this.state.unit_number) === trim(item.unit_number)) && (trim(this.state.postal_code) === trim(item.postal_code))) {
                    address_count++;
                }
                if (trim(this.state.account_number) === trim(item.account_number)) {
                    account_count++;
                }
            }
        })

        if (address_count > 0) {
            address = true;
        }
        if (account_count > 0) {
            account = true;
        }
        return account + "|" + address;
    }

    closeModal(type) {
        if (this.state.type === "chkSelectedBuyers") {
            let data = this.state.props_data;
            if (type === 0) {
                data.action = "cancel";
            }
            if (this.props.acceptFunction) {
                this.props.acceptFunction(data);
                this.setState({
                    modalSize: "small",
                    modalshowhide: "modal_hide"
                })
            }

        }
        else {
            this.setState({
                modalSize: "small",
                modalshowhide: "modal_hide"
            })
            if (this.props.formSize === "middle") {
                $("#modal_main").css({ "width": "50%", "height": "310px", "top": "40%", "left": "40%" });
                $(".email_body").css({ "height": "170px" });
            }
        }
        if (this.props.listdetailtype === "entity_detail" || this.props.listdetailtype === "consumption_detail") {
            $('.validate_message').find('div').each(function () {
                let className = $(this).attr('class');
                if (className === 'errormessage') {
                    let divid = $(this).attr("id");
                    $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
                }
            })
        }
    }

    bigModal(type) {
        if (this.state.modalSize === "big") {//height:"300px", top: "40%", left: "40%"
            $("#modal_main").css({ "width": "85%", "height": "500px", "top": "30%", "marginLeft": "-42.5%" });
            $(".email_body").css({ "height": "330px" });
            this.setState({
                modalSize: "small"
            })
        }
        else {
            $("#modal_main").css({ "width": "50%", "height": "310px", "top": "40%", "marginLeft": "-25%" });
            $(".email_body").css({ "height": "170px" });
            this.setState({
                modalSize: "big"
            })
        }
    }

    closeModalAndRefresh() {
        if (this.props.acceptFunction) {
            this.props.acceptFunction('refrsesh');
            this.closeModal();
        }
    }

    closeModelAndCancelSave() {
        let data = this.state.props_data;
        data.action = "cancel";
        if (this.props.acceptFunction) {
            this.props.acceptFunction(data);
            this.closeModal();
        }
    }

    dateChange(data) {
        this.setState({
            contract_expiry: data
        })
    }
    Change(type, e) {
        if (type == "email_subject") {
            this.setState({
                email_subject: e.target.value
            })
        }
    }
    noPermitInput(event) {
        event.preventDefault();
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
                        return <li key={index}><a className="overflow_text" target="_blank" download={item.file_name} href={item.file_path}>{item.file_name}</a><abbr><font>|</font>{item.file_time}</abbr><span style={{ display: 'none' }} className="remove_file" onClick={this.removefile.bind(this, this.state.strtype, index, item.fileid)}></span></li>
                    })}
                </ul>
            } else if (this.props.listdetailtype === "Email Template") {
                if (this.props.text === '') {
                    showDetail = <div>
                        {this.state.strtype == "email_template_la" ? '' : <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-label string required">
                                Subject:
                            </label>
                            <div className="lm--formItem-control">
                                <input type="text" name="email_subject" value={this.state.email_subject} onChange={this.Change.bind(this, 'email_subject')} disabled={this.state.disabled} ref="email_subject" required aria-required="true" />
                            </div>
                        </div>}
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-label string required">

                            </label>
                            <div className="lm--formItem-control" style={{ "color": "red", "padding-left": "35px" }}>
                                Important: Do NOT edit any text starting with #, as these are predefined parameters which will affect system stability.
                            </div>
                        </div>
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-label string required">
                                Body:
                            </label>
                            <div className="lm--formItem-control">
                                <div name="email_body" className="email_body" id={"email_body"} style={this.state.strtype == "email_template_la" ? { height: "425px" } : { height: "360px" }} onChange={this.Change.bind(this, 'email_body')} disabled={this.state.disabled} ref="email_body" required aria-required="true" />
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
                                    <li>HTS Peak: $ {parseFloat(this.props.listdetail.hts_peak).toFixed(4)}</li>
                                    <li>HTS Off Peak: $ {parseFloat(this.props.listdetail.hts_off_peak).toFixed(4)}</li>
                                </div>
                            }
                            {((this.props.listdetail.htl_peak == 0.0) && (this.props.listdetail.htl_peak == 0.0)) ?
                                "" :
                                <div>
                                    <li>HTL Peak: $ {parseFloat(this.props.listdetail.htl_peak).toFixed(4)}</li>
                                    <li>HTL Off Peak: $ {parseFloat(this.props.listdetail.htl_peak).toFixed(4)}</li>
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
            if (this.props.listdetailtype === 'Documents Message') {
                showDetail = <ul className="showdetail">
                    {/* <li>Please upload the following documentations:</li>
                    <li>1) A print-out of this <a href={(this.state.attatchment_file_path != "" && this.state.attatchment_file_path !== null) ? this.state.attatchment_file_path : "javascript:void(0)"} download={this.state.attatchment_file_name} className="urlStyleUnderline" target="_blank">Letter of Authorisation</a>, together with the Applicant's signature and Company Stamp.</li>
                    <li>2a) Your company's Accounting & Corporate Regulatory Authority (ACRA) Business Profile.</li>
                    <li>or</li>
                    <li>2b) Your company's Certificate of Incorporation if you are not registered with Accounting & Corporate Regulatory Authority (ACRA).</li>
                    <li>3) Directors' Resolution authorising the Authorised Representative to transact for and on behalf of the Company in this platform.</li>
                    <li>4) A copy of the Applicant's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>5) A copy of the Authorised Representative's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>All supporting documents submitted should be in English only.</li> */}
                    <li>Please upload the following documentations:</li>
                    <li>1.Duly signed Declaration Form (note: different form for Retailer and Buyer) </li>
                    <li>1a) Your company's Accounting & Corporate Regulatory Authority (ACRA) Business Profile.</li>
                    <li>or</li>
                    <li>1b) Your company's Certificate of Incorporation if you are not registered with Accounting & Corporate Regulatory Authority (ACRA).</li>
                    <li>2) Directors' Resolution authorising the Authorised Representative to transact for and on behalf of the Company in this platform.</li>
                    <li>3) A copy of the Authorised Representative's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>All supporting documents submitted should be in English only.</li>
                </ul>
            }
            if (this.props.listdetailtype === 'accountTaken') {
                showDetail = <div>
                    {this.props.takenList.length > 0 ? <div>
                        <span className={this.props.takenList.length > 0 ? "isDisplayInLine" : "isHide"}>Highlighted Account No had already been occupied. </span>
                        <ul className="showdetailerr">{
                            this.props.takenList.map((item, index) => {
                                return <li key={index}><span>{item}</span></li>
                            })
                        }
                        </ul>
                    </div> : <div></div>}
                </div>
            }
            if (this.props.listdetailtype === 'entity_error') {

                if (this.props.entityErrorList.nameError) {
                    showDetail = <div>
                        {
                            this.props.entityErrorList.nameError ?
                                <div>
                                    <span className={this.props.entityErrorList.nameError.length > 0 ? "isDisplayInLine" : "isHide"}>Company Name cannot be duplicated:</span>
                                    <ul className="showdetailerr">{
                                        this.props.entityErrorList.nameError.map((item, index) => {
                                            return <li key={index}><span>{item}</span></li>
                                        })
                                    }
                                    </ul>
                                </div>
                                : <div></div>
                        }
                        {
                            this.props.entityErrorList.uenError ?
                                <div>
                                    <span className={this.props.entityErrorList.uenError.length > 0 ? "isDisplayInLine" : "isHide"}>Company UEN cannot be duplicated:</span>
                                    <ul className="showdetailerr">{
                                        this.props.entityErrorList.uenError.map((item, index) => {
                                            return <li key={index}><span>{item}</span></li>
                                        })
                                    }
                                    </ul>
                                </div>
                                : <div></div>
                        }
                        {
                            this.props.entityErrorList.emailError ?
                                <div>
                                    <span className={this.props.entityErrorList.emailError.length > 0 ? "isDisplayInLine" : "isHide"}>Contact Email cannot be duplicated:</span>
                                    <ul className="showdetailerr">{
                                        this.props.entityErrorList.emailError.map((item, index) => {
                                            return <li key={index}><span>{item}</span></li>
                                        })
                                    }
                                    </ul>
                                </div>
                                : <div></div>
                        }
                    </div>
                }
            }
            if (this.props.listdetailtype === 'viewLog') {
                showDetail = <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="33.33%" />
                        <col width="33.33%" />
                        <col width="33.33%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Company UEN</th>
                            <th>Update Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.loglist.map((item, index) => {
                                return <tr key={index}>
                                    <td>{item.company_name}</td>
                                    <td>{item.company_uen}</td>
                                    <td>
                                        {(moment(item.created_at).format('YYYY-MM-DD HH:mm:ss ')).split(" ")[0]}<br />
                                        {(moment(item.created_at).format('YYYY-MM-DD HH:mm:ss ')).split(" ")[1]}
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            }
            if (this.props.listdetailtype === 'viewRetailerLog') {
                showDetail = <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Company UEN</th>
                            <th>Retailer License Number</th>
                            <th>Update Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.loglist.map((item, index) => {
                                return <tr key={index}>
                                    <td>{item.company_name}</td>
                                    <td>{item.company_uen}</td>
                                    <td>{item.license_number}</td>
                                    <td>
                                        {(moment(item.created_at).format('YYYY-MM-DD HH:mm:ss ')).split(" ")[0]}<br />
                                        {(moment(item.created_at).format('YYYY-MM-DD HH:mm:ss ')).split(" ")[1]}
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            }
            if (this.props.listdetailtype === "market-insight") {
                $("#advisoryDiv").html(this.state.advisory);
                $("#advisoryDiv").find('a').addClass('aUrl');
                showDetail = <div id="advisoryDiv" style={{ height: "220px" }}> </div>
            }

            if (this.props.listdetailtype === 'entity_detail') {
                if (this.props.entity_detail_item !== null) {
                    showDetail = <div className=" admin_invitation validate_message">
                        <h3 className="text_padding_left">Entity Information</h3>
                        <table className="consumption_table  u-mb3" cellPadding="0" cellSpacing="0" style={{ marginTop: "15px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "30%" }}><abbr title="required">*</abbr>Purchase Entity/Company Name</td>
                                    <td style={{ width: "70%" }}>
                                        <div className="isHide">
                                            <input type="text" value={this.state.entityid} onChange={this.changeEntity.bind(this, "entityid")} id="id" name="id" />
                                        </div>
                                        <input type="text" name="entity_company_name" id="entity_company_name" value={this.state.entity_company_name} onChange={this.changeEntity.bind(this, 'entity_company_name')} className={this.props.disabled ? "mainEntity" : ""} disabled={this.props.disabled} ref="entity_company_name" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_company_name_message" >This field is required!</div>
                                        <div className='isPassValidate' id="entity_company_name_repeat" >Company name has already been taken!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Company UEN</td>
                                    <td>
                                        <input type="text" name="entity_company_uen" id="entity_company_uen" value={this.state.entity_company_uen} onChange={this.changeEntity.bind(this, 'entity_company_uen')} className={this.props.disabled ? "mainEntity" : ""} disabled={this.props.disabled} ref="entity_company_uen" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_company_uen_message" >This field is required!</div>
                                        <div className='isPassValidate' id="entity_company_uen_repeat" >Company UEN has already been taken!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Company Address</td>
                                    <td>
                                        <input type="text" name="entity_company_address" id="entity_company_address" value={this.state.entity_company_address} onChange={this.changeEntity.bind(this, 'entity_company_address')} className={this.props.disabled ? "mainEntity" : ""} disabled={this.props.disabled} ref="entity_company_address" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_company_address_message" >This field is required!</div>
                                        <div className='isPassValidate' id="entity_company_address_repeat" >Company UEN has already been taken!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Billing Address</td>
                                    <td>
                                        <input type="text" name="entity_billing_address" id="entity_billing_address" value={this.state.entity_billing_address} onChange={this.changeEntity.bind(this, 'entity_billing_address')} ref="entity_billing_address" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_billing_address_message" >This field is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <abbr title="required">*</abbr>Bill Attention To</td>
                                    <td>
                                        <input type="text" name="entity_bill_attention_to" id="entity_bill_attention_to" value={this.state.entity_bill_attention_to} onChange={this.changeEntity.bind(this, 'entity_bill_attention_to')} ref="entity_bill_attention_to" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_bill_attention_to_message" >This field is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <abbr title="required">*</abbr>Contact Name</td>
                                    <td>
                                        <input type="text" name="entity_contact_name" id="entity_contact_name" value={this.state.entity_contact_name} onChange={this.changeEntity.bind(this, 'entity_contact_name')} ref="entity_contact_name" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_contact_name_message" >This field is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <abbr title="required">*</abbr>Contact Email</td>
                                    <td>
                                        <input type="text" name="entity_contact_email" id="entity_contact_email" value={this.state.entity_contact_email} onChange={this.changeEntity.bind(this, 'entity_contact_email')} ref="entity_contact_email" aria-required="true" title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_contact_email_message" >This field is required!</div>
                                        <div className='isPassValidate' id='entity_contact_email_format' >Incorrect mail format!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <abbr title="required">*</abbr>Contact Mobile No.</td>
                                    <td>
                                        <input type="text" name="entity_contact_mobile_no" id="entity_contact_mobile_no" value={this.state.entity_contact_mobile_no} onChange={this.changeEntity.bind(this, 'entity_contact_mobile_no')} maxLength="8" onKeyUp={this.removeInputNanNum.bind(this)} ref="entity_contact_mobile_no" aria-required="true" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_contact_mobile_no_message" >This field is required!</div>
                                        <div className='isPassValidate' id='entity_contact_mobile_no_format' >Number should contain 8 integers.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <abbr title="required">*</abbr>Contact Office No.</td>
                                    <td>
                                        <input type="text" name="entity_contact_office_no" id="entity_contact_office_no" value={this.state.entity_contact_office_no} onChange={this.changeEntity.bind(this, 'entity_contact_office_no')} maxLength="8" onKeyUp={this.removeInputNanNum.bind(this)} ref="entity_contact_office_no" aria-required="true" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                        <div className='isPassValidate' id="entity_contact_office_no_message" >This field is required!</div>
                                        <div className='isPassValidate' id='entity_contact_office_no_format' >Number should contain 8 integers.</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
            }
            if (this.props.listdetailtype === 'consumption_detail') {
                if (this.props.consumptionAccountItem !== null) {
                    showDetail = <div className=" admin_invitation validate_message">
                        <h3 className="text_padding_left">My Account Information</h3>
                        <table className="consumption_table  u-mb3" cellPadding="0" cellSpacing="0" style={{ marginTop: "15px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "30%" }}><abbr title="required">*</abbr>Account No.</td>
                                    <td style={{ width: "70%" }}>
                                        <div className="isHide">
                                            <input type="text" value={this.state.id} onChange={this.changeConsumption.bind(this, "id")} id="id" name="id" />
                                        </div>
                                        <input type="text" disabled={(this.state.cate_type === 'preDay' || this.state.cate_type === 'preOthers') ? true : false} value={this.state.account_number} onChange={this.changeConsumption.bind(this, "account_number")} id="account_number" name="account_number" required aria-required="true" />
                                        <div id="account_number_message" className="isPassValidate">This filed is required!</div>
                                        <div id="account_number_taken_message" className="errormessage">Account number cannot be duplicated.</div>
                                        <div id="account_number_taken_already_message" style={{ "wordBreak": "keep-all" }} className="errormessage">There is one ongoing Auction already occupied account {this.state.account_number}, please  use other account.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Existing Plan</td>
                                    <td>
                                        <select id="existing_plan" onChange={this.changeConsumption.bind(this, 'existing_plan')} name="existing_plan" disabled={this.state.cate_type === 'preDay'} value={this.state.existing_plan_selected}>
                                            {
                                                this.state.existing_plan.map((it, i) => <option key={i} value={it}>{it}</option>)
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">
                                        <span className={this.state.existing_plan_selected === "Retailer plan" ? "isDisplay" : "isHide"}>*</span>
                                    </abbr>Contract Expiry</td>
                                    <td>
                                        <DatePicker selected={this.state.contract_expiry} className="date_ico" disabled={this.state.cate_type === 'preDay' ? true : this.state.contract_expiry_disabled} onKeyDown={this.noPermitInput.bind(this)} ref="contract_expiry" shouldCloseOnSelect={true} name="contract_expiry" minDate={moment()} required aria-required="true" dateFormat="DD-MM-YYYY" selectsStart onChange={this.dateChange.bind(this)} title="Time must not be in the past." />
                                        <div id="contract_expiry_message" className="isPassValidate">This filed is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Purchasing Entity</td>
                                    <td>
                                        <div>
                                            <select id="purchasing_entity" disabled={this.state.cate_type === 'preDay' || this.state.cate_type === 'preOthers'} onChange={this.changeConsumption.bind(this, "purchasing_entity")} name="purchasing_entity" value={this.state.purchasing_entity_selectd} required>
                                                <option key="" value="">--Please select-- </option>
                                                {
                                                    this.state.purchasing_entity.map((item, index) => {
                                                        if (item.approval_status === "1") {
                                                            return <option key={item.id} value={item.id}>{item.company_name}</option>
                                                        }
                                                        else {
                                                            return <option disabled key={item.id} value={item.id} style={{ "backgroundColor": "#ccc" }}> {item.company_name}  (Pending) </option>
                                                        }
                                                    })
                                                }
                                            </select>
                                            <div id="purchasing_entity_selectd_message" className="isPassValidate">This filed is required!</div>
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Intake Level</td>
                                    <td>
                                        <select id="intake_level" onChange={this.changeConsumption.bind(this, "intake_level")} name="intake_level" value={this.state.intake_level_selected}>
                                            {
                                                this.state.intake_level.map((it, i) => <option key={i} value={(it.split("(")[1]).split(")")[0]}>{it}</option>)
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">
                                        <span className={this.state.intake_level_selected === "LT" ? "isHide" : "isDisplay"}>*</span>
                                    </abbr>Contracted Capacity</td>
                                    <td>
                                        <input type="text" disabled={this.state.contracted_capacity_disabled} value={this.state.contracted_capacity} onChange={this.changeConsumption.bind(this, "contracted_capacity")} id="contracted_capacity" name="contracted_capacity" onKeyUp={this.removeInputNanNum.bind(this)} required aria-required="true" maxLength="20" />
                                        <div id="contracted_capacity_message" className="isPassValidate">This filed is required!</div>
                                        <div id="contracted_capacity_format" className="isPassValidate">Must be positive integers and first cannot be 0!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">

                                        <div style={{ width: "100%", float: "left" }}>
                                            <div style={{ width: "30%", float: "left" }}>
                                                Premise Address
                                            </div>
                                            <div style={{ width: "70%", float: "left", padding: "5px" }}>
                                                <div id="permise_address_taken_message" className="errormessage">Premise address cannot be duplicated.</div>
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Blk or Unit:</td>
                                    <td><input type="text" value={this.state.blk_or_unit} onChange={this.changeConsumption.bind(this, "blk_or_unit")} id="blk_or_unit" name="blk_or_unit" placeholder="" required aria-required="true" />
                                        <div id="blk_or_unit_message" className="isPassValidate">This filed is required!</div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Street:</td>
                                    <td><input type="text" value={this.state.street} onChange={this.changeConsumption.bind(this, "street")} id="street" name="street" placeholder="" required aria-required="true" />
                                        <div id="street_message" className="isPassValidate">This filed is required!</div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Unit No.:</td>
                                    <td>
                                        <input type="text" value={this.state.unit_number} onChange={this.changeConsumption.bind(this, "unit_number")} id="unit_number" name="unit_number" placeholder="" required aria-required="true" />
                                        <div id="unit_number_message" className="isPassValidate">This filed is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Postal Code:</td>
                                    <td> <input type="text" value={this.state.postal_code} id="postal_code" maxLength="6" name="postal_code" onChange={this.changeConsumption.bind(this, "postal_code")} onKeyUp={this.removeInputPostCode.bind(this)} placeholder="" required aria-required="true" />
                                        <div id="postal_code_message" className="isPassValidate">This filed is required!</div>
                                        <div id="postal_code_format" className="isPassValidate">Postal code must be 6 digit interger.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        Consumption Details
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Total Monthly:</td>
                                    <td>
                                        {/* onKeyUp={this.removeAsInteger.bind(this)} */}
                                        <input type="text" value={this.state.totals} onChange={this.changeConsumption.bind(this, "totals")} id="totals" name="totals" required aria-required="true" maxLength="20" /><div>kWh/month</div>
                                        <div id="totals_message" className="isPassValidate">This filed is required!</div>
                                        {/* <div id="totals_format" className="isPassValidate">Please input an integer greater than 0.</div> */}
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Peak:</td>
                                    <td>
                                        <input type="text" value={this.state.peak_pct} onChange={this.changeConsumption.bind(this, "peak_pct")} id="peak_pct" name="peak_pct" required aria-required="true" maxLength="3" placeholder="0-100" max="100" /> <div>%</div>
                                        <div id="peak_pct_message" className="isPassValidate">This filed is required!</div>
                                        <div id="peak_pct_format" className="isPassValidate">Please input a integer between 0 and 100.</div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;Off-Peak:</td>
                                    <td><input type="text" value={this.state.peak} disabled="true" onChange={this.changeConsumption.bind(this, "pack")} id="pack" required aria-required="true" /><div>%</div></td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp; Upload bill(s)</td>
                                    <td>
                                        <div className="upload">
                                            <UploadFile type="CONSUMPTION_DOCUMENTS" deleteType="consumption" validate={true} showList="1" col_main="12" col_width="9" showWay="1" fileData={this.state.fileData.CONSUMPTION_DOCUMENTS} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
                else {
                    showDetail = <div></div>
                }
            }
        }
        let btn_html = '';
        if (this.state.type == "default") {
            btn_html = <div className="modal_btn"><a onClick={this.closeModal.bind(this)}>OK</a></div>;
        }
        else if
        (this.state.type == "custom") {
            btn_html = <div className="modal_btn">
                <a className="btn" onClick={this.Add.bind(this)}>{this.state.option === "update" ? "Save" : "Add"}</a>
                <a className="btn" onClick={this.closeModal.bind(this)}>Cancel</a>
            </div>
        }
        else if (this.state.type === "defaultCallBack") {
            btn_html = <div className="modal_btn"><a onClick={this.closeModalAndRefresh.bind(this)}>OK</a></div>;
        }
        else if (this.state.type === "chkSelectedBuyers") {
            btn_html =
                <div className="modal_btn"><a onClick={this.Accept.bind(this)}>Proceed</a><a onClick={this.closeModelAndCancelSave.bind(this, 0)}>Cancel</a></div>;
        }
        else {
            btn_html =
                <div className="modal_btn"><a onClick={this.Accept.bind(this)}>Yes</a><a onClick={this.closeModal.bind(this)}>No</a></div>;
        }
        return (
            this.props.formSize === "big" ?
                <div id="modal_main" className={this.state.modalshowhide} style={this.props.modalSize == "big" ? { width: "98%", height: "550", top: "20%", marginLeft: "-49%" } : { width: "700px", top: "20%", marginLeft: "-350px" }} >
                    <h4><a onClick={this.closeModal.bind(this, 1)}>X</a></h4>
                    <div className="modal_detail model_detail_formHeight">
                        <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                    </div>
                    {btn_html}
                </div>
                :
                this.props.formSize === "middle" ?
                    <div id="modal_main" name="middleModal" className={this.state.modalshowhide} style={{ width: "50%", height: "310px", top: "40%", marginLeft: "-25%" }} >
                        <h4><a onClick={this.closeModal.bind(this, 1)}>X</a></h4>
                        <div className="modal_detail model_detail_formHeight">
                            <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                        </div>
                        {btn_html}
                    </div>
                    :
                    this.props.formSize === 'viewlog' ?
                        <div id="modal_main" className={this.state.modalshowhide} style={{ width: "600px", top: "20%", marginLeft: "-300px" }}>
                            <h4><a onClick={this.closeModal.bind(this, 1)}>X</a></h4>
                            <div className="modal_detail">
                                <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                            </div>
                            {btn_html}
                        </div>
                        :
                        <div id="modal_main" className={this.state.modalshowhide} >
                            <h4><a onClick={this.closeModal.bind(this, 0)}>X</a></h4>
                            <div className="modal_detail">
                                <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                            </div>
                            {btn_html}
                            {/* <base target="download"></base> */}
                        </div>
        )
    }
}
