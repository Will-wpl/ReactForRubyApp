import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import moment from 'moment';
import { changeValidate, removeAsInteger, validateInteger, setValidationFaild, setValidationPass, validator_Object, getStatus } from './../../javascripts/componentService/util';
import { getBuyerRequestDetail, saveBuyerRequest, approveBuyerRequest } from './../../javascripts/componentService/common/service';



export class BuyerNewRequestManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "0",
            name: "",
            contract_period_start_date: moment(),
            buyer_type: "1",
            allow_deviation: "1",
            duration: '6',
            comment: "",
            text: "",
            total_volume: '',
            attachment_id: '',
            accept_date_time: '',
            flexible: '1',
            fileData: {
                "TC": [
                    { buttonName: "none", files: [] }
                ]
            },
            status: 2,
            status_name: "",
            user_type: "buyer",
            operation_type: "create",
            uploadUrl: "/api/buyer/request_attachments?file_type=",
        }
        this.request = {};
        this.starttimeChange = this.starttimeChange.bind(this);
        this.validatorEntity_multiple = {
            total_volume: { cate: 'integer' },
            name: { cate: 'required' }
        }
        this.validatorEntity_single = {
            name: { cate: 'required' }
        }

    }

    componentWillMount() {
        let requestId;
        if (window.location.href.indexOf("equest_auctions/") > -1) {
            requestId = window.location.href.split("equest_auctions/")[1];
        }
        this.setState({
            disabled: parseInt(requestId) === 0 ? false : true,
            operation_type: parseInt(requestId) === 0 ? "create" : "edit",
            //user_type: parseInt(requestId) === 0 ? "buyer" : "admin",
            id: requestId
        });

    }

    componentDidMount() {
        if (parseInt(this.state.id) !== 0) {
            this.bindDetails();
        }
        window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
        window.addEventListener('resize', this.handleResize.bind(this))
        let wid = $('#input_name').width();
        $('.date_ico').width(wid);
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


    bindDetails() {
        getBuyerRequestDetail(this.state.id).then(res => {
            if (res.result === "success") {
                this.setState({
                    name: res.request_auction.name,
                    buyer_type: res.request_auction.buyer_type,
                    contract_period_start_date: moment(res.request_auction.contract_period_start_date),
                    duration: res.request_auction.duration,

                    total_volume: res.request_auction.total_volume,
                    allow_deviation: res.request_auction.allow_deviation,
                    status: res.request_auction.accept_status,
                    status_name: getStatus(res.request_auction.accept_status, res.request_auction.accept_date_time === null ? res.request_auction.created_at : res.request_auction.accept_date_time),
                    accept_date_time: res.request_auction.accept_date_time,
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
            case "name":
                this.setState({
                    name: val
                });
                changeValidate('name', val);
                break;
            case "total_volume":
                val = removeAsInteger(val);
                this.setState({
                    total_volume: val
                });
                if (!validateInteger(val)) {
                    setValidationFaild('total_volume', 1)
                } else {
                    setValidationPass('total_volume', 1)
                }
                break;
            case "buyer_type":
                this.setState({
                    buyer_type: val
                });
                $('.validate_message').find('div').each(function () {
                    let className = $(this).attr('class');
                    if (className === 'errormessage') {
                        let divid = $(this).attr("id");
                        $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
                    }
                })
                break;
            case "contract_duration":
                this.setState({
                    duration: val
                });
                break;
            case "allow_deviation":
                this.setState({
                    allow_deviation: val
                });
                break;
            case "comment":
                this.setState({
                    comment: val
                })
                changeValidate('comment', val);
                break;
            case "flexible":
                this.setState({
                    flexible: val
                })
                break;
        }
    }

    doEditAction() {
        this.setState({
            disabled: false
        })
    }
    doCancel(type) {
        if (type === 'create') {
            window.location.href = '/buyer/request_auctions/entity_list';
        }
        else if (type === 'goback') {
            window.location.href = '/buyer/request_auctions';
        }
        else {
            this.setState({
                disabled: true
            })
        }

    }
    passValidation() {
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
        let flag = true;
        if (this.state.buyer_type === "1") {
            let arr = validator_Object(this.state, this.validatorEntity_multiple);

            if (arr.length > 0) {
                arr.map((item, index) => {
                    let column = item.column;
                    let cate = item.cate;
                    setValidationFaild(column, cate)
                })

                flag = false;
            }

        }
        else {
            let arr = validator_Object(this.state, this.validatorEntity_single);
            if (arr.length > 0) {
                arr.map((item, index) => {
                    let column = item.column;
                    let cate = item.cate;
                    setValidationFaild(column, cate)
                })
                flag = false;
            }

        }

        return flag;
    }

    refresh() {
        let total = this.state.fileData.TC[0].files.length;
        if (total === 2) {
            let attachment = {
                id: this.state.fileData.TC[0].files[1].id,
                file_name: this.state.fileData.TC[0].files[1].file_name,
                file_path: this.state.fileData.TC[0].files[1].file_path
            }
            let fileObj = this.state.fileData;
            fileObj['TC'][0].files = [];
            fileObj['TC'][0].files.push(attachment)
            this.setState({
                fileData: fileObj
            })
        }
    }

    doSave(type) {
        if (this.passValidation()) {
            this.request = {
                name: this.state.name,
                buyer_type: this.state.buyer_type,
                contract_period_start_date: moment(this.state.contract_period_start_date).format(),
                duration: this.state.duration,
                flexible: this.state.flexible
            }
            if (this.state.buyer_type === '1') {
                this.request.total_volume = this.state.total_volume;
                this.request.attachment_id = '';
                this.request.allow_deviation = '1';
            }
            else {
                this.request.total_volume = "";
                this.request.attachment_id = this.state.fileData.TC[0].files.length > 0 ? this.state.fileData.TC[0].files[0].id : "";
                this.request.allow_deviation = this.state.allow_deviation;
            }

            if (this.state.operation_type === "create") {
                this.request.id = null;
            }
            else {
                this.request.id = this.state.id;
            }

            saveBuyerRequest(this.request).then(res => {
                if (res.request_auction) {
                    window.location.href = "/buyer/request_auctions"
                }
            })
        }
    }



    render() {
        let btn_html;
        if (this.state.user_type === 'buyer') {
            if (this.state.operation_type === "edit") {
                if (parseInt(this.state.status) === 1) {
                    btn_html =
                        <div>
                            <button id="save_form" className="lm--button lm--button--primary" disabled="true" onClick={this.doCancel.bind(this, "goback")}>Edit</button>
                        </div>
                }
                else {
                    btn_html = this.state.disabled ?
                        <div style={{ paddingRight: "10px" }}><button id="save_edit" disabled={parseInt(this.state.status) === 2} className="lm--button lm--button--primary" onClick={this.doEditAction.bind(this)}>Edit</button></div>
                        : <div>
                            <button id="save_form" className="lm--button lm--button--primary" onClick={this.doCancel.bind(this, "save")}>Cancel</button>
                            <button id="submit_form" className="lm--button lm--button--primary" onClick={this.doSave.bind(this, 'save')}>Save</button>
                        </div>;
                }

            }
            else {
                btn_html = <div>
                    <button id="save_form" className="lm--button lm--button--primary" onClick={this.doCancel.bind(this, 'create')}>Cancel</button>
                    <button id="submit_form" className="lm--button lm--button--primary" onClick={this.doSave.bind(this, 'create')}>Submit</button>
                </div>
            }
        }

        return (
            <div className="u-grid mg0 div-center" >
                <h2 className="u-mt3 u-mb3"></h2>
                <div className="buyer_buyer_list col-sm-12 col-md-12">
                    <div className="col-sm-12 buyer_list1"  >
                        <div className="retailer_manage_coming">
                            <div id="buyer_form" >
                                <div className="u-grid admin_invitation ">
                                    <div className="col-sm-12 col-md-8 push-md-2 validate_message ">
                                        <div className="top"></div>
                                        {
                                            this.state.operation_type === "edit" ? <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required"></abbr> Status  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control" style={{ marginTop: "12px" }}>
                                                    {this.state.status_name}
                                                </div>
                                            </div> : ""
                                        }
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
                                                <abbr title="required">*</abbr> Single / Multiple Buyer(s)  :
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
                                                    <UploadFile type="TC" required="required" calbackFn={this.refresh.bind(this)} validate="true" showList="1" col_width="10" showWay="0" fileData={this.state.fileData.TC} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />

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
                                                <abbr title="required">*</abbr> Estimated (aggregate) monthly consumption (kwh/month) :
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

                                    </div>
                                </div>
                                <div className="retailer_btn" >
                                    {btn_html}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
}
BuyerNewRequestManage.propTypes = {
    onSubmitjest: () => { }
};


function runs() {
    const domNode = document.getElementById('divBuyerRequestNewRA');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerNewRequestManage),
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
