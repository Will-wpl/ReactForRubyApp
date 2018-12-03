import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import moment from 'moment';
import { changeValidate, removeAsInteger, validateInteger, setValidationFaild, setValidationPass, validator_Object } from './../../javascripts/componentService/util';
import { getBuyerRequestDetail, saveBuyerRequest } from './../../javascripts/componentService/common/service';


export class BuyerNewRequestManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "0",
            name: "",

            start_datetime: "",
            startDate: moment(),
            endDate: "",
            duration: "",
            single_multiple: "1",
            allow_deviation: "1",
            contract_duration: '6',
            single_truely: false,
            published_date_time: '',
            text: "",
            total_volume: '',
            fileData: {
                "TC": [
                    { buttonName: "none", files: [] }
                ]
            },
            user_type: "buyer",
            operation_type: "create",
            uploadUrl: "/api/buyer/user_attachments?file_type=",
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
        this.validatorEntity_reject = {
            common: { cate: 'required' }
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
            user_type: parseInt(requestId) === 0 ? "buyer" : "admin",
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
        let params = {
            id: this.state.id
        }
        getBuyerRequestDetail(params).then(res => {
            if (res) {
                this.setState({




                })
            }
        })
    }


    checkSuccess() {

    }
    starttimeChange(data) {
        this.setState({
            startDate: data
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
            case "single_multiple":
                this.setState({
                    single_multiple: val
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
                    contract_duration: val
                });
                break;
            case "allow_deviation":
                this.setState({
                    allow_deviation: val
                });
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
        let flag = true, hasDoc = true;
        if (this.state.single_multiple === "1") {
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


            if (this.state.fileData.TC[0].files.length > 0) {
                hasDoc = true;
                $("#showMessage").removeClass("errormessage").addClass("isPassValidate");
            }
            else {
                hasDoc = false;
                $("#showMessage").removeClass("isPassValidate").addClass("errormessage");
            }
        }

        return flag && hasDoc;
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
                single_multiple: this.state.single_multiple,
                startDate: this.state.startDate,
                contract_duration: this.state.contract_duration,
            }
            if (this.state.operation_type === "create") {
                this.request = {
                    id: null,
                    total_volume: this.state.contract_duration
                }
            }
            else {
                this.request = {
                    id: this.state.id,
                    attachment_id: this.state.fileData.TC[0].files[0].id,
                    allow_deviation: this.state.allow_deviation
                }
            }
            saveBuyerRequest(this.request).then(res => {


            })

        }
    }

    doApproveAction(type) {

    }
    render() {
        let btn_html;
        if (this.state.user_type === 'buyer') {
            if (this.state.operation_type === "edit") {
                btn_html = this.state.disabled ?
                    <div style={{ paddingRight: "10px" }}><button id="save_edit" className="lm--button lm--button--primary" onClick={this.doEditAction.bind(this)}>Edit</button></div>
                    : <div>
                        <button id="save_form" className="lm--button lm--button--primary" onClick={this.doCancel.bind(this, "save")}>Cancel</button>
                        <button id="submit_form" className="lm--button lm--button--primary" onClick={this.doSave.bind(this, 'save')}>Save</button>
                    </div>;
            }
            else {
                btn_html = <div>
                    <button id="save_form" className="lm--button lm--button--primary" onClick={this.doCancel.bind(this, 'create')}>Cancel</button>
                    <button id="submit_form" className="lm--button lm--button--primary" onClick={this.doSave.bind(this, 'create')}>Create</button>
                </div>
            }
        }
        else {
            btn_html = <div style={{ marginRight: "10px" }}>
                <button id="save_form" className="lm--button lm--button--primary" onClick={this.doApproveAction.bind(this, "Reject")}>Reject</button>
                <button id="submit_form" className="lm--button lm--button--primary" onClick={this.doApproveAction.bind(this, 'Approve')}>Approve</button>
            </div>;
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
                                                <select ref="single_multiple" id="single_multiple" onChange={this.doValue.bind(this, 'single_multiple')} value={this.state.single_multiple} disabled={this.state.disabled}>
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
                                                <DatePicker minDate={moment()} disabled={this.state.disabled} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.starttimeChange} />
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr> Contract Duration  :
                                                </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <select ref="contract_duration" id="contract_duration" name="contract_duration" onChange={this.doValue.bind(this, 'contract_duration')} disabled={this.state.disabled}>
                                                    <option value="6">6 months</option>
                                                    <option value="12">12 months</option>
                                                    <option value="24">24 months</option>
                                                </select>
                                            </div>
                                        </div>
                                        {this.state.single_multiple == "0" ?
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Upload T&C  :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                    <UploadFile type="TC" required="required" calbackFn={this.refresh.bind(this)} validate="true" showList="1" col_width="10" showWay="0" fileData={this.state.fileData.TC} propsdisabled={this.state.disabled} uploadUrl={this.state.uploadUrl} />
                                                    <div className="col-sm-1 col-md-1 u-cell">
                                                    </div>
                                                    <div id="showMessage" className="isPassValidate">This field is required!</div>
                                                </div>
                                            </div> : ''
                                        }
                                        {this.state.single_multiple == "0" ?
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

                                        {this.state.single_multiple == "1" ?
                                            <div className="lm--formItem lm--formItem--inline string">
                                                <label className="lm--formItem-left lm--formItem-label string required">
                                                    <abbr title="required">*</abbr> Total Volume(kwh/month) :
                                                </label>
                                                <div className="lm--formItem-right lm--formItem-control">
                                                    <input type="text" name="total_volume" value={this.state.total_volume} onChange={this.doValue.bind(this, 'total_volume')} disabled={this.state.disabled} ref="total_volume" required aria-required="true" title="Please fill out this field" placeholder="" />
                                                    <div className='isPassValidate' id='total_volume_message' >This field is required!</div>
                                                </div>
                                            </div> : ''
                                        }


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
