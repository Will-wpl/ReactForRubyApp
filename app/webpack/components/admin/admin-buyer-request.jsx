import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { changeValidate, validator_Object, setValidationFaild, setValidationPass, getStatus } from './../../javascripts/componentService/util';
import { getBuyerRequestDetail_Admin, approveBuyerRequest } from './../../javascripts/componentService/admin/service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Modal } from '../shared/show-modal';
export default class AdminBuyerRequestManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "0",
            name: "",
            contract_period_start_date: "",
            buyer_type: "1",
            allow_deviation: "1",
            flexible: '1',
            duration: '6',
            comment: "",
            text: "",
            total_volume: '',
            attachment_id: '',
            fileData: {
                "TC": [
                    { buttonName: "none", files: [] }
                ]
            },
            status: 2,
            status_name: "",
            action_type: "approve",
            disabled: true,
            user_type: "buyer",
            operation_type: "create",
            uploadUrl: "/api/buyer/request_attachments?file_type=",
        }
        this.request = {};
        this.validatorEntity_reject = {
            comment: { cate: 'required' }
        }
    }
    componentWillMount() {
        let requestId;
        if (window.location.href.indexOf("request_auctions/") > -1) {
            requestId = window.location.href.split("request_auctions/")[1];
        }
        this.setState({
            id: requestId
        });
    }
    componentDidMount() {
        this.bindDetails();
        window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
        window.addEventListener('resize', this.handleResize.bind(this))
        let wid = $('#input_name').width();
        $('.date_ico').width(wid);
    }
    bindDetails() {
        getBuyerRequestDetail_Admin(this.state.id).then(res => {
            if (res.result === "success") {
                this.setState({
                    name: res.request_auction.name,
                    buyer_type: res.request_auction.buyer_type,
                    contract_period_start_date: moment(res.request_auction.contract_period_start_date),
                    duration: res.request_auction.duration,
                    total_volume: res.request_auction.total_volume,
                    allow_deviation: res.request_auction.allow_deviation,
                    comment: res.request_auction.comment ? res.request_auction.comment : "",
                    status: res.request_auction.accept_status,
                    status_name: getStatus(res.request_auction.accept_status, res.request_auction.accept_date_time === null ? res.request_auction.created_at : res.request_auction.accept_date_time),
                    flexible: res.request_auction.flexible
                })

                if (res.last_attachment) {
                    let attachment = {
                        id: res.last_attachment.id,
                        file_name: res.last_attachment.file_name,
                        file_path: res.last_attachment.file_path
                    }
                    let fileObj = this.state.fileData;
                    fileObj['TC'][0].files = [];
                    fileObj['TC'][0].files.push(attachment)
                    this.setState({
                        fileData: fileObj
                    })
                }
            }
        })
    }


    starttimeChange(data) {
        this.setState({
            contract_period_start_date: data
        })
    }
    noPermitInput(event) {
        event.preventDefault();
    }
    doValue(type, e) {
        let val = e.target.value;
        switch (type) {

            case "comment":
                this.setState({
                    comment: val
                })
                changeValidate('comment', val);
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this))
        window.removeEventListener('resize', this.handleResize.bind(this))
    }
    handleScroll = e => {
        let wid = $('#input_name').width();
        $('.date_ico').width(wid);
    }

    handleResize = e => {
        let wid = $('#input_name').width();
        $('.date_ico').width(wid);
    }



    commentValidation() {
        let flag = true;
        let arr = validator_Object(this.state, this.validatorEntity_reject);
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
        return flag;
    }
    doAction(obj) {
        let params = {
            id: this.state.id,
            accepted: obj.action === "approve" ? 1 : null,
            comment: this.state.comment
        }

        approveBuyerRequest(params).then(res => {
            if (res.result === 'success') {
                if (obj.action === "approve") {
                    if (this.state.buyer_type === '1') {
                        setTimeout(() => { window.location.href = "/admin/request_auctions" }, 100);
                    }
                    else {
                        sessionStorage.auction_id = res.new_auction_id;
                        setTimeout(() => { window.location.href = "/admin/auctions/new" }, 100);
                    }

                }
                else {
                    setTimeout(() => { window.location.href = "/admin/request_auctions" }, 100);
                }
            }
        })
    }
    doApproveAction(type) {
        if (type === "Reject") {
            this.setState({
                action_type: "reject"
            })
            if (this.commentValidation()) {
                this.setState({
                    text: "Are you sure you want to reject this request?"
                })
                this.refs.Modal_Option.showModal('comfirm', { action: 'reject' }, '');
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
            this.setState({
                text: "Are you sure you want to approve this request?"
            })
            this.refs.Modal_Option.showModal('comfirm', { action: 'approve' }, '');
        }
    }

    render() {
        let btn_html;
        btn_html = <div style={{ marginRight: "10px" }}>
            <button id="save_form" className="lm--button lm--button--primary" disabled={parseInt(this.state.status) === 1 || parseInt(this.state.status) === 0} onClick={this.doApproveAction.bind(this, "Reject")}>Reject</button>
            <button id="submit_form" className="lm--button lm--button--primary" disabled={parseInt(this.state.status) === 1 || parseInt(this.state.status) === 0} onClick={this.doApproveAction.bind(this, 'Approve')}>Approve</button>
        </div>;
        return (
            <div>
                <div className="u-grid mg0 div-center" >
                    <h2 className="u-mt3 u-mb3"></h2>
                    <div className="buyer_buyer_list col-sm-12 col-md-12">
                        <div className="col-sm-12 buyer_list1"  >
                            <div className="retailer_manage_coming">
                                <div id="buyer_form" >
                                    <div className="u-grid admin_invitation ">

                                        <div className="col-sm-12 col-md-8 push-md-2 validate_message ">
                                            <div className="top"></div>

                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required"></abbr> Status  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control" style={{ marginTop: "12px" }}>
                                                    {this.state.status_name}
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Name of Reverse Auction  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" id="input_name" name="name" value={this.state.name} onChange={this.doValue.bind(this, 'name')} disabled={this.state.disabled} ref="request_name" required aria-required="true" title="Please fill out this field" placeholder="" />
                                                    <div className='isPassValidate' id='name_message' >This field is required!</div>
                                                </div>
                                            </div>

                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Single / Multiple Buyer (s)  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <select ref="buyer_type" id="buyer_type" onChange={this.doValue.bind(this, 'buyer_type')} value={this.state.buyer_type} disabled={this.state.disabled}>
                                                        <option value="0">Single</option>
                                                        <option value="1">Multiple</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="lm--formItem lm--formItem--inline string optional ">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Contract Start Date  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <DatePicker minDate={moment()} disabled={this.state.disabled} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.contract_period_start_date} selectsStart startDate={this.state.contract_period_start_date} onChange={this.starttimeChange} />
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Contract Duration  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <select ref="contract_duration" id="contract_duration" name="contract_duration" onChange={this.doValue.bind(this, 'contract_duration')} value={this.state.duration} disabled={this.state.disabled}>
                                                        <option value="6">6 months</option>
                                                        <option value="12">12 months</option>
                                                        <option value="24">24 months</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {this.state.buyer_type == "0" ?
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required"></abbr> Upload T&C  :
                                                </label>
                                                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                        <UploadFile type="TC" required="required" validate="true" showList="1" col_width="10" showWay="0" fileData={this.state.fileData.TC} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                                        <div className="col-sm-1 col-md-1 u-cell">
                                                        </div>
                                                        <div id="showMessage" className="isPassValidate">This field is required!</div>
                                                    </div>
                                                </div> : ''
                                            }
                                            {this.state.buyer_type == "0" ?
                                                <div className="lm--formItem lm--formItem--inline string">
                                                    <label className="lm--formItem-left lm--formItem-label string required">
                                                        <abbr title="required">*</abbr> Allow Deviations  :
                                                </label>
                                                    <div className="lm--formItem-right lm--formItem-control">
                                                        <select ref="allow_deviation" id="allow_deviation" onChange={this.doValue.bind(this, 'allow_deviation')} value={this.state.allow_deviation} disabled={this.state.disabled}>
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                </div> : ''
                                            }


                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <div style={{ fontSize: "0.875rem" }} className={this.state.buyer_type === '1' ? "isDisplay " : "isHide"}><abbr title="required">*</abbr> Total Volume (kwh/month) :</div>
                                                    <div style={{ fontSize: "0.875rem" }} className={this.state.buyer_type === '1' ? "isHide" : "isDisplay"}><abbr title="required">*</abbr> Estimated(aggregate) monthly consumption :</div>
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="total_volume" value={this.state.total_volume} onChange={this.doValue.bind(this, 'total_volume')} disabled={this.state.disabled} ref="total_volume" required aria-required="true" title="Please fill out this field" placeholder="" />
                                                    <div className='isPassValidate' id='total_volume_message' >This field is required!</div>
                                                </div>
                                            </div>
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Flexible on Contract Start Date? :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <select ref="allow_deviation" id="allow_deviation" onChange={this.doValue.bind(this, 'flexible')} value={this.state.flexible} disabled={this.state.disabled}>
                                                        <option value="1">Yes</option>
                                                        <option value="0">No</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="lm--formItem lm--formItem--inline string optional ">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required" className={this.state.action_type === "reject" ? "isDisplayInLine" : "isHide"}  >*</abbr> Admin Comments  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <textarea type="text" name="comment" disabled={parseInt(this.state.status) === 1 || parseInt(this.state.status) === 0} value={this.state.comment} onChange={this.doValue.bind(this, 'comment')} ref="request_name" required aria-required="true" title="Please fill out this field" placeholder="" />
                                                    <div className='isPassValidate' id='comment_message' >This field is required!</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="retailer_btn" >
                                        {btn_html}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal acceptFunction={this.doAction.bind(this)} text={this.state.text} type={"comfirm"} ref="Modal_Option" />
                </div >
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('divManageRequest');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminBuyerRequestManage),
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