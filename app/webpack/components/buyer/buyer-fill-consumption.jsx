import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Modal } from '../shared/show-modal';
import { DoFillConsumption } from './fill-consumption'

import { getBuyerParticipate, setBuyerParticipate } from '../../javascripts/componentService/common/service';
import moment from 'moment';

export class FillConsumption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            submit_type: "",
            site_list: [],
            purchasing_entity: [],
            disabled: '',
            checked: false,
            name: "",
            time: "", link: "",
            durationList: [],
            durtioanItem: "",
            account_detail: this.accountItem,
            account_list: [],
            contract_capacity_disabled: true,
            contract_expiry_disabled: true,
            dateIssuecount: 0
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
            id: 0,
            cid: Math.floor((Math.random() * 10000) + 1),
            option: 'insert'
        };
        this.purchaseList = [];
        this.consumptions_id = (window.location.href.split("consumptions/")[1]).split("/edit")[0];
    }

    componentDidMount() {
        this.BuyerParticipateList();
    }

    BuyerParticipateList() {
        getBuyerParticipate('/api/buyer/consumption_details?consumption_id=' + this.consumptions_id).then((res) => {

            this.site_list = res.consumption_details;
            this.status = res.consumption.participation_status === '1' ? "Confirmed" :
                (res.consumption.participation_status === '2' ? "Pending" : "Rejected")
            this.setState({
                name: res.auction.name,
                time: res.auction.actual_begin_time,
                link: res.tc_attachment.file_path,
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
                this.setState({ site_list: res.consumption_details });
            }
        }, (error) => {
            this.refs.Modal.showModal();
            this.setState({ text: "Interface failed4" });
        })
    }
    changeSiteList(val, index) {
        let list = this.state.site_list;
        this.site_list[index].intake_level_selected = val;
        this.setState({ site_list: list })
    }

    add_site() {
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }
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
        this.setState({
            account_detail: this.accountItem,
            text: ""
        })
        this.refs.consumption.showModal('custom', {}, '', '-1')
    }
    // edit an account information
    edit_site(item, index) {
        this.accountItem.account_number = item.account_number;
        this.accountItem.existing_plan = ['SPS tariff', 'SPS wholesale', 'Retailer plan'];
        this.accountItem.existing_plan_selected = item.existing_plan;
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
        this.accountItem.peak_pct = item.peak_pct;
        this.accountItem.peak = 10;
        this.accountItem.option = 'update';

        this.setState({
            account_detail: this.accountItem,
            text: ""
        })
        this.refs.consumption.showModal('custom', {}, '', index)
    }

    remove_site(index) {
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }
        this.deleteNum = index;
        this.refs.Modal.showModal("comfirm");
        this.setState({ text: "Are you sure you want to delete ?", submit_type: "delete" });
    }
    nameRepeat(arr) {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i].account_number])
                return true;
            hash[arr[i].account_number] = true;
        }
        return false;
    }

    dateCompare(arr) {
        let count = 0;
        let startDate = moment(this.state.time).format('YYYY-MM-DD HH:mm:ss');
        for (let i in arr) {
            let contract_expiry_date = moment(arr[i].contract_expiry).format('YYYY-MM-DD HH:mm:ss');
            if (contract_expiry_date >= startDate) {
                count++;
            }
        }
        return count;
    }


    doSave(type) {
        let makeData = {},
            buyerlist = [];
        let checkpeak = this.state.site_list.map((item, index) => {
            return parseFloat(item.totals) > 0 && parseFloat(item.peak_pct) > 0;
        })
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
                peak_pct: item.peak_pct
            }
            buyerlist.push(siteItem);
        })

        makeData = {
            consumption_id: this.consumptions_id,
            details: JSON.stringify(buyerlist),
            contract_duration: $("#selDuration").val()
        }
        if (type != "delete") {
            if (!checkpeak) {
                setTimeout(() => {
                    this.refs.Modal.showModal();
                    this.setState({ text: "You cannot enter 0 kWh for both peak and off-peak volume" });
                }, 200)
                return false;
            }
        }

        setBuyerParticipate(makeData, '/api/buyer/consumption_details/save').then((res) => {
            if (type != "participate") {
                if (type == "delete") {
                    this.setState({ text: "Delete successful!" });
                } else {
                    this.setState({ text: "Save successful!" });
                }
                this.refs.Modal.showModal();
            } else {
                setBuyerParticipate({ consumption_id: this.consumptions_id }, '/api/buyer/consumption_details/participate').then((res) => {
                    this.setState({
                        disabled: 'disabled',
                        checked: true,
                    })
                    this.refs.Modal.showModal();
                    this.setState({ text: "Congratulations, your participation in this auction has been confirmed." });
                    setTimeout(() => {
                        window.location.href = "/buyer/auctions";
                    }, 3000)
                }, (error) => {
                    this.refs.Modal.showModal();
                    this.setState({ text: "Interface failed1" });
                })
            }
        }, (error) => {
            this.refs.Modal.showModal();
            this.setState({ text: "Interface failed2" });
        })
    }

    doAccept() {
        if (this.state.submit_type === "Reject") { //do Reject
            setBuyerParticipate({ consumption_id: this.consumptions_id }, '/api/buyer/consumption_details/reject').then((res) => {
                this.refs.Modal.showModal();
                this.setState({ text: "Thank you for the confirmation. You have rejected this auction." });
                setTimeout(() => {
                    window.location.href = "/buyer/auctions";
                }, 3000)
            }, (error) => {
                this.refs.Modal.showModal();
                this.setState({ text: "Interface failed3" });
            })
        } else if (this.state.submit_type === "Participate") { //do Participate
            this.doSave('participate');
        } else if (this.state.submit_type === "delete") {
            const site_listObj = this.state.site_list;
            site_listObj.splice(this.deleteNum, 1);
            this.setState({ site_list: site_listObj });
            setTimeout(() => {
                this.doSave('delete');
            }, 500);
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

    //when user finished adding a new account, list page will add/update the new account information.
    doAddAccountAction(siteInfo) {
        let item = {
            account_number: siteInfo.account_number,
            existing_plan: siteInfo.existing_plan_selected,
            contract_expiry: siteInfo.contract_expiry ? moment(siteInfo.contract_expiry) : "",
            company_buyer_entity_id: siteInfo.purchasing_entity_selectd,
            intake_level: siteInfo.intake_level_selected,
            contracted_capacity: siteInfo.contracted_capacity,
            blk_or_unit: siteInfo.blk_or_unit,
            street: siteInfo.street,
            unit_number: siteInfo.unit_number,
            postal_code: siteInfo.postal_code,
            totals: siteInfo.totals,
            peak_pct: siteInfo.peak_pct
        };
        let entity = this.state.site_list;
        if (siteInfo.index >= 0) { entity[siteInfo.index] = item; }
        else { entity.push(item) }
        this.setState({
            site_list: entity
        })
    }
    // validate the page required field and  contact expiry date.
    checkSuccess(event) {
        event.preventDefault();
        let count = this.dateCompare(this.state.site_list);
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

    passValidateSave() {
        if (this.state.submit_type === "Participate") {
            let siteCount = this.state.site_list.length;
            if (siteCount === 0) {
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
            durtioanItem: itemValue
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

    render() {
        return (
            <div>
                <h1>Buyer Participation</h1>
                <h4 className="col-sm-12 u-mb2">Invitation to RA: {this.state.name}</h4>
                <h4 className="col-sm-12 u-mb2">Contract Start Date: {moment(this.state.time).format('D MMM YYYY hh:mm a')}</h4>
                <h4 >
                    <div className="row col-sm-12 u-mb2">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Purchase Duration : </td>
                                    <td> <select id="selDuration" style={{ 'width': '200px', marginLeft: "5px" }} onChange={this.durationChange.bind(this)}>
                                        {
                                            this.state.durationList.map(item => {
                                                return <option key={item.contract_duration} value={item.contract_duration}>{item.contract_duration + " months"}</option>
                                            })
                                        }
                                    </select></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </h4>
                <form name="buyer_form" method="post" onSubmit={this.checkSuccess.bind(this)}>
                    <div className="u-grid buyer mg0">
                        <h4 className="col-sm-12 u-mb2">Last Status of Participation : {this.status}</h4>
                        <h4 className="col-sm-12 u-mb2">New Accounts</h4>
                        <div className="col-sm-12 col-md-12">
                            <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>Account No.</th>
                                        <th>Existing Plan</th>
                                        <th>Contract Expiry</th>
                                        <th>Purchasing Entity</th>
                                        <th>Intake Level</th>
                                        <th>Contract Capacity</th>
                                        <th>Permise Address</th>
                                        <th>Consumption Details</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.site_list.map((item, index) => {
                                            return <tr key={index}>
                                                <td>{item.account_number} </td>
                                                <td>{item.existing_plan}</td>
                                                <td>{item.contract_expiry !== "" ? moment(item.contract_expiry).format('YYYY-MM-DD HH:mm') : "-"}</td>
                                                <td>{this.getPurchase(item.company_buyer_entity_id)} </td>
                                                <td>{item.intake_level}</td>
                                                <td>{item.contracted_capacity ? parseInt(item.contracted_capacity) : "-"}</td>
                                                <td>{item.blk_or_unit} {item.street} {item.unit_number} {item.postal_code} </td>
                                                <td>
                                                    <span className="textBold">Total Monthly:<div>{item.totals}</div>kWh/month,Peak:<div>{item.peak_pct}</div></span>,Off-Peak:<span className="textNormal"><div>{100 - item.peak_pct}</div></span>(auto calculate).<span className="textBold">Upload bill(s) compulsory for Category 3(new Accounts)</span>.
                                                    <div title="Click on '?' to see Admin's reference information on peak/offpeak ratio.">?</div>
                                                </td>
                                                <td>
                                                    {this.state.checked ? '' : <div className="editSite"><a onClick={this.edit_site.bind(this, item, index)}>Edit </a></div>}
                                                    {this.state.checked ? '' : <div className="delSite"><a onClick={this.remove_site.bind(this, index)}>Delete </a></div>}
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            {this.state.checked ? '' : <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Account</a></div>}
                            <div id="div_warning" className="warning">
                                {
                                    this.state.dateIssuecount > 0 ?
                                        <h4 className="lm--formItem lm--formItem--inline string" >
                                            <input type="checkbox" id="chkBuyer" id="chk_Warning" required /> Warning:[{this.state.dateIssuecount}] account(s) detected to have expiry date on  or after new contract start date. Please tick the checkbox
                                             to confirm that you aware and would like to proceed with including such account(s) in this auction.</h4> : <div></div>
                                }
                            </div>

                            <div>
                                <h4 className="lm--formItem lm--formItem--inline string">
                                    <input name="agree_declare" type="checkbox" id="chkAgree_declare" required />
                                    I declare that all data submited is true and shall be used for the auction,and that i am bounded by <a target="_blank" href={this.state.link} className="urlStyle"><span>&nbsp;Buyer T&C.</span></a>
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
                <Modal formSize="big" acceptFunction={this.doAddAccountAction.bind(this)} contract_capacity_disabled={this.state.contract_capacity_disabled} contract_expiry_disabled={this.state.contract_expiry_disabled} siteList={this.state.site_list} consumption_account_item={this.state.account_detail} listdetailtype='consumption_detail' ref="consumption" />
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