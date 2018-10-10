import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import { adminShowSelects, getFileList, raPublish, sendMail, removeFile } from '../../javascripts/componentService/admin/service';
import { getAuction } from '../../javascripts/componentService/common/service';
import { Modal } from '../shared/show-modal';
import { TimeCuntDown } from '../shared/time-cuntdown';
import { formatPower } from '../../javascripts/componentService/util';
export default class AdminInvitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "", role_name: "", retailer_select: 0, retailer_send: 0,
            retailer_pend: 0, buyer_company_select: 0, buyer_company_send: 0,
            buyer_company_pend: 0, buyer_individual_select: 0, buyer_individual_send: 0,
            buyer_individual_pend: 0, peak_lt: 0, peak_hts: 0,
            peak_htl: 0, peak_eht: 0, off_peak_lt: 0, off_peak_hts: 0,
            off_peak_htl: 0, off_peak_eht: 0, disabled: false, publish_status: 0, readOnly: false, buttonDisabled: false,
            params_type: "", auction: {},
            fileData: {
                "buyer_tc_upload": [
                    { buttonName: "none", files: [] }
                ],
                "retailer_confidentiality_undertaking_upload": [
                    { buttonName: "none", files: [] }
                ],
                "tender_documents_upload": [
                    { buttonName: "none", files: [] }
                ],
                "birefing_pack_upload": [
                    { buttonName: "none", files: [] }
                ]
            }
        }
    }

    componentDidMount() {
        adminShowSelects().then((res) => {
            //console.log(res);
            this.setState({
                retailer_select: (res.retailers['2'] ? res.retailers['2'] : 0) + (res.retailers['1'] ? res.retailers['1'] : 0),
                retailer_send: res.retailers['1'] ? res.retailers['1'] : 0,
                retailer_pend: res.retailers['2'] ? res.retailers['2'] : 0,
                buyer_company_select: (res.company_buyers['2'] ? res.company_buyers['2'] : 0) + (res.company_buyers['1'] ? res.company_buyers['1'] : 0),
                buyer_company_send: res.company_buyers['1'] ? res.company_buyers['1'] : 0,
                buyer_company_pend: res.company_buyers['2'] ? res.company_buyers['2'] : 0,
                buyer_individual_select: (res.individual_buyers['2'] ? res.individual_buyers['2'] : 0) + (res.individual_buyers['1'] ? res.individual_buyers['1'] : 0),
                buyer_individual_send: res.individual_buyers['1'] ? res.individual_buyers['1'] : 0,
                buyer_individual_pend: res.individual_buyers['2'] ? res.individual_buyers['2'] : 0
            })
        }, (error) => {
            this.setState({ text: 'Request exception failed!' });
            this.refs.Modal.showModal();
        })
        getAuction('admin', sessionStorage.auction_id).then((res) => {
            if (moment(res.actual_begin_time) < moment()) {
                this.setState({
                    readOnly: true
                })
            }
            //console.log(res);
            this.setState({
                peak_lt: res.total_lt_peak ? formatPower(parseInt(Number(res.total_lt_peak)), 0, '') : 0,
                peak_hts: res.total_hts_peak ? formatPower(parseInt(Number(res.total_hts_peak)), 0, '') : 0,
                peak_htl: res.total_htl_peak ? formatPower(parseInt(Number(res.total_htl_peak)), 0, '') : 0,
                peak_eht: res.total_eht_peak ? formatPower(parseInt(Number(res.total_eht_peak)), 0, '') : 0,
                off_peak_lt: res.total_lt_off_peak ? formatPower(parseInt(Number(res.total_lt_off_peak)), 0, '') : 0,
                off_peak_hts: res.total_hts_off_peak ? formatPower(parseInt(Number(res.total_hts_off_peak)), 0, '') : 0,
                off_peak_htl: res.total_htl_off_peak ? formatPower(parseInt(Number(res.total_htl_off_peak)), 0, '') : 0,
                off_peak_eht: res.total_eht_off_peak ? formatPower(parseInt(Number(res.total_eht_off_peak)), 0, '') : 0,
                publish_status: res.publish_status,
                auction: res
            })
        }, (error) => {
            this.setState({ text: 'Request exception failed!' });
            this.refs.Modal.showModal();
        })
        getFileList(sessionStorage.auction_id).then(res => {
            let fileObj;
            fileObj = this.state.fileData;
            res.map((item, index) => {
                fileObj[item.file_type][0].files.push({
                    id: item.id,
                    file_name: item.file_name,
                    file_path: item.file_path
                })
            })
            this.setState({
                fileData: fileObj
            })
        }, error => {

        })
    }
    upload(type, index) {
        let errorObj = $("#" + type + index).next().next();
        if ($("#" + type + index).val() === "") {
            errorObj.fadeIn(300);
            setTimeout(() => {
                errorObj.fadeOut(500);
            }, 2000)
            return;
        }
        if (type === "buyer_tc_upload" || type === "retailer_confidentiality_undertaking_upload") {
            if (this.state.fileData[type][index].files.length > 0) {
                this.setState({ text: 'This field can only upload one file !' });
                this.refs.Modal.showModal();
                return;
            }
        }
        const barObj = $('#' + type + index).parents("a").next();
        $.ajax({
            url: '/api/admin/auction_attachments?auction_id=' + sessionStorage.auction_id + '&file_type=' + type,
            type: 'POST',
            cache: false,
            data: new FormData($('#' + type + "_form")[0]),
            processData: false,
            contentType: false,
            xhr: () => {
                var xhr = new window.XMLHttpRequest();
                this.setState({
                    buttonDisabled: true
                })
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        const percentComplete = parseInt(evt.loaded / evt.total * 100, 10);
                        barObj.show();
                        barObj.find(".progress-bar").css('width', percentComplete + '%');
                        barObj.find(".progress-bar").text(percentComplete + '%');
                        if (percentComplete == 100) {
                            barObj.find(".progress-bar").text('Processing..');
                        }
                    }
                }, false);
                return xhr;
            },
            success: (res) => {
                let fileObj;
                $("#" + type + index).next().next().hide();
                barObj.find(".progress-bar").text('Upload Successful!');
                setTimeout(() => {
                    barObj.fadeOut(500);
                    $('.dfn').html('Please select file.');
                    this.setState({
                        buttonDisabled: false
                    })
                }, 2000)
                fileObj = this.state.fileData;
                fileObj[type].map((item, index) => {
                    item.files.push({
                        id: res.id,
                        file_name: res.file_name,
                        file_path: res.file_path
                    })
                })
                this.setState({
                    fileData: fileObj
                })
                $("#" + type + index).val('');
                //console.log(res);
            }, error: () => {
                barObj.find(".progress-bar").text('Upload failed!');
                barObj.find(".progress-bar").css('background', 'red');
                this.setState({
                    buttonDisabled: false
                })
            }
        })
    }
    changefileval(id) {
        const fileObj = $("#" + id);
        fileObj.parent().prev("dfn").text(fileObj.val());
    }
    checkRequired() {
        let timeBar;
        let requiredObj = this.state.fileData, result = true;
        clearTimeout(timeBar);
        // if(requiredObj['buyer_tc_upload'][0].files.length <=0){
        //     $("#buyer_tc_upload0").next().next().fadeIn(300);
        //     timeBar = setTimeout(()=>{
        //         $("#buyer_tc_upload0").next().next().fadeOut(300);
        //     },3000)
        //     result = false;
        // }
        // if(requiredObj['retailer_confidentiality_undertaking_upload'][0].files.length <=0){
        //     $("#retailer_confidentiality_undertaking_upload0").next().next().fadeIn(300);
        //     timeBar = setTimeout(()=>{
        //         $("#retailer_confidentiality_undertaking_upload0").next().next().fadeOut(300);
        //     },3000)
        //     result = false;
        // }
        // if(requiredObj['birefing_pack_upload'][0].files.length <=0){
        //     $("#birefing_pack_upload0").next().next().fadeIn(300);
        //     timeBar = setTimeout(()=>{
        //         $("#birefing_pack_upload0").next().next().fadeOut(300);
        //     },3000)
        //     result = false;
        // }
        return result;
    }
    doPublish() {
        let required;
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }
        if (this.state.buyer_company_select === 0) {
            clearTimeout(required);
            $("#buyer_select_box").next().fadeIn(300);
            location.href = "#buyer_select_box";
            required = setTimeout(() => {
                $("#buyer_select_box").next().fadeOut(300);
            }, 5000)
            return;
        }
        if (this.state.peak_eht <= 0 && this.state.off_peak_eht <= 0 &&
            this.state.peak_lt <= 0 && this.state.off_peak_lt <= 0 &&
            this.state.peak_hts <= 0 && this.state.off_peak_hts <= 0 &&
            this.state.peak_htl <= 0 && this.state.off_peak_htl <= 0
        ) {
            clearTimeout(required);
            $(".consumption .required_error").fadeIn(300);
            location.href = "#aggregate_consumption";
            required = setTimeout(() => {
                $(".consumption .required_error").fadeOut(300);
            }, 5000)
            return;
        }
        if (!this.checkRequired()) {
            return;
        }
        this.refs.Modal.showModal("comfirm");
        this.setState({
            text: "Are you sure you want to publish this auction?",
            params_type: 'do_publish'
        });
    }
    ra_publish() {
        raPublish({
            pagedata: { publish_status: '1' },
            id: sessionStorage.auction_id
        }).then((res) => {
            this.auction = res;
            this.refs.Modal.showModal();
            this.setState({
                text: this.auction.name + " has been successfully published. Please go to 'Manage Published Upcoming Reverse Auction' for further actions.",
                disabled: true
            });
            setTimeout(() => {
                window.location.href = "/admin/auctions/published"
            }, 2000);
        }, (error) => {
            this.setState({ text: 'Request exception,Publish failed!' });
            this.refs.Modal.showModal();
        })
    }
    remove_file(filetype, typeindex, fileindex, fileid) {
        this.setState({
            params_type: "remove_file"
        })
        let obj = {
            filetype: filetype,
            typeindex: typeindex,
            fileindex: fileindex,
            fileid: fileid
        }
        this.setState({ text: 'Are you sure you want to delete this file?' });
        this.refs.Modal.showModal("comfirm", obj);
    }
    do_remove(callbackObj) {
        let fileObj;
        removeFile(callbackObj.fileid).then(res => {
            fileObj = this.state.fileData;
            fileObj[callbackObj.filetype][callbackObj.typeindex].files.splice(callbackObj.fileindex, 1);
            this.setState({
                fileData: fileObj
            })
        }, error => {

        })
    }
    do_save() {
        this.refs.Modal.showModal();
        this.setState({
            text: this.state.auction.name + " has been successfully updated.",
        });
    }
    addinputfile(type, required) {
        let uploadStatus = true
        // if (
        //     this.state.retailer_send != 0
        //     //   || this.state.buyer_individual_send != 0 && type === "buyer_tc_upload"
        //     // || this.state.buyer_company_send != 0 && type === "buyer_tc_upload"
        //     || this.state.readOnly || this.state.publish_status === "1") {
        //     uploadStatus = false;
        // }
        let fileHtml = <div className="file_box">
            <form id={type + "_form"} encType="multipart/form-data">
                {this.state.fileData[type].map((item, index) =>
                    <div className="u-grid mg0 u-mt1" key={index}>
                        <div className="col-sm-12 col-md-10 u-cell">
                            {uploadStatus ?
                                <a className="upload_file_btn">
                                    <dfn>No file selected...</dfn>
                                    {/* accept="application/pdf,application/msword" */}
                                    {required === "required" ?
                                        <div>
                                            <input type="file" required="required" ref={type + index} onChange={this.changefileval.bind(this, type + index)} id={type + index} name="file" />
                                            <b>Browse..</b>
                                            <div className="required_error">
                                                Please select file.
                                                        </div>
                                        </div>
                                        : <div>
                                            <input type="file" ref={type + index} onChange={this.changefileval.bind(this, type + index)} id={type + index} name="file" />
                                            <b>Browse..</b>
                                        </div>}
                                </a> : ""}
                            {uploadStatus ?
                                <div className="progress">
                                    <div className="progress-bar" style={{ width: "0%" }}>0%</div>
                                </div> : ''}
                            <div className="progress_files">
                                <ul>
                                    {
                                        item.files.map((it, i) => {
                                            return <li key={i}><a target="_blank" download={it.file_name} href={it.file_path}>{it.file_name}</a>{uploadStatus ? <span className="remove_file" onClick={this.remove_file.bind(this, type, index, i, it.id)}></span> : ''}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        {uploadStatus ? <div className="col-sm-12 col-md-2 u-cell">
                            {/* {this.state.buttonDisabled?<a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)} >Upload2</a>:<a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)}>Upload1</a>}  */}

                            {
                                this.state.buttonDisabled ? <button className="lm--button lm--button--primary" disabled>Upload</button> : <button className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)} >Upload</button>
                            }

                        </div> : ''}
                        {/* <div className="col-sm-12 col-md-2 u-cell">
                                                {item.buttonName === "none" ? "" : <a onClick={this.fileclick.bind(this, index, type, item.buttonName)} className={"lm--button lm--button--primary "+item.buttonName}>{item.buttonText}</a>}
                                            </div> */}
                    </div>
                )}
            </form>
        </div>
        return fileHtml;
    }
    fileclick(index, type, typeName, obj) {
        let fileArray = [],
            allfileObj = {};
        allfileObj = this.state.fileData;
        fileArray = this.state.fileData[type];
        if (typeName == "add") {
            fileArray.push({
                buttonName: "remove",
                buttonText: "-"
            });
            allfileObj[type] = fileArray;
            this.setState({ fileData: allfileObj })
        } else {
            fileArray.splice(index, 1);
            allfileObj[type] = fileArray;
            this.setState({ fileData: allfileObj })
        }
        //console.log(this.state.fileData);

    }
    timeBar(type) {
        let timeBar;
        clearTimeout(timeBar);
        $("#" + type + "_select_box").next().fadeIn(300);
        timeBar = setTimeout(() => {
            $("#" + type + "_select_box").next().fadeOut(300);
        }, 3000)
    }
    show_send_mail(type) {
        this.setState({
            params_type: "remove_flie"
        })
        let doSend = true;
        if (type === "retailer") {
            if (this.state.retailer_select === 0) {
                this.timeBar(type);
                doSend = false;
                // }else if(this.state.fileData["birefing_pack_upload"][0].files <= 0 ){
                //     this.timeBar(type);
                //     doSend = false;
            } else {
                doSend = true;
            }
        } else {
            if (this.state.buyer_company_select === 0) {
                this.timeBar(type);
                doSend = false;
            }
            // else if(this.state.fileData["buyer_tc_upload"][0].files <= 0){
            //     this.timeBar(type);
            //     doSend = false;
            // }
            else {
                doSend = true;
            }
        }
        if (!doSend) {
            return false;
        }
        this.setState({
            role_name: type
        })
        this.refs.Modal.showModal("comfirm");
        this.setState({
            text: "Are you sure you want to send the invitation email(s)? Please note that the invitation email(s) will be immediately routed."
        });
    }
    send_mail() {
        let sendData = {};
        sendData = {
            id: sessionStorage.auction_id,
            data: { role_name: this.state.role_name }
        }
        sendMail(sendData).then(res => {
            let timeBar;
            this.refs.Modal.showModal();
            this.setState({
                text: "Invitation email(s) successfully sent.",
            });
            clearTimeout(timeBar);
            timeBar = setTimeout(() => {
                location.reload();
            }, 2000)
        }, error => {

        })
    }
    auction_contracts(data, index) {
        let html = <div key={index}>
            <h4 className="u-mt1 u-mb1">{data.contract_duration} Months</h4>
            <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                <thead>
                    <tr>
                        <th></th>
                        {this.state.publish_status === "1" ? (!data.has_lt ? <th style={{ display: 'none' }}></th> : <th>LT</th>) : <th>LT</th>}
                        {this.state.publish_status === "1" ? (!data.has_hts ? <th style={{ display: 'none' }}></th> : <th>HTS</th>) : <th>HTS</th>}
                        {this.state.publish_status === "1" ? (!data.has_htl ? <th style={{ display: 'none' }}></th> : <th>HTL</th>) : <th>HTL</th>}
                        {this.state.publish_status === "1" ? (!data.has_eht ? <th style={{ display: 'none' }}></th> : <th>EHT</th>) : <th>EHT</th>}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Peak<br />(7am-7pm)</td>
                        {this.state.publish_status === "1" ? (!data.has_lt ? <td style={{ display: 'none' }}></td> : <td >{data.total_lt_peak ? formatPower(parseInt(Number(data.total_lt_peak)), 0, '') : 0}</td>) : <td >{data.total_lt_peak ? formatPower(parseInt(Number(data.total_lt_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_hts ? <td style={{ display: 'none' }}></td> : <td >{data.total_hts_peak ? formatPower(parseInt(Number(data.total_hts_peak)), 0, '') : 0}</td>) : <td >{data.total_hts_peak ? formatPower(parseInt(Number(data.total_hts_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_htl ? <td style={{ display: 'none' }}></td> : <td >{data.total_htl_peak ? formatPower(parseInt(Number(data.total_htl_peak)), 0, '') : 0}</td>) : <td >{data.total_htl_peak ? formatPower(parseInt(Number(data.total_htl_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_eht ? <td style={{ display: 'none' }}></td> : <td >{data.total_eht_peak ? formatPower(parseInt(Number(data.total_eht_peak)), 0, '') : 0}</td>) : <td >{data.total_eht_peak ? formatPower(parseInt(Number(data.total_eht_peak)), 0, '') : 0}</td>}
                    </tr>
                    <tr>
                        <td>Off-Peak<br />(7pm-7am)</td>
                        {this.state.publish_status === "1" ? (!data.has_lt ? <td style={{ display: 'none' }}></td> : <td >{data.total_lt_peak ? formatPower(parseInt(Number(data.total_lt_off_peak)), 0, '') : 0}</td>) : <td >{data.total_lt_off_peak ? formatPower(parseInt(Number(data.total_lt_off_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_hts ? <td style={{ display: 'none' }}></td> : <td >{data.total_hts_peak ? formatPower(parseInt(Number(data.total_hts_off_peak)), 0, '') : 0}</td>) : <td >{data.total_hts_off_peak ? formatPower(parseInt(Number(data.total_hts_off_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_htl ? <td style={{ display: 'none' }}></td> : <td >{data.total_htl_peak ? formatPower(parseInt(Number(data.total_htl_off_peak)), 0, '') : 0}</td>) : <td >{data.total_htl_off_peak ? formatPower(parseInt(Number(data.total_htl_off_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_eht ? <td style={{ display: 'none' }}></td> : <td >{data.total_eht_peak ? formatPower(parseInt(Number(data.total_eht_off_peak)), 0, '') : 0}</td>) : <td >{data.total_eht_off_peak ? formatPower(parseInt(Number(data.total_eht_off_peak)), 0, '') : 0}</td>}
                    </tr>
                    <tr>
                        <td>Total</td>
                        {this.state.publish_status === "1" ? (!data.has_lt ? <td style={{ display: 'none' }}></td> : <td >{data.total_lt_peak ? formatPower(parseInt(Number(data.total_lt_peak)+Number(data.total_lt_off_peak)), 0, '') : 0}</td>) : <td >{data.total_lt_off_peak ? formatPower(parseInt(Number(data.total_lt_off_peak)+Number(data.total_lt_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_hts ? <td style={{ display: 'none' }}></td> : <td >{data.total_hts_peak ? formatPower(parseInt(Number(data.total_hts_peak)+Number(data.total_hts_off_peak)), 0, '') : 0}</td>) : <td >{data.total_hts_off_peak ? formatPower(parseInt(Number(data.total_hts_off_peak)+Number(data.total_hts_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_htl ? <td style={{ display: 'none' }}></td> : <td >{data.total_htl_peak ? formatPower(parseInt(Number(data.total_htl_peak)+Number( data.total_htl_off_peak)), 0, '') : 0}</td>) : <td >{data.total_htl_off_peak ? formatPower(parseInt(Number(data.total_htl_off_peak)+Number(data.total_htl_peak)), 0, '') : 0}</td>}
                        {this.state.publish_status === "1" ? (!data.has_eht ? <td style={{ display: 'none' }}></td> : <td >{data.total_eht_peak ? formatPower(parseInt(Number(data.total_eht_peak)+Number(data.total_eht_off_peak)), 0, '') : 0}</td>) : <td >{data.total_eht_off_peak ? formatPower(parseInt(Number(data.total_eht_off_peak)+Number(data.total_eht_peak)), 0, '') : 0}</td>}
                    </tr>
                </tbody>
            </table>
            <div className="col-sm-12 col-md-6"><a href={`/admin/auctions/${sessionStorage.auction_id}/consumption?type=2&contract_duration=${data.contract_duration}`} className="lm--button lm--button--primary col-sm-12"><span>Company Consumption Details</span></a></div>
        </div>
        return html
    }
    render() {
        let url;
        if (this.state.publish_status == 0) {
            url = "/admin/auctions/unpublished"
        } else {
            url = "/admin/auctions/published"
        }
        return (
            <div className="u-grid admin_invitation">
                {this.state.publish_status === "1" ? <TimeCuntDown auction={this.state.auction} countDownOver={() => { this.setState({ disabled: true }) }} timehidden="countdown_seconds" /> : ''}
                {sessionStorage.isAuctionId === "yes"
                    ? <div className="col-sm-12 col-md-8 push-md-2">
                        <h3 className="u-mt3 u-mb1">Invitation</h3>
                        <div className="invitation_main">
                            {(this.state.publish_status === "0" ?
                                <div>
                                    <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                                        <label className="lm--formItem-left lm--formItem-label string required">
                                            Buyers:
                                </label>
                                        <div className="lm--formItem-right lm--formItem-control" id="buyer_select_box">
                                            <abbr>Company Selected : {this.state.buyer_company_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Sent : {this.state.buyer_company_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.buyer_company_pend}</abbr>
                                            <abbr>Individual Selected : {this.state.buyer_individual_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Sent : {this.state.buyer_individual_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.buyer_individual_pend}</abbr>
                                        </div>
                                        <div className="required_error">
                                            Select at least one buyer and upload Buyer T&C.
                                </div>
                                    </div>
                                    {this.state.readOnly ? '' :
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                Buyer to Invite:
                                </label>
                                            <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=2`} className="lm--button lm--button--primary col-sm-12"><span>Select Company Buyers</span></a></div>
                                                {/*<div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=3`} className="lm--button lm--button--primary col-sm-12"><span>Select Individual Buyers</span></a></div>*/}
                                                <div className="col-sm-12 col-md-12 u-cell"><button className="lm--button lm--button--primary col-sm-12 orange" disabled={this.state.buyer_company_pend == 0 && this.state.buyer_individual_pend == 0 ? true : false} onClick={this.show_send_mail.bind(this, 'buyer')}><span>Send Invitation Email</span></button></div>
                                            </div>
                                        </div>}
                                </div>
                                : <div>
                                    <div className="lm--formItem lm--formItem--inline string role_select">
                                        <label className="lm--formItem-left lm--formItem-label string required">
                                            Retailers:
                            </label>
                                        <div className="lm--formItem-right lm--formItem-control" id="retailer_select_box">
                                            {this.state.readOnly ? <abbr>Invited : {this.state.retailer_select}</abbr> :
                                                <abbr>Selected : {this.state.retailer_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Sent : {this.state.retailer_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.retailer_pend}</abbr>}
                                        </div>
                                        <div className="required_error">
                                            Please upload Retailer Confidentiality Undertaking and Tender Documents.
                            </div>
                                    </div>
                                    {this.state.readOnly ? '' :
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                Retailer to Invite:
                            </label>
                                            <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                                <div className="col-sm-12 col-md-6 u-cell">
                                                    <a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=1`} className="lm--button lm--button--primary col-sm-12"><span>Select Retailers</span></a>
                                                </div>
                                                <div className="col-sm-12 col-md-6 u-cell"><button className="lm--button lm--button--primary col-sm-12 orange" disabled={this.state.retailer_pend == 0 ? true : false} onClick={this.show_send_mail.bind(this, 'retailer')}><span>Send Invitation Email</span></button></div>
                                            </div>
                                        </div>}
                                    <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                                        <label className="lm--formItem-left lm--formItem-label string required">
                                            Buyers:
                            </label>
                                        <div className="lm--formItem-right lm--formItem-control" id="buyer_select_box">
                                            <abbr>Company Invited : {this.state.buyer_company_select}</abbr>
                                            <abbr>Individual Invited : {this.state.buyer_individual_select}</abbr>
                                        </div>
                                        <div className="required_error">
                                            Select at least one buyer and upload Buyer T&C.
                            </div>
                                    </div> 
                                </div>
                            )}
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    Aggregate Consumption:<br /> (kWh/month)
                        </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    <div className="col-sm-12 u-cell consumption" id="aggregate_consumption">
                                        {this.state.auction.aggregate_auction_contracts ? (this.state.auction.aggregate_auction_contracts.length > 0 ?
                                            this.state.auction.aggregate_auction_contracts.map((item, index) => {
                                                return this.auction_contracts(item, index);
                                            }) : ''
                                        )
                                            : <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>LT</th>
                                                        <th>HTS</th>
                                                        <th>HTL</th>
                                                        <th>EHT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Peak<br />(7am-7pm)</td>
                                                        <td >{formatPower(this.state.peak_lt,0,'')}</td>
                                                        <td >{formatPower(this.state.peak_hts,0,'')}</td>
                                                        <td >{formatPower(this.state.peak_htl,0,'')}</td>
                                                        <td >{formatPower(this.state.peak_eht,0,'')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Off-Peak<br />(7pm-7am)</td>
                                                        <td >{formatPower(this.state.off_peak_lt,0,'')}</td>
                                                        <td >{formatPower(this.state.off_peak_hts,0,'')}</td>
                                                        <td >{formatPower(this.state.off_peak_htl,0,'')}</td>
                                                        <td >{formatPower(this.state.off_peak_eht,0,'')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total</td>
                                                        <td >{formatPower((parseInt(Number(this.state.peak_lt) + Number(this.state.off_peak_lt))), 0, '')}</td>
                                                        <td >{formatPower((parseInt(Number(this.state.peak_hts) + Number(this.state.off_peak_hts))), 0, '')}</td>
                                                        <td >{formatPower((parseInt(Number(this.state.peak_htl) + Number(this.state.off_peak_htl))), 0, '')}</td>
                                                        <td >{formatPower((parseInt(Number(this.state.peak_eht) + Number(this.state.off_peak_eht))), 0, '')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>}
                                        <div className="required_error">
                                            At least one field in intake level must have value greater than 0 kWh.
                                    </div>
                                    </div>
                                    {/*<div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/consumption?type=3`} className="lm--button lm--button--primary col-sm-12"><span>Individual Consumption Details</span></a></div>*/}
                                </div>
                            </div>
                            {/*<div className="lm--formItem lm--formItem--inline string u-mt3">*/}
                            {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Upload files:*/}
                            {/*</label>*/}
                            {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="lm--formItem lm--formItem--inline string">*/}
                            {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*/!* <abbr title="required">*</abbr>*!/*/}
                            {/*Buyer T&C Upload :*/}
                            {/*</label>*/}
                            {/*<div className="lm--formItem-right lm--formItem-control u-grid mg0">*/}
                            {/*{this.addinputfile("buyer_tc_upload", "required")}*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="lm--formItem lm--formItem--inline string">*/}
                            {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Retailer Confidentiality Undertaking Upload :*/}
                            {/*</label>*/}
                            {/*<div className="lm--formItem-right lm--formItem-control u-grid mg0">*/}
                            {/*{this.addinputfile("retailer_confidentiality_undertaking_upload", "required")}*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="lm--formItem lm--formItem--inline string">*/}
                            {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Tender Documents Upload :*/}
                            {/*</label>*/}
                            {/*<div className="lm--formItem-right lm--formItem-control u-grid mg0">*/}
                            {/*{this.addinputfile("tender_documents_upload", "required")}*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    Briefing Pack Upload :
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    {this.addinputfile("birefing_pack_upload", "required")}
                                </div>
                            </div>
                            <div className="retailer_btn">
                                <a className="lm--button lm--button--primary" href={this.state.publish_status === "0" ? "/admin/auctions/new" : "/admin/auctions/" + sessionStorage.auction_id + "/upcoming"}>Previous</a>
                                {this.state.readOnly ? '' : <a className="lm--button lm--button--primary" onClick={this.do_save.bind(this)}>Save</a>}
                                {this.state.readOnly ? '' : (this.state.publish_status === "0" ? <a className="lm--button lm--button--primary" id="doPublish" onClick={this.doPublish.bind(this)}>Publish</a> : '')}
                            </div>
                        </div>
                    </div>
                    : <div className="live_modal">
                        <p>
                            Please select an auction again.
                            </p>
                    </div>}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href={url} >Back</a>
                </div>

                <Modal text={this.state.text} acceptFunction={this.state.params_type === '' ? '' : (this.state.params_type === 'remove_file' ? this.do_remove.bind(this) : (this.state.params_type === 'do_publish' ? this.ra_publish.bind(this) : this.send_mail.bind(this)))} ref="Modal" />
            </div>
        )
    }
}
AdminInvitation.propTypes = { onAddClick: () => { } };
function run() {
    const domNode = document.getElementById('admin_invitation');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminInvitation),
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