import React, { Component } from 'react';
import { constants } from 'os';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { removeNanNum } from '../../javascripts/componentService/util';
import { validateNum, validateNum4, validateNum10, validateDecimal, validateEmail, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate } from '../../javascripts/componentService/util';
//共通弹出框组件
import { UploadFile } from '../shared/upload';

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalshowhide: "modal_hide",
            type: 'default',
            secondStatus: "live_hide",
            itemIndex: "",
            props_data: {},
            strtype: '',
            email_subject: '',
            email_body: '',
            consumptionItem: [],
            contracted_capacity_disabled: true,
            contract_expiry_disabled: true,
            disabled: false,
            id: "",
            consumptionid: "",
            account_number: '',
            existing_plan: [],
            existing_plan_selected: '',
            contract_expiry: '',
            purchasing_entity: [],
            purchasing_entity_selectd: '',
            premise_address: '',
            intake_level: [],
            intake_level_selected: '',
            contracted_capacity: '',
            blk_or_unit: '',
            street: '',
            unit_number: '',
            postal_code: '',
            totals: '',
            peak_pct: '',
            peak: "",
            option: '',
            isSaved: false,
            uploadUrl: "/api/buyer/user_attachments?file_type=",
            validate: false,
            fileData: {
                "CONSUMPTION_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
        }
    }

    componentWillReceiveProps(next) {
        let fileObj;
        fileObj = this.state.fileData;
        if (next.consumption_account_item) {
            this.setState({
                consumptionid: next.consumption_account_item.id,
                isSaved: next.consumption_account_item.id ? true : false,
                account_number: next.consumption_account_item.account_number,
                existing_plan: next.consumption_account_item.existing_plan,
                existing_plan_selected: next.consumption_account_item.existing_plan_selected,
                contract_expiry: next.consumption_account_item.contract_expiry === "" ? "" : moment(next.consumption_account_item.contract_expiry),
                purchasing_entity: next.consumption_account_item.purchasing_entity,
                purchasing_entity_selectd: next.
                    consumption_account_item.purchasing_entity_selectd ? next.consumption_account_item.purchasing_entity_selectd :
                    next.consumption_account_item.purchasing_entity.length > 0 ? next.consumption_account_item.purchasing_entity[0].id : "",
                premise_address: next.consumption_account_item.premise_address,
                intake_level: next.consumption_account_item.intake_level,
                intake_level_selected: next.consumption_account_item.intake_level_selected,
                contracted_capacity: next.consumption_account_item.contracted_capacity ? parseInt(next.consumption_account_item.contracted_capacity) : "",
                blk_or_unit: next.consumption_account_item.blk_or_unit,
                street: next.consumption_account_item.street,
                unit_number: next.consumption_account_item.unit_number,
                postal_code: next.consumption_account_item.postal_code,
                totals: next.consumption_account_item.totals ? parseInt(next.consumption_account_item.totals) : "",
                peak_pct: next.consumption_account_item.peak_pct,
                peak: next.consumption_account_item.peak_pct ? (100 - parseFloat(next.consumption_account_item.peak_pct)) : "",
                option: next.consumption_account_item.option
            });

            if (next.consumption_account_item.file_name) {
                let obj = {
                    id: next.consumption_account_item.id,
                    file_name: next.consumption_account_item.file_name,
                    file_path: next.consumption_account_item.file_path
                }
                fileObj["CONSUMPTION_DOCUMENTS"][0].files.push(obj);
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

            if (next.consumption_account_item.existing_plan_selected === "Retailer plan") {
                this.setState({
                    contract_expiry_disabled: false
                })
            }
            else {
                this.setState({
                    contract_expiry_disabled: true
                })
            }
            if (next.consumption_account_item.intake_level_selected === "LT") {
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
        $("#permise_address_taken_message").removeClass("errormessage").addClass('isPassValidate');
        $("#account_number_taken_message").removeClass("errormessage").addClass('isPassValidate');
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
            modalshowhide: "modal_show",
            props_data: data ? data : {}
        })
        if (data) {
            if (data.subject && data.body) {
                this.setState({
                    email_subject: data.subject,
                    email_body: data.body
                })
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
        if (this.state.strtype === "email_template") {
            let data = this.state.props_data;
            data.subject = this.state.email_subject;
            data.body = this.state.email_body;
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

    checkModelSuccess(event) {
        // event.preventDefault();
        let flag = true, hasDoc = true;
        let validateItem = {
            peak_pct: { cate: 'decimal' },
            totals: { cate: 'num10' },
            postal_code: { cate: 'required' },
            unit_number: { cate: 'required' },
            street: { cate: 'required' },
            blk_or_unit: { cate: 'required' },
            contracted_capacity: { cate: 'num4' },
            contract_expiry: { cate: 'required' },
            account_number: { cate: 'required' }
        }
        if (this.state.existing_plan_selected !== "Retailer plan") {
            delete validateItem.contract_expiry;
        }
        if (this.state.intake_level_selected === "LT") {
            delete validateItem.contracted_capacity;
        }
        let validateResult = validator_Object(this.state, validateItem);
        flag = validateResult.length > 0 ? false : true;
        if (flag) {
            let status = this.account_address_repeat();
            switch (status) {
                case 'false|true':
                    $("#permise_address_taken_message").removeClass("isPassValidate").addClass('errormessage');
                    $("#account_number_taken_message").removeClass("errormessage").addClass('isPassValidate');
                    $("#permise_address").focus();
                    break;
                case 'true|false':
                    $("#permise_address_taken_message").removeClass("errormessage").addClass('isPassValidate');
                    $("#account_number_taken_message").removeClass("isPassValidate").addClass('errormessage');
                    $("#account_number").focus();
                    break;
                case 'true|true':
                    $("#permise_address_taken_message").removeClass("isPassValidate").addClass('errormessage');
                    $("#account_number_taken_message").removeClass("isPassValidate").addClass('errormessage');
                    $("#account_number").focus();
                    break;
                default:
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
        }
    }

    removeNanNum(value) {
        value.target.value = value.target.value.replace(/\.{2,}/g, ".");
        value.target.value = value.target.value.replace(/[^\d.]/g, "");
        value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (value.target.value.indexOf(".") < 0 && value.target.value != "") {
            value.target.value = parseFloat(value.target.value);
        }
    }
    getFormsValue() {
        let siteItem = {
            consumptionid: this.state.consumptionid ? this.state.consumptionid : "",
            account_number: this.state.account_number,
            existing_plan_selected: this.state.existing_plan_selected,
            contract_expiry: this.state.contract_expiry ? this.state.contract_expiry : "",
            purchasing_entity_selectd: this.state.purchasing_entity_selectd,
            intake_level_selected: this.state.intake_level_selected,
            contracted_capacity: this.state.contracted_capacity,
            blk_or_unit: this.state.blk_or_unit,
            street: this.state.street,
            unit_number: this.state.unit_number,
            postal_code: this.state.postal_code,
            totals: this.state.totals,
            peak_pct: this.state.peak_pct,
            index: this.state.itemIndex,
            user_attachment_id: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].id : "",
            file_name: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].file_name : "",
            file_path: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].file_path : ""
        }
        return siteItem;
    }

    modifySiteListInLocal() {
        let siteItem = this.getFormsValue();
        let entity = this.state.consumptionItem;
        if (this.state.itemIndex >= 0) {
            entity[this.state.itemIndex] = siteItem;
        } else {

            entity.push(siteItem);
        }
        this.setState({
            consumptionItem: entity
        })
    }

    account_address_repeat() {
        let address = false, account = false, editNotSave = false;
        let address_count = 0, account_count = 0;
        this.state.consumptionItem.map((item, index) => {
            if (this.state.option === 'update') {
                if (item.id) {
                    if ((this.state.unit_number == item.unit_number) && (this.state.postal_code == item.postal_code) && (this.state.consumptionid !== item.id)) {
                        address_count++;
                    }
                    if (this.state.account_number === item.account_number && (this.state.consumptionid !== item.id)) {
                        account_count++;
                    }
                }
                else {
                    if ((this.state.unit_number === item.unit_number) && (this.state.postal_code === item.postal_code)) {
                        if (index != this.state.itemIndex) {
                            address_count++;
                        }
                    }
                    if (this.state.account_number === item.account_number) {
                        if (index != this.state.itemIndex ) {
                            account_count++;
                        }
                    }
                }
            }
            else {
                if ((this.state.unit_number === item.unit_number) && (this.state.postal_code === item.postal_code)) {
                    address_count++;
                }
                if (this.state.account_number === item.account_number) {
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

    Add() {
        this.checkModelSuccess();
    }

    addToMainForm() {
        let siteItem = {
            consumptionid: this.state.consumptionid ? this.state.consumptionid : "",
            account_number: this.state.account_number,
            existing_plan_selected: this.state.existing_plan_selected,
            contract_expiry: this.state.contract_expiry ? this.state.contract_expiry : "",
            purchasing_entity_selectd: this.state.purchasing_entity_selectd,
            intake_level_selected: this.state.intake_level_selected,
            contracted_capacity: this.state.contracted_capacity,
            blk_or_unit: this.state.blk_or_unit,
            street: this.state.street,
            unit_number: this.state.unit_number,
            postal_code: this.state.postal_code,
            totals: this.state.totals,
            peak_pct: this.state.peak_pct,
            index: this.state.itemIndex,
            user_attachment_id: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].id : "",
            file_name: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].file_name : "",
            file_path: this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files.length > 0 ? this.state.fileData["CONSUMPTION_DOCUMENTS"][0].files[0].file_path : ""
        }
        if (this.props.acceptFunction) {
            this.props.acceptFunction(siteItem);
            this.setState({
                modalshowhide: "modal_hide"
            })
        }
    }


    changeConsumption(type, e) {
        let value = e.target.value;
        switch (type) {
            case "consumptionid":
                this.setState({
                    consumptionid: value
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
                    contract_expiry: value
                })
                changeValidate('contract_expiry', value);
                break;
            case "purchasing_entity":
                this.setState({
                    purchasing_entity_selectd: value
                })
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
                this.setState({
                    contracted_capacity: value
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
                changeValidate('postal_code', value);
                break;
            case "totals":
                this.setState({
                    totals: value
                })
                if (!validateNum4(value)) {
                    setValidationFaild('totals', 2)
                } else {
                    setValidationPass('totals', 2)
                }
                break;
            case "peak_pct":
                this.setState({
                    peak_pct: value
                })
                if (!validateDecimal(value)) {
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
                        peak: ""
                    })
                }
                break;
        }
    }

    removefile(type, index, id) {
        if (confirm("Are you sure you want to delete this file?")) {
            if (this.props.otherFunction) {
                this.props.otherFunction(type, index, id)
            }
        }
    }
    Change(type, e) { }

    closeModal() {
        this.setState({
            modalshowhide: "modal_hide"
        })
    }

    closeModalAndRefresh() {
        if (this.props.acceptFunction) {
            this.props.acceptFunction('refrsesh');
            this.closeModal();
        }
    }
    dateChange(data) {
        this.setState({
            contract_expiry: data
        })
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
            if (this.props.listdetailtype === 'Documents Message') {
                showDetail = <ul className="showdetail">
                    <li>Please upload the following documentations:</li>
                    <li>1) A print-out of this <a href={this.props.attatchment} className="urlStyle" target="_blank">Letter of Authorisation</a>, together with the Applicant's signature and Company Stamp.</li>
                    <li>2a) Your company's Accounting & Corporate Regulatory Authority (ACRA) Business Profile.</li>
                    <li>or</li>
                    <li>2b) Your company's Certificate of Incorporation if you are not registered with Accounting & Corporate Regulatory Authority (ACRA).</li>
                    <li>3) Directors' Resolution authorising the Authorised Representative to transact for and on behalf of the Company in this platform.</li>
                    <li>4) A copy of the Applicant's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>5) A copy of the Authorised Representative's NRIC/Employment pass (Front Side only) or Passport Particulars Page.</li>
                    <li>All supporting documents submitted should be in English only.</li>
                </ul>
            }
            if (this.props.listdetailtype === 'consumption_detail') {
                if (this.props.consumption_account_item !== null) {
                    showDetail = <div className=" admin_invitation validate_message">
                        <h3 className="text_padding_left">My Account Information</h3>
                        <table className="consumption_table  u-mb3" cellPadding="0" cellSpacing="0" style={{ marginTop: "15px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "30%" }}><abbr title="required">*</abbr>Account No.</td>
                                    <td style={{ width: "70%" }}>
                                        <div className="isHide">
                                            <input type="text" value={this.state.consumptionid} onChange={this.changeConsumption.bind(this, "consumptionid")} id="id" name="id" />
                                        </div>
                                        <input type="text" value={this.state.account_number} onChange={this.changeConsumption.bind(this, "account_number")} id="account_number" name="account_number" required aria-required="true" />
                                        <div id="account_number_message" className="isPassValidate">This filed is required!</div>
                                        <div id="account_number_taken_message" className="errormessage">There is already an existing contract for this Account Number.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Existing Plan</td>
                                    <td>
                                        <select id="existing_plan" onChange={this.changeConsumption.bind(this, 'existing_plan')} name="existing_plan" value={this.state.existing_plan_selected}>
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
                                        <DatePicker selected={this.state.contract_expiry} className="date_ico" disabled={this.state.contract_expiry_disabled} onKeyDown={this.noPermitInput.bind(this)} ref="contract_expiry" shouldCloseOnSelect={true} name="contract_expiry" minDate={moment()} required aria-required="true" dateFormat="DD-MM-YYYY" selectsStart onChange={this.dateChange.bind(this)} title="Time must not be in the past." />
                                        <div id="contract_expiry_message" className="isPassValidate">This filed is required!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><abbr title="required">*</abbr>Purchasing Entity</td>
                                    <td>
                                        <select id="purchasing_entity" onChange={this.changeConsumption.bind(this, "purchasing_entity")} name="purchasing_entity" value={this.state.purchasing_entity_selectd} required>
                                            {
                                                this.state.purchasing_entity.map(item => {
                                                    return <option key={item.id} value={item.id}>{item.company_name}</option>
                                                })
                                            }
                                        </select>
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
                                    </abbr>Contract Capacity</td>
                                    <td>
                                        <input type="text" disabled={this.state.contracted_capacity_disabled} value={this.state.contracted_capacity} onChange={this.changeConsumption.bind(this, "contracted_capacity")} id="contracted_capacity" name="contracted_capacity" onKeyUp={this.removeNanNum.bind(this)} required aria-required="true" maxLength="10" />
                                        <div id="contracted_capacity_message" className="isPassValidate">This filed is required!</div>
                                        <div id="contracted_capacity_format" className="isPassValidate">Must be positive integers,and first cannot be 0!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">

                                        <div style={{ width: "100%", float: "left" }}>
                                            <div style={{ width: "30%", float: "left" }}>
                                                Premise Address
                                            </div>
                                            <div style={{ width: "70%", float: "left", padding: "5px" }}>
                                                <div id="permise_address_taken_message" className="errormessage">There is already an existing contract for this Premise Address.</div>
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
                                    <td> <input type="text" value={this.state.postal_code} id="postal_code" name="postal_code" onChange={this.changeConsumption.bind(this, "postal_code")} placeholder="" required aria-required="true" />
                                        <div id="postal_code_message" className="isPassValidate">This filed is required!</div>
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
                                        <input type="text" value={this.state.totals} onChange={this.changeConsumption.bind(this, "totals")} id="totals" name="totals" onKeyUp={this.removeNanNum.bind(this)} required aria-required="true" maxLength="10" /><div>kWh/month</div>
                                        <div id="totals_message" className="isPassValidate">This filed is required!</div>
                                        <div id="totals_format" className="isPassValidate">Must be positive integers,and first cannot be 0!</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;<abbr title="required">*</abbr>Peak:</td>
                                    <td>
                                        <input type="text" value={this.state.peak_pct} onChange={this.changeConsumption.bind(this, "peak_pct")} id="peak_pct" name="peak_pct" onKeyUp={this.removeNanNum.bind(this)} required aria-required="true" maxLength="5" placeholder="0-100" /> <div>%</div>
                                        <div id="peak_pct_message" className="isPassValidate">This filed is required!</div>
                                        <div id="peak_pct_format" className="isPassValidate">Please input bigger than 0 and less than 100!</div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;Off-Peak:</td>
                                    <td><input type="text" value={this.state.peak} disabled="true" onChange={this.changeConsumption.bind(this, "pack")} id="pack" required aria-required="true" /><div>%(auot calculate)</div></td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp; Upload bill(s)</td>
                                    <td>
                                        <div className="upload">
                                            <UploadFile type="CONSUMPTION_DOCUMENTS" showlist={false} validate={true} showList="1" col_width="9" showWay="2" fileData={this.state.fileData.CONSUMPTION_DOCUMENTS} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
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
                <a onClick={this.Add.bind(this)}>{this.state.option === "update" ? "Save" : "Add"}</a>
                <a onClick={this.closeModal.bind(this)}>Cancel</a>
            </div>
        }
        else if (this.state.type === "defaultCallBack") {
            btn_html = <div className="modal_btn"><a onClick={this.closeModalAndRefresh.bind(this)}>OK</a></div>;
        }
        else {
            btn_html =
                <div className="modal_btn"><a onClick={this.Accept.bind(this)}>Yes</a><a onClick={this.closeModal.bind(this)}>No</a></div>;
        }
        return (
            this.props.formSize === "big" ?
                <div id="modal_main" className={this.state.modalshowhide} style={{ width: "700px", top: "20%", left: "40%" }} >
                    <h4><a onClick={this.closeModal.bind(this)}>X</a></h4>
                    <div className="modal_detail model_detail_formHeight">
                        <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                    </div>
                    {btn_html}
                </div>
                :
                <div id="modal_main" className={this.state.modalshowhide} >
                    <h4><a onClick={this.closeModal.bind(this)}>X</a></h4>
                    <div className="modal_detail">
                        <div className="modal_detail_nr">{this.props.text ? this.do_text(this.props.text) : ''}</div>{showDetail}
                    </div>
                    {btn_html}
                </div>
        )
    }
}