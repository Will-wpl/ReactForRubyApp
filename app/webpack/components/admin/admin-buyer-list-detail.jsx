import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import AdminComsumptionList from './admin_shared/admin-comsumption-list';
import AdminComsumptionPrice from './admin_shared/admin-comsumption-price';
import { getSearchType } from '../../javascripts/componentService/util';
import { getAdminBuyerListDetails, approveConsumptions } from '../../javascripts/componentService/admin/service';
import { Modal } from '../shared/show-modal';
import { validateNum, validateEmail, validator_Object, validator_Array, setValidationFaild, setValidationPass, changeValidate, setApprovalStatus } from '../../javascripts/componentService/util';
export default class AdminBuyerListDetail extends Component {
    constructor(props) {
        super(props);
        this.pageType = getSearchType();
        if (this.pageType.indexOf('Company') > 0) {
            this.datail_type = '2';
        } else {
            this.datail_type = '3';
        }
        this.state = {
            consumption_id: "",
            comsumption_list: [],
            purchase_list: [],
            price: {},
            detail: [],
            detail_index: 0,
            text: "",
            comment: "",
            dataVersion: "",
            past: false,
            auctionId: "",
            approvedStatus: ""

        }
        this.type = sessionStorage.getItem('comsumptiontype');
        if (this.type === 'company') {
            this.type = 'View Company Consumption Details'
        }
        this.validateItem = {
            comment: { cate: 'required' }
        }
    }

    componentDidMount() {
        let id = window.location.href.split("consumptions/")[1].split('&auctions=')[0];
        let auctionId = window.location.href.split("consumptions/")[1].split('&auctions=')[1];
        this.setState({
            auctionId: auctionId
        });
        getAdminBuyerListDetails(id).then(res => {
            this.setState({
                consumption_id: id,
                comsumption_list: [res],
                dataVersion: res.consumption.contract_duration ? "1" : "",
                past: (res.consumption.accept_status === "0" || res.consumption.accept_status === "1" || res.auction_published == true) ? true : false,
                comment: res.consumption.comments ? res.consumption.comments : "",
                approvedStatus: setApprovalStatus(res.accept_status, res.approval_date_time)
            })
        }, error => {

        })
    }
    show_detail(index, consumption_id) {
        let obj = $("#comsumption_list_table_" + index);
        if (obj.is(":visible")) {
            obj.prev().removeClass("open");
            obj.slideUp(300);
        } else {
            obj.prev().addClass("open");
            obj.slideDown(300);
        }
    }
    Change(type, e) {
        let itemValue = e.target.value;
        if (type === 'comment') {
            this.setState({
                comment: itemValue
            })
            changeValidate('comment', itemValue);
        }
    }
    checkRejectAction() { //when admin reject the request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        let flag = true;
        let arr = validator_Object(this.state, this.validateItem);
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
            consumption_id: this.state.consumption_id,
            approved: obj.action === 'reject' ? null : '1',
            comment: this.state.comment
        };
        if (obj.action === 'reject') {
            approveConsumptions(param).then(res => {
                location.href = "/admin/auctions/" + this.state.auctionId + "/buyer_dashboard?unpublished";
            })
        }
        else {
            approveConsumptions(param).then(res => {
                location.href = "/admin/auctions/" + this.state.auctionId + "/buyer_dashboard?unpublished";
            })
        }
    }
    render() {
        return (
            <div className="u-grid mg0 validate_message">
                <h2 className="u-mt2 u-mb2">View Consumption Details</h2>
                <div className="col-sm-12 u-mb3">
                    Status: {this.state.approvedStatus}
                    <AdminComsumptionList visible="visible" dataVersion={this.state.dataVersion} comsumption_list={this.state.comsumption_list} detail={this.show_detail.bind(this)} type={this.type} />
                </div>
                <div className={this.state.dataVersion === "1" ? "col-sm-12 u-mb3" : "isHide"}>
                    <div className="lm--formItem lm--formItem--inline string">
                        {/* <div className="lm--formItem-left lm--formItem-label string required">Comment:</div> */}
                        <label className="lm--formItem-left lm--formItem-label-comment string required">
                            Comments: &nbsp;</label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <textarea name="comment" value={this.state.comment} onChange={this.Change.bind(this, 'comment')} ref="comment" aria-required="true" disabled={this.state.past}></textarea>
                            <div className='isPassValidate' id='comment_message' >This field is required!</div>
                        </div>
                    </div>

                </div>
                <div className={this.state.dataVersion === "1" ? "retailer_btn" : "isHide"}>
                    <button id="save_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'reject')} disabled={this.state.past} >Reject</button>
                    <button id="submit_form" className="lm--button lm--button--primary" onClick={this.judgeAction.bind(this, 'approve')} disabled={this.state.past}>Approve</button>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="javascript:javascript:self.location=document.referrer;" >Back</a>
                </div>
                <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
            </div>

        )
    }
}

function run() {
    const domNode = document.getElementById('admin_buyer_list_detail');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminBuyerListDetail),
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