import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Modal } from '../shared/show-modal';
import { DoFillConsumption } from './fill-consumption'
import marketImg from '../../images/marketinsights.png'
import { getBuyerParticipate, setBuyerParticipate } from '../../javascripts/componentService/common/service';
import moment from 'moment';
import { formatPower } from './../../javascripts/componentService/util'
import loadingPic from '../../images/loading.gif'
export class FillConsumption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            submit_type: "",
            delete_type: "",
            site_list: [],
            preDayList: [],
            preOtherList: [],
            totalList: [],
            purchasing_entity: [],
            disabled: '',
            checked: false,
            name: "",
            time: "",
            contact_start_date: "",
            buyer_link: "",
            seller_link: "",
            contract_duration: "",
            durationList: [],
            durtioanItem: "",
            account_detail: this.accountItem,
            account_list: [],
            contract_capacity_disabled: true,
            contract_expiry_disabled: true,
            dateIssuecount: 0,
            consumption_id: 0,
            advisory: "",
            isValidate: false,
            takenList: []
        }

        this.accountItem = {
            account_number: '',
            existing_plan: ['SPS tariff', 'SPS wholesale', 'Retailer plan'],
            existing_plan_selected: 'SPS tariff',
            contract_expiry: '',
            purchasing_entity: this.purchaseList,
            purchasing_entity_selectd: '',
            premise_address: '',
            intake_level: ['Low Tension (LT)', 'High Tension Small (HTS)', 'High Tension Large (HTL)', 'Extra High Tension (EHT)'],
            intake_level_selected: 'LT',
            contracted_capacity: '',
            blk_or_unit: '',
            street: '',
            unit_number: '',
            postal_code: '',
            totals: '',
            peak_pct: '',
            peak: '',
            off_peak: '',
            file_path: "",
            file_name: "",
            attachId: "",
            attachment_ids: '',
            id: 0,
            consumption_id: 0,
            orignal_id: 0,
            cid: Math.floor((Math.random() * 10000) + 1),
            option: 'insert',
            cate_type: ""
        };
        this.purchaseList = [];
    }

    componentWillMount() {
        this.setState({
            consumption_id: (window.location.href.split("consumptions/")[1]).split("/edit")[0]
        })
    }

    componentDidMount() {
        this.BuyerParticipateList();
    }

    BuyerParticipateList() {
        getBuyerParticipate('/api/buyer/consumption_details?consumption_id=' + this.state.consumption_id).then((res) => {
            this.site_list = res.consumption_details;
            this.status = res.consumption.participation_status === '1' ? "Confirmed" :
                (res.consumption.participation_status === '2' ? "Pending" : "Rejected")

            this.setState({
                name: res.auction.name,
                time: res.auction.actual_begin_time,
                contact_start_date: res.auction.contract_period_start_date,
                contract_duration: res.consumption.contract_duration ? res.consumption.contract_duration : "",
                buyer_link: res.buyer_revv_tc_attachment ? res.buyer_revv_tc_attachment.file_path : "",
                seller_link: res.seller_buyer_tc_attachment ? res.seller_buyer_tc_attachment.file_path : "",
                advisory: res.advisory.content,

            })
            if (res.consumption.participation_status === '1' || res.auction.publish_status === "1") {
                $("input[type='checkbox']").attr("checked", true);

                this.setState({
                    disabled: 'disabled',
                    checked: true,
                })

            }
            if (res.contract_duration) {
                this.setState({
                    durationList: res.contract_duration
                })
            }
            if (res.buyer_entities) {
                this.purchaseList = res.buyer_entities;
            }
            if (res.consumption_details.length > 0) {
                let list = res.consumption_details;
                list.map(item => {
                    item.entityName = this.getPurchase(item.company_buyer_entity_id);
                })
                this.setState({ site_list: list });
            }
            if (res.consumption_details_last_day.length > 0) {

                let list = res.consumption_details_last_day;
                list.map(item => {
                    item.entityName = this.getPurchase(item.company_buyer_entity_id);
                })
                this.setState({ preDayList: list })
            }
            if (res.consumption_details_before_yesterday.length > 0) {
                let list = res.consumption_details_before_yesterday;
                list.map(item => {
                    item.entityName = this.getPurchase(item.company_buyer_entity_id);
                })
                this.setState({ preOtherList: list })
            }
            this.setState({
                totalList: []
            })
            let total = this.state.totalList.concat(res.consumption_details).concat(res.consumption_details_last_day).concat(res.consumption_details_before_yesterday);
            this.setState({
                totalList: total
            })

            if (this.state.checked) {
                $(".btnOption").css("pointer-events", "none").css({ "color": "#999", "background": "#666" });
            }
            let dis = false;
            if ((res.consumption.participation_status === "1" || res.consumption.accept_status === "1") && this.state.site_list.length === 0) {
                dis = true;
            }
            else {
                dis = false;
            }
            this.setState({
                isValidate: dis
            })
        }, (error) => {
            this.refs.Modal.showModal();
            this.setState({ text: "Interface failed" });
        })


    }
    // edit and add account

    add_site() {
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
        this.accountItem.id = "";
        this.accountItem.orignal_id = "";
        this.accountItem.consumption_id = this.state.consumption_id;
        this.accountItem.account_number = "";
        this.accountItem.existing_plan = ['SPS tariff', 'SPS wholesale', 'Retailer plan'];
        this.accountItem.existing_plan_selected = "SPS tariff";
        this.accountItem.contract_expiry = "";
        this.accountItem.purchasing_entity = this.purchaseList;
        this.accountItem.purchasing_entity_selectd = "";
        this.accountItem.intake_level = ['Low Tension (LT)', 'High Tension Small (HTS)', 'High Tension Large (HTL)', 'Extra High Tension (EHT)'];
        this.accountItem.intake_level_selected = "LT";
        this.accountItem.contracted_capacity = "";
        this.accountItem.blk_or_unit = "";
        this.accountItem.street = "";
        this.accountItem.unit_number = "";
        this.accountItem.postal_code = "";
        this.accountItem.totals = "";
        this.accountItem.peak_pct = "";
        this.accountItem.attachmentUrl = "";
        this.accountItem.attachId = "";
        this.accountItem.file_path = "";
        this.accountItem.file_name = "";
        this.accountItem.attachment_ids = "";
        this.accountItem.option = 'add';
        this.accountItem.cate_type = "current";
        this.setState({
            account_detail: this.accountItem,
            text: " "
        })
        $("#account_number").focus();
        this.refs.consumption.showModal('custom', {}, '', '-1')
    }

    // edit an account information
    edit_site(item, index, type) {

        this.setState({ account_detail: {} });
        this.accountItem = {};
        this.accountItem.id = item.id !== null ? item.id : "";//consumption detial  id
        this.accountItem.orignal_id = item.orignal_id !== null ? item.orignal_id : "";
        this.accountItem.consumption_id = this.state.consumption_id; //consumptions id
        this.accountItem.account_number = item.account_number;
        this.accountItem.existing_plan = ['SPS tariff', 'SPS wholesale', 'Retailer plan'];
        this.accountItem.existing_plan_selected = item.existing_plan !== null ? item.existing_plan : "";
        this.accountItem.contract_expiry = item.contract_expiry ? moment(item.contract_expiry) : "";
        this.accountItem.purchasing_entity = this.purchaseList;
        this.accountItem.purchasing_entity_selectd = item.company_buyer_entity_id;
        this.accountItem.intake_level = ['Low Tension (LT)', 'High Tension Small (HTS)', 'High Tension Large (HTL)', 'Extra High Tension (EHT)'];
        this.accountItem.intake_level_selected = item.intake_level;
        this.accountItem.contracted_capacity = item.contracted_capacity;
        this.accountItem.blk_or_unit = item.blk_or_unit;
        this.accountItem.street = item.street;
        this.accountItem.unit_number = item.unit_number;
        this.accountItem.postal_code = item.postal_code;
        this.accountItem.totals = item.totals;
        this.accountItem.peak_pct = parseInt(Math.round(item.peak_pct));
        this.accountItem.peak = 10;
        this.accountItem.attachment_ids = item.user_attachment;
        this.accountItem.option = 'update';
        if (type === "current") {
            this.accountItem.cate_type = "current";
        }
        else if (type === "preDay") {
            this.accountItem.cate_type = "preDay";
        }
        else {
            this.accountItem.cate_type = "preOthers";
        }
        this.setState({
            text: " ",
            account_detail: this.accountItem
        })
        $("#account_number").focus();
        this.refs.consumption.showModal('custom', {}, '', index)
    }
    changeSiteList(val, index) {
        let list = this.state.site_list;
        this.site_list[index].intake_level_selected = val;
        this.setState({ site_list: list })
    }

    //when user finished adding a new account, list page will add/update the new account information.
    doAddAccountAction(siteInfo) {
        let item = {
            id: siteInfo.id ? siteInfo.id : "",
            orignal_id: siteInfo.orignal_id ? siteInfo.orignal_id : "",
            consumption_id: siteInfo.consumption_id,
            account_number: siteInfo.account_number,
            existing_plan: siteInfo.existing_plan_selected,
            contract_expiry: siteInfo.contract_expiry ? moment(siteInfo.contract_expiry) : "",
            company_buyer_entity_id: siteInfo.purchasing_entity_selectd,
            entityName: this.getPurchase(siteInfo.purchasing_entity_selectd),
            intake_level: siteInfo.intake_level_selected,
            contracted_capacity: siteInfo.contracted_capacity,
            blk_or_unit: siteInfo.blk_or_unit,
            street: siteInfo.street,
            unit_number: siteInfo.unit_number,
            postal_code: siteInfo.postal_code,
            totals: siteInfo.totals,
            peak_pct: parseInt(Math.round(siteInfo.peak_pct)),
            attachment_ids: siteInfo.attachment_ids,
            user_attachment: siteInfo.user_attachment,
        };

        if (siteInfo.cate_type === "current") {
            let entity = this.state.site_list;
            if (siteInfo.index >= 0) {
                entity[siteInfo.index] = item;
            }
            else {
                entity.push(item)
            }
            this.setState({
                site_list: entity
            })
        }
        else if (siteInfo.cate_type === "preDay") {
            let entity = this.state.preDayList;
            if (siteInfo.index >= 0) {
                entity[siteInfo.index] = item;
            }
            else {
                entity.push(item)
            }
            this.setState({
                preDayList: entity
            })
        }
        else {
            let entity = this.state.preOtherList;
            if (siteInfo.index >= 0) {
                entity[siteInfo.index] = item;
            }
            else {
                entity.push(item)
            }
            this.setState({
                preOtherList: entity
            })
            this.clearNullError(siteInfo.index);
        }
        this.setState({
            totalList: []
        })
        let total = this.state.totalList.concat(this.state.site_list).concat(this.state.preDayList).concat(this.state.preOtherList);
        this.setState({
            totalList: total
        })
    }

    remove_site(index, type) {
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }           //{ action: 'reject', type: 'user' }

        this.deleteNum = index;
        this.refs.Modal.showModal("comfirm");
        this.setState({ text: "Are you sure you want to delete ?", submit_type: "delete", delete_type: type });
    }

    doSave(type) {
        $("#bg").show();
        $("#show").show();
        let makeData = {},
            buyerlist = [], yesterday = [], beforeYesterda = [];
        this.state.site_list.map((item, index) => {
            let siteItem = {
                account_number: item.account_number,
                existing_plan: item.existing_plan,
                contract_expiry: item.contract_expiry ? moment(item.contract_expiry).format() : "",
                company_buyer_entity_id: item.company_buyer_entity_id,
                intake_level: item.intake_level,
                contracted_capacity: item.contracted_capacity,
                blk_or_unit: item.blk_or_unit,
                street: item.street,
                unit_number: item.unit_number,
                postal_code: item.postal_code,
                totals: item.totals,
                peak_pct: item.peak_pct,
                user_attachment_id: item.user_attachment_id,
                attachment_ids: item.attachment_ids,
                user_attachment: item.user_attachment,
                id: item.id,
                orignal_id: item.orignal_id

            }
            buyerlist.push(siteItem);
        })
        this.state.preDayList.map((item, index) => {
            let siteItem = {
                account_number: item.account_number,
                existing_plan: item.existing_plan,
                contract_expiry: item.contract_expiry ? moment(item.contract_expiry).format() : "",
                company_buyer_entity_id: item.company_buyer_entity_id,
                intake_level: item.intake_level,
                contracted_capacity: item.contracted_capacity,
                blk_or_unit: item.blk_or_unit,
                street: item.street,
                unit_number: item.unit_number,
                postal_code: item.postal_code,
                totals: item.totals,
                peak_pct: item.peak_pct,
                user_attachment_id: item.user_attachment_id,
                attachment_ids: item.attachment_ids,
                user_attachment: item.user_attachment,
                id: item.id,
                orignal_id: item.orignal_id
            }
            yesterday.push(siteItem);
        })
        this.state.preOtherList.map((item, index) => {
            let siteItem = {
                account_number: item.account_number,
                existing_plan: item.existing_plan,
                contract_expiry: item.contract_expiry ? moment(item.contract_expiry).format() : "",
                company_buyer_entity_id: item.company_buyer_entity_id,
                intake_level: item.intake_level,
                contracted_capacity: item.contracted_capacity,
                blk_or_unit: item.blk_or_unit,
                street: item.street,
                unit_number: item.unit_number,
                postal_code: item.postal_code,
                totals: item.totals,
                peak_pct: item.peak_pct,
                user_attachment_id: item.user_attachment_id,
                attachment_ids: item.attachment_ids,
                user_attachment: item.user_attachment,
                id: item.id,
                orignal_id: item.orignal_id
            }
            beforeYesterda.push(siteItem);
        })

        makeData = {
            consumption_id: this.state.consumption_id,
            details: JSON.stringify(buyerlist),
            details_yesterday: JSON.stringify(yesterday),
            details_before_yesterday: JSON.stringify(beforeYesterda),
            contract_duration: $("#selDuration").val()
        }

        setBuyerParticipate(makeData, '/api/buyer/consumption_details/save').then((res) => {
            $("#bg").hide();
            $("#show").hide();
            if (type != "participate") {
                if (type == "delete") {
                    this.setState({ text: "Delete successful!" });
                } else {

                    if (res.result === 'success') {
                        this.setState({ text: "Save successful!" });
                        setTimeout(() => {
                            window.location.href = "/buyer/consumptions/" + this.state.consumption_id + "/edit";
                        }, 2000)
                        this.refs.Modal.showModal();
                    }
                    else {
                        this.validateTaken(res)
                    }
                }

            } else {
                setBuyerParticipate(makeData, '/api/buyer/consumption_details/participate').then((res) => {
                    if (res.result === 'success') {
                        this.setState({
                            disabled: 'disabled',
                            checked: true,
                        })
                        this.refs.Modal.showModal();
                        this.setState({ text: "Your Purchase Order has been submitted to Admin for verification. Once verified, you will receive a notification to confirm your participation in this Reverse Auction." });
                        setTimeout(() => {
                            window.location.href = "/buyer/auctions";
                        }, 3000)
                    }
                    else {
                        this.validateTaken(res);
                    }

                }, (error) => {
                    $("#bg").hide();
                    $("#show").hide();
                    this.refs.Modal.showModal();
                    this.setState({ text: "Interface failed" });
                })
            }
        }, (error) => {
            $("#bg").hide();
            $("#show").hide();
            this.refs.Modal.showModal();
            this.setState({ text: "Interface failed" });
        })
    }

    validateTaken(res) {
        let account_list = [];
        if (res.errors.length > 0) {
            res.errors.map(item => {
                if (item.type === "category_1") {
                    item.error_details.map(it => {
                        account_list.push(it.account_number)
                        $("#cate1 tr:eq(" + it.index + ") td:eq(0)").find("div").removeClass("commonBorder").addClass("redBorder");
                        $("#cate1 tr:eq(" + it.index + ") td:eq(0)").find("div").attr("name", "isRed")
                    })
                }
                if (item.type === "category_2") {
                    item.error_details.map(it => {
                        account_list.push(it.account_number)
                        $("#cate2 tr:eq(" + it.index + ") td:eq(0)").find("div").removeClass("commonBorder").addClass("redBorder");
                        $("#cate2 tr:eq(" + it.index + ") td:eq(0)").find("div").attr("name", "isRed")
                    })
                }
                if (item.type === "new") {
                    item.error_details.map(it => {
                        account_list.push(it.account_number)
                        $("#cate3 tr:eq(" + it.index + ") td:eq(0)").find("div").removeClass("commonBorder").addClass("redBorder");
                        $("#cate3 tr:eq(" + it.index + ") td:eq(0)").find("div").attr("name", "isRed")
                    })
                }
            })
            this.setState({
                takenList: account_list,
                text: ""
            })
            this.refs.accountTaken.showModal();
        }
    }

    doAccept() {
        if (this.state.submit_type === "Reject") { //do Reject
            $("#bg").show();
            $("#show").show();
            setBuyerParticipate({ consumption_id: this.state.consumption_id }, '/api/buyer/consumption_details/reject').then((res) => {
                $("#bg").hide();
                $("#show").hide();
                this.refs.Modal.showModal();
                this.setState({ text: "Thank you for the confirmation. You have rejected this auction." });
                setTimeout(() => {
                    window.location.href = "/buyer/auctions";
                }, 3000)
            }, (error) => {
                $("#bg").hide();
                $("#show").hide();
                this.refs.Modal.showModal();
                this.setState({ text: "Interface failed" });
            })
        } else if (this.state.submit_type === "Participate") { //do Participate
            this.doSave('participate');
        } else if (this.state.submit_type === "delete") {
            if (this.state.delete_type === "preDay") {
                const site_listObj = this.state.preDayList;
                site_listObj.splice(this.deleteNum, 1);
                this.setState({ preDayList: site_listObj });
                setTimeout(() => {
                    let count = 0;
                    for (let i = 0; i < this.state.preDayList.length; i++) {
                        let classborder = $("#cate1 tr:eq(" + i + ") td:eq(0)").find("div").attr("class");
                        if (classborder === 'redBorder') {
                            count++
                        }
                    }
                    if (count > 0) {
                        for (let i = 0; i < this.state.preDayList.length; i++) {
                            let name = $("#cate1 tr:eq(" + i + ") td:eq(0)").find("div").attr("name");
                            if (name === 'isRed') {
                                $("#cate1 tr:eq(" + i + ") td:eq(0)").find("div").removeClass('commonBorder').addClass('redBorder')
                            }
                        }
                    }
                });
            }
            else if (this.state.delete_type === "preOthers") {
                const site_listObj = this.state.preOtherList;
                site_listObj.splice(this.deleteNum, 1);
                this.setState({ preOtherList: site_listObj });
                setTimeout(() => {
                    let count = 0;
                    for (let i = 0; i < this.state.preOtherList.length; i++) {
                        let classborder = $("#cate2 tr:eq(" + i + ") td:eq(1)").find("div").attr("class");
                        if (classborder === 'redBorder') {
                            count++
                        }
                    }
                    if (count > 0) {
                        this.clearAllError();
                        this.validateIsNull();
                    }
                    let count_c2 = 0;
                    for (let i = 0; i < this.state.site_list.length; i++) {
                        let classborder = $("#cate2 tr:eq(" + i + ") td:eq(0)").find("div").attr("class");
                        if (classborder === 'redBorder') {
                            count_c2++
                        }
                    }
                    if (count_c2 > 0) {
                        for (let i = 0; i < this.state.site_list.length; i++) {
                            let name = $("#cate2 tr:eq(" + i + ") td:eq(0)").find("div").attr("name");
                            if (name === 'isRed') {
                                $("#cate2 tr:eq(" + i + ") td:eq(0)").find("div").removeClass('commonBorder').addClass('redBorder')
                            }
                        }
                    }
                });
            }
            else {
                const site_listObj = this.state.site_list;
                site_listObj.splice(this.deleteNum, 1);
                this.setState({ site_list: site_listObj });
                setTimeout(() => {
                    let count = 0;
                    for (let i = 0; i < this.state.site_list.length; i++) {
                        let classborder = $("#cate3 tr:eq(" + i + ") td:eq(0)").find("div").attr("class");
                        if (classborder === 'redBorder') {
                            count++
                        }
                    }
                    if (count > 0) {
                        for (let i = 0; i < this.state.site_list.length; i++) {
                            let name = $("#cate3 tr:eq(" + i + ") td:eq(0)").find("div").attr("name");
                            if (name === 'isRed') {
                                $("#cate3 tr:eq(" + i + ") td:eq(0)").find("div").removeClass('commonBorder').addClass('redBorder')
                            }
                        }
                    }
                });



            }
            this.setState({
                totalList: []
            })
            let total = this.state.totalList.concat(this.state.site_list).concat(this.state.preDayList).concat(this.state.preOtherList);
            this.setState({
                totalList: total
            })

        }
    }

    doSubmit(type) {
        if (type === "return") {
            return false;
        }
        this.setState({ submit_type: type });
        if (type === "Reject") {
            this.refs.Modal.showModal("comfirm");
            this.setState({ text: "Are you sure you want to reject this auction?" });
        }
    }


    // validate the page required field and  contact expiry date.
    checkSuccess(event) {
        event.preventDefault();
        this.validateIsNull();
        let isNotNull = this.validateListComplete();

        if (isNotNull) {
            let totalList = this.state.site_list.concat(this.state.preDayList).concat(this.state.preOtherList);
            let count = this.dateCompare(totalList);
            this.setState({
                dateIssuecount: count
            })
            if (count > 0) {
                if ($("#div_warning").is(":visible")) {
                    if ($("#chk_Warning").is(":checked")) {
                        this.passValidateSave();
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                this.passValidateSave();
            }
        }
        else {
            this.setState({
                text: "Please complete all required fields."
            })
            this.refs.Modal.showModal()
        }
    }

    validateIsNull() {
        for (let i = 0; i < this.state.preOtherList.length; i++) {
            if (this.state.preOtherList[i].existing_plan === "" || this.state.preOtherList[i].existing_plan === null) {
                $("#cate2 tr:eq(" + i + ") td:eq(1)").find("div").removeClass("commonBorder").addClass("redBorder");
            }
        }
    }

    clearNullError(i) {
        $("#cate2 tr:eq(" + i + ") td:eq(1)").find("div").removeClass("redBorder").addClass("commonBorder");
    }

    clearAllError() {
        $("#cate2").find("tr").each(function () {
            $(this).children('td').each(function (j) {
                $(this).find("div").removeClass("redBorder").addClass("commonBorder");
            })
        });
    }


    validateListComplete() {
        let flag_current = true, flag_yesterday = true, flag_before_yesterday = true;
        this.state.preOtherList.map(item => {
            if (item.existing_plan === "" || item.existing_plan === null || item.entityName === "" || item.entityName === "") {
                flag_yesterday = false;
            }
        })
        this.state.preOtherList.map(item => {
            if (item.existing_plan === "" || item.existing_plan === null || item.entityName === "" || item.entityName === "") {
                flag_before_yesterday = false;
            }
        })
        this.state.site_list.map(item => {
            if (item.existing_plan === "" || item.existing_plan === null || item.entityName === "" || item.entityName === "") {
                flag_current = false;
            }
        })

        return flag_current && flag_yesterday && flag_before_yesterday;
    }

    passValidateSave() {
        if (this.state.submit_type === "Participate") {
            let siteCount = this.state.site_list.length;
            let preCount = this.state.preDayList.length;
            let beforeYesterday = this.state.preOtherList.length;
            let total = siteCount + preCount + beforeYesterday;
            if (total === 0) {
                setTimeout(() => {
                    this.setState({ text: "Please add account to participate." });
                }, 200);
                this.refs.Modal.showModal();
                return false;
            }
            else {
                this.setState({ text: "Are you sure you want to participate in this auction?" });
                this.refs.Modal.showModal("comfirm");
            }
        } else if (this.state.submit_type === "save") {
            this.doSave();
        }
    }

    durationChange(e) {
        let itemValue = e.target.value
        this.setState({
            contract_duration: itemValue
        })

    }

    getPurchase(id) {
        let name = "";
        if (this.purchaseList) {
            for (let i = 0; i < this.purchaseList.length; i++) {
                if (this.purchaseList[i].id == id) {
                    name = this.purchaseList[i].company_name;
                    return name;
                    break;
                }
            }
        }
        return name;
    }

    dateCompare(arr) {
        let count = 0;
        let startDate = moment(this.state.contact_start_date).format('YYYY-MM-DD');
        for (let i in arr) {
            if (arr[i].contract_expiry) {
                let contract_expiry_date = moment(arr[i].contract_expiry).format('YYYY-MM-DD');
                if (contract_expiry_date >= startDate) {
                    count++;
                }
            }
        }
        return count;
    }
    showMarketInsight() {
        this.setState({
            text: ""
        })
        this.refs.market.showModal()
    }
    render() {
        return (
            <div>
                <h1 className={"largeFont"}>Buyer Participation</h1>
                <table className="consumption_table_top" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td style={{ width: "80%" }}>  <h4 className="col-sm-12 u-mb2">Invitation to RA: {this.state.name} on {moment(this.state.time).format('D MMM YYYY hh:mm a')}</h4></td>
                            <td style={{ width: "20%" }} rowSpan="4">
                                <img src={marketImg} className="marketImg" onClick={this.showMarketInsight.bind(this)}></img>
                            </td>
                        </tr>
                        <tr>
                            <td><h4 className="col-sm-12 u-mb2">Electricity Purchase Contract Start Date: {moment(this.state.contact_start_date).format('D MMM YYYY')}</h4></td>
                        </tr>
                        <tr>
                            <td>
                                Purchase Duration : <select id="selDuration" style={{ width: '200px', marginLeft: "5px", display: "inline-block" }} onChange={this.durationChange.bind(this)} value={this.state.contract_duration}>
                                    {
                                        this.state.durationList.map(item => {
                                            return <option key={item.contract_duration} value={item.contract_duration}>{item.contract_duration + " months"}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4 className="col-sm-12 u-mb2" style={{ "paddingTop": "15px" }}>Status of Participation : {this.status}</h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <form name="buyer_form" method="post" onSubmit={this.checkSuccess.bind(this)}>
                    <div className="u-grid buyer mg0">
                        {/* one day  */}

                        <div className={this.state.preDayList.length > 0 ? "isDisplay" : "isHide"}>
                            <h4 className="col-sm-12 u-mb2">Accounts on Continuous Purchase</h4>
                            <span className="particiption-note">Note: Please update Consumption Details if there is significant change in your account's consumption since your last participation.</span>
                            <div className="col-sm-12 col-md-12">
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
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>Account No.</th>
                                                <th>Existing Plan</th>
                                                <th>Contract Expiry</th>
                                                <th>Purchasing Entity</th>
                                                <th>Intake Level</th>
                                                <th>Contracted Capacity</th>
                                                <th>Premise Address</th>
                                                <th>Consumption Details</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className="table-body">
                                    <table className="retailer_fill" cellPadding="0" cellSpacing="0" id="cate1">
                                        <colgroup>
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <tbody>
                                            {
                                                this.state.preDayList.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td><div name="12" className="" style={{ "height": "25px" }}>{item.account_number}</div> </td>
                                                        <td>{item.existing_plan}</td>
                                                        <td>{(item.contract_expiry !== "" && item.contract_expiry !== null) ? moment(item.contract_expiry).format('DD-MM-YYYY') : ""}</td>
                                                        <td>{item.entityName}</td>
                                                        <td>{item.intake_level}</td>
                                                        <td>{item.contracted_capacity ? formatPower(parseInt(item.contracted_capacity), 0, '') : "—"}</td>
                                                        <td>{item.blk_or_unit} {item.street} {item.unit_number} {item.postal_code} </td>
                                                        <td className="left">
                                                            <div><span>Total Monthly: </span><span className="textDecoration" >{formatPower(parseInt(Number(item.totals)), 0, '')}</span><span> kWh/month</span></div>
                                                            <div><span>Peak: </span><span><span>{formatPower(parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span>({parseInt(Math.round(item.peak_pct))}%</span>)<span style={{ fontWeight: "bold", fontSize: "14px" }} title="Off Peak is auto calculated by 1-Peak." >&nbsp;&nbsp;?</span></div>
                                                            <div><span>Off-Peak: </span><span>{formatPower(item.totals - parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span><span>({parseInt(Math.round(100 - item.peak_pct))}%)</span></div>
                                                            <div className={item.user_attachment ? "isDisplay" : "isHide"}><span>Upload bill(s):</span>
                                                                <span>
                                                                    <ul className="attachementList">
                                                                        {
                                                                            item.user_attachment ? item.user_attachment.map((item, i) => {
                                                                                return <li key={i}>
                                                                                    <a href={item.file_path ? item.file_path : "#"} target="_blank">{item.file_name ? item.file_name : ""}</a>
                                                                                </li>
                                                                            }) :
                                                                                <li> </li>
                                                                        }
                                                                    </ul>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="editSite"><a className="btnOption" style={{ marginTop: "20px" }} onClick={this.edit_site.bind(this, item, index, "preDay")}>Edit </a></div>
                                                            <div className="delSite"><a className="btnOption" onClick={this.remove_site.bind(this, index, "preDay")}>Delete </a></div>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.preOtherList.length > 0 ? "isDisplay" : "isHide"}>
                            <h4 className="col-sm-12 u-mb2 separate">Accounts with Purchase Gap</h4>
                            <span className="particiption-note">Note: Please update Consumption Details if there is significant change in your account's consumption since your last participation.</span>
                            <div className="col-sm-12 col-md-12">
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
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>Account No.</th>
                                                <th>Existing Plan</th>
                                                <th>Contract Expiry</th>
                                                <th>Purchasing Entity</th>
                                                <th>Intake Level</th>
                                                <th>Contracted Capacity</th>
                                                <th>Premise Address</th>
                                                <th>Consumption Details</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className="table-body" >
                                    <table className="retailer_fill" cellPadding="0" cellSpacing="0" id="cate2">
                                        <colgroup>
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <tbody>
                                            {
                                                this.state.preOtherList.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td><div name="12" className="" style={{ "height": "25px" }}>{item.account_number}</div> </td>
                                                        <td><div className="commonBorder" style={{ "height": "25px" }}>{item.existing_plan}</div></td>
                                                        <td>{(item.contract_expiry !== "" && item.contract_expiry !== null) ? moment(item.contract_expiry).format('DD-MM-YYYY') : ""}</td>
                                                        <td>{item.entityName}</td>
                                                        <td>{item.intake_level}</td>
                                                        <td>{item.contracted_capacity ? formatPower(parseInt(item.contracted_capacity), 0, '') : "—"}</td>
                                                        <td>{item.blk_or_unit} {item.street} {item.unit_number} {item.postal_code} </td>
                                                        <td className="left">
                                                            <div><span>Total Monthly: </span><span className="textDecoration" >{formatPower(parseInt(Number(item.totals)), 0, '')}</span><span> kWh/month</span></div>
                                                            <div><span>Peak: </span><span><span>{formatPower(parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span>({parseInt(Math.round(item.peak_pct))}%</span>)<span style={{ fontWeight: "bold", fontSize: "14px" }} title="Off Peak is auto calculated by 1-Peak." >&nbsp;&nbsp;?</span></div>
                                                            <div><span>Off-Peak: </span><span>{formatPower(item.totals - parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span><span>({parseInt(Math.round(100 - item.peak_pct))}%)</span></div>
                                                            <div className={item.user_attachment ? "isDisplay" : "isHide"}><span>Upload bill(s):</span>
                                                                <span>
                                                                    <ul className="attachementList">
                                                                        {
                                                                            item.user_attachment ? item.user_attachment.map((item, i) => {
                                                                                return <li key={i}>
                                                                                    <a href={item.file_path ? item.file_path : "#"} target="_blank">{item.file_name ? item.file_name : ""}</a>
                                                                                </li>
                                                                            }) :
                                                                                <li> </li>
                                                                        }
                                                                    </ul>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="editSite"><a className="btnOption" onClick={this.edit_site.bind(this, item, index, "preOthers")}>Edit </a></div>
                                                            <div className="delSite"><a className="btnOption" onClick={this.remove_site.bind(this, index, "preOthers")}>Delete </a></div>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-12">
                            <div className={this.state.isValidate ? "isHide" : "isDisplay"}>
                                <h4 className="col-sm-12 u-mb2 separate">New Accounts</h4>
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
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>Account No.</th>
                                                <th>Existing Plan</th>
                                                <th>Contract Expiry</th>
                                                <th>Purchasing Entity</th>
                                                <th>Intake Level</th>
                                                <th>Contracted Capacity</th>
                                                <th>Premise Address</th>
                                                <th>Consumption Details</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className="table-body">
                                    <table className="retailer_fill" cellPadding="0" cellSpacing="0" id="cate3">
                                        <colgroup>
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="20%" />
                                            <col width="10%" />
                                        </colgroup>
                                        <tbody>
                                            {
                                                this.state.site_list.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td><div name="12" className="" style={{ "height": "25px" }}>{item.account_number}</div></td>
                                                        <td>{item.existing_plan}</td>
                                                        <td>{(item.contract_expiry !== "" && item.contract_expiry !== null) ? moment(item.contract_expiry).format('DD-MM-YYYY') : ""}</td>
                                                        <td>{item.entityName}</td>
                                                        <td>{item.intake_level}</td>
                                                        <td>{item.contracted_capacity ? formatPower(parseInt(item.contracted_capacity), 0, '') : "—"}</td>
                                                        <td>{item.blk_or_unit} {item.street} {item.unit_number} {item.postal_code} </td>
                                                        <td className="left">
                                                            <div><span>Total Monthly: </span><span className="textDecoration" >{formatPower(parseInt(Number(item.totals)), 0, '')}</span><span> kWh/month</span></div>
                                                            <div><span>Peak: </span><span><span>{formatPower(parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span>({parseInt(Math.round(item.peak_pct))}%</span>)<span style={{ fontWeight: "bold", fontSize: "14px" }} title="Off Peak is auto calculated by 1-Peak." >&nbsp;&nbsp;?</span></div>
                                                            <div><span>Off-Peak: </span><span>{formatPower(item.totals - parseInt(Math.round(item.totals * (Math.round(item.peak_pct) / 100))), 0, '')} kWh/month </span><span>({parseInt(Math.round(100 - item.peak_pct))}%)</span></div>
                                                            <div className={item.user_attachment ? "isDisplay" : "isHide"}><span>Upload bill(s):</span>
                                                                <span>
                                                                    <ul className="attachementList">
                                                                        {
                                                                            item.user_attachment ? item.user_attachment.map((item, i) => {
                                                                                return <li key={i}>
                                                                                    <a href={item.file_path ? item.file_path : "#"} target="_blank">{item.file_name ? item.file_name : ""}</a>
                                                                                </li>
                                                                            }) :
                                                                                <li> </li>
                                                                        }
                                                                    </ul>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="editSite"><a className="btnOption" onClick={this.edit_site.bind(this, item, index, "current")}>Edit </a></div>
                                                            <div className="delSite"><a className="btnOption" onClick={this.remove_site.bind(this, index, "current")}>Delete </a></div>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {this.state.checked ? '' : <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Account</a></div>}
                            <div id="div_warning">
                                {
                                    this.state.dateIssuecount > 0 ?
                                        <h4 className="lm--formItem lm--formItem--inline string chkBuyer" >
                                            <input type="checkbox" id="chkBuyer" id="chk_Warning" required /><span className="warning" style={{ "color:": "red" }}>Warning: [{this.state.dateIssuecount}] account(s) detected to have expiry date on  or after new contract start date. Please tick the checkbox
                                             to confirm that you aware and would like to proceed with including such account(s) in this auction.</span> </h4> : <div></div>
                                }
                            </div>
                            <div>
                                <h4 className="lm--formItem lm--formItem--inline string chkBuyer">
                                    <input name="agree_declare" type="checkbox" id="chkAgree_declare" disabled={this.state.disabled} required />
                                    {/* <span>I declare that all data submited is true and shall be used for the auction, and that i am bounded by <a target="_blank" href={this.state.link} className="urlStyle">Buyer T&C.</a></span> */}
                                    <span>I declare that all data submitted is true and shall be used for the auction, and that I am bounded by the <a target="_blank" href={this.state.buyer_link} className="urlStyleUnderline">Terms & Conditions of Use (Buyer)</a> and <a target="_blank" href={this.state.seller_link} className="urlStyleUnderline">Electricity Purchase Contract</a>. </span>
                                </h4>
                            </div>
                            <div className="buyer_btn">
                                <button className={"lm--button lm--button--primary " + this.state.disabled} disabled={this.state.disabled} onClick={this.doSubmit.bind(this, 'save')}>Save</button>
                                <a className={"lm--button lm--button--primary " + this.state.disabled} onClick={this.state.disabled === "disabled" ? this.doSubmit.bind(this, 'return') : this.doSubmit.bind(this, 'Reject')}>Reject</a>
                                <button className={"lm--button lm--button--primary " + this.state.disabled} disabled={this.state.disabled} onClick={this.doSubmit.bind(this, 'Participate')}>Participate</button>
                            </div>
                        </div>
                    </div>
                    <div className="createRaMain u-grid">
                        <a className="lm--button lm--button--primary u-mt3" href="/buyer/auctions" >Back</a>
                    </div>
                    <Modal text={this.state.text} acceptFunction={this.doAccept.bind(this)} ref="Modal" />
                </form>
                <Modal formSize="big" text={this.state.text} acceptFunction={this.doAddAccountAction.bind(this)} siteList={this.state.totalList} consumptionAccountItem={this.state.account_detail} listdetailtype='consumption_detail' ref="consumption" />
                <Modal formSize="middle" text={this.state.text} advisory={this.state.advisory} listdetailtype='market-insight' ref="market" />
                <Modal listdetailtype="accountTaken" text={this.state.text} takenList={this.state.takenList} ref="accountTaken" />
                <div id="bg"></div>
                <div id="show">
                    <img src={loadingPic} id="isLoading" />
                </div>
            </div>
        )
    }


}

FillConsumption.propTypes = { onAddClick: () => { } };

function run() {
    const domNode = document.getElementById('buyer_fill_consumption');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(FillConsumption),
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
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}