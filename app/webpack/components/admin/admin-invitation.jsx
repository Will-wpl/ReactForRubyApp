import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {adminShowSelects,getFileList,raPublish,sendMail,removeFile} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Modal} from '../shared/show-modal';
export default class AdminInvitation extends Component {
  constructor(props){
    super(props);
    this.state={
        text:"",role_name:"",retailer_select:0,retailer_send:0,
        retailer_pend:0,buyer_company_select:0,buyer_company_send:0,
        buyer_company_pend:0,buyer_individual_select:0,buyer_individual_send:0,
        buyer_individual_pend:0,peak_lt:0,peak_hts:0,
        peak_htl:0,peak_eht:0,off_peak_lt:0,off_peak_hts:0,
        off_peak_htl:0,off_peak_eht:0,disabled:false,publish_status:0,
        params_type:"",
        fileData:{
                "buyer_tc_upload":[
                    {buttonName:"none",files:[]}
                ],
                "retailer_confidentiality_undertaking_upload":[
                    {buttonName:"none",files:[]}
                ],
                "tender_documents_upload":[
                    {buttonName:"none",files:[]}
                ],
                "birefing_pack_upload":[
                    {buttonName:"none",files:[]}
                ]
            }
    }
 }

componentDidMount() {
    adminShowSelects().then((res) => {
        console.log(res);
        this.setState({
            retailer_select:(res.retailers['2'] ? res.retailers['2'] : 0)+(res.retailers['1'] ? res.retailers['1'] : 0),
            retailer_send:res.retailers['1'] ? res.retailers['1'] : 0,
            retailer_pend:res.retailers['2'] ? res.retailers['2'] : 0,
            buyer_company_select:(res.company_buyers['2'] ? res.company_buyers['2'] : 0)+(res.company_buyers['1'] ? res.company_buyers['1'] : 0),
            buyer_company_send:res.company_buyers['1'] ? res.company_buyers['1'] : 0,
            buyer_company_pend:res.company_buyers['2'] ? res.company_buyers['2'] : 0,
            buyer_individual_select:(res.individual_buyers['2'] ? res.individual_buyers['2'] : 0)+(res.individual_buyers['1'] ? res.individual_buyers['1'] : 0),
            buyer_individual_send:res.individual_buyers['1'] ? res.individual_buyers['1'] : 0,
            buyer_individual_pend:res.individual_buyers['2'] ? res.individual_buyers['2'] : 0
        })
    }, (error) => {
        this.setState({text:'Request exception failed!'});
        this.refs.Modal.showModal();
    })
    getAuction('admin', sessionStorage.auction_id).then((res) => {
        console.log(res);
        this.setState({
            peak_lt:res.total_lt_peak ? parseInt(Number(res.total_lt_peak)) : 0,
            peak_hts:res.total_hts_peak ? parseInt(Number(res.total_hts_peak)) : 0,
            peak_htl:res.total_htl_peak ? parseInt(Number(res.total_htl_peak)) : 0,
            peak_eht:res.total_eht_peak ? parseInt(Number(res.total_eht_peak)) : 0,
            off_peak_lt:res.total_lt_off_peak ? parseInt(Number(res.total_lt_off_peak)) : 0,
            off_peak_hts:res.total_hts_off_peak ? parseInt(Number(res.total_hts_off_peak)) : 0,
            off_peak_htl:res.total_htl_off_peak ? parseInt(Number(res.total_htl_off_peak)) : 0,
            off_peak_eht:res.total_eht_off_peak ? parseInt(Number(res.total_eht_off_peak)) : 0,
            publish_status:res.publish_status
        })
    }, (error) => {
        this.setState({text:'Request exception failed!'});
        this.refs.Modal.showModal();
    })
    getFileList(sessionStorage.auction_id).then(res=>{
        let fileObj;
        fileObj = this.state.fileData;
        res.map((item,index)=>{
            fileObj[item.file_type][0].files.push({
                id:item.id,
                file_name:item.file_name,
                file_path:item.file_path 
            })
        })
        this.setState({ 
            fileData:fileObj
        })
    },error=>{

    })
    //window.location.href='';
    //alert(localStorage.auction_id);
}
upload(type, index){
    if($("#"+type+index).val() === ""){
        $("#"+type+index).next().next().fadeIn(300);
        return;
    }
    if(type === "buyer_tc_upload" || type === "retailer_confidentiality_undertaking_upload"){
        if(this.state.fileData[type][index].files.length > 0){
            this.setState({text:'This field can only upload one file !'});
            this.refs.Modal.showModal();
            return;
        }
    }
    const barObj = $('#'+type+index).parents("a").next();
    $.ajax({
        url: '/api/admin/auction_attachments?auction_id='+sessionStorage.auction_id+'&file_type='+type,
        type: 'POST',
        cache: false,
        data: new FormData($('#'+type+"_form")[0]),
        processData: false,
        contentType: false,
        xhr:() => {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                //console.log(evt)
                if (evt.lengthComputable) {
                    const percentComplete = parseInt(evt.loaded / evt.total * 100, 10);
                    barObj.show();
                    barObj.find(".progress-bar").css('width', percentComplete + '%');
                    barObj.find(".progress-bar").text(percentComplete + '%');
                    if(percentComplete == 100){
                        barObj.find(".progress-bar").text('Processing..');
                    }
                }
            }, false);
            return xhr;
        },
        success:(res) => {
            let fileObj;
            $("#"+type+index).next().next().hide();
            barObj.find(".progress-bar").text('Upload Successful!');
            setTimeout(()=>{
                barObj.fadeOut(500);
            },2000)
            fileObj = this.state.fileData;
            fileObj[type].map((item,index)=>{
                item.files.push({
                    id:res.id,
                    file_name:res.file_name,
                    file_path:res.file_path //replace((res.file_path.split(`uploads/attachments/${res.auction_id}/`)[1]),res.file_name)
                })
            })
            this.setState({
                fileData:fileObj
            })
            console.log(res);
        },error:() => {
                    barObj.find(".progress-bar").text('Upload failed!');
                    barObj.find(".progress-bar").css('background', 'red');
                }
            })
        }
        changefileval(id){
            const fileObj = $("#"+id);
            fileObj.parent().prev("dfn").text(fileObj.val());
        }
        checkRequired(){
            let requiredObj = this.state.fileData,result = true; //$("input[type='file'][required]"),
            if(requiredObj['buyer_tc_upload'][0].files.length <=0){
                $("#buyer_tc_upload0").next().next().fadeIn(300);
                result = false;
            }
            if(requiredObj['retailer_confidentiality_undertaking_upload'][0].files.length <=0){
                $("#retailer_confidentiality_undertaking_upload0").next().next().fadeIn(300);
                result = false;
            }
            if(requiredObj['tender_documents_upload'][0].files.length <=0){
                $("#tender_documents_upload0").next().next().fadeIn(300);
                result = false;
            }
                // for(let i=0; i<requiredObj.length; i++){
                //     if(requiredObj[i].value === ""){
                //         //console.log($("#"+requiredObj[i].id).parents("a.upload_file_btn").next().find(".progress-bar").text());
                //         $("#"+requiredObj[i].id).next().fadeIn(300);
                //         result = false;
                //         break;
                //     }else if($("#"+requiredObj[i].id).parents("a.upload_file_btn").next().find(".progress-bar").text() != "upload successful!"){
                //         $("#"+requiredObj[i].id).next().fadeIn(300);
                //         result = false;
                //         break;
                //     }
                // }
            return result;
        }
        doPublish(){
            let required;
            if(this.props.onAddClick){
                this.props.onAddClick();
            }
            if(this.state.buyer_company_select === 0 && this.state.buyer_individual_select === 0){
                clearTimeout(required);
                $("#buyer_select_box").next().fadeIn(300);
                location.href="#buyer_select_box";
                required = setTimeout(()=>{
                    $("#buyer_select_box").next().fadeOut(300);
                },5000)
                return;
            }
            if(this.state.peak_eht<=0 && this.state.off_peak_eht<=0 &&
                this.state.peak_lt<=0 && this.state.off_peak_lt<=0 &&
                this.state.peak_hts<=0 && this.state.off_peak_hts<=0 &&
                this.state.peak_htl<=0 && this.state.off_peak_htl<=0
            ){
                clearTimeout(required);
                $(".consumption .required_error").fadeIn(300);
                location.href="#aggregate_consumption";
                required = setTimeout(() => {
                    $(".consumption .required_error").fadeOut(300);
                }, 5000)
                return;
            }
            if(!this.checkRequired()){
                return;
            }
            // if(this.state.retailer_select === 0){
            //     clearTimeout(required);
            //     $("#retailer_select_box").next().fadeIn(300);
            //     location.href="#retailer_select_box";
            //     required = setTimeout(()=>{
            //         $("#retailer_select_box").next().fadeOut(300);
            //     },5000)
            //     return;
            // }
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to publish this auction?",
                params_type:'do_publish'
            });
        }
        ra_publish(){
            raPublish({
                pagedata:{publish_status: '1'},
                id:sessionStorage.auction_id
            }).then((res) => {
                    this.auction = res;
                    this.refs.Modal.showModal();
                    this.setState({
                        text:this.auction.name+" has been successfully published. Please go to 'Manage Published Upcoming Reverse Auction' for further actions.",
                        disabled:true
                    });
                    setTimeout(() => {
                          window.location.href="/admin/auctions/published"
                    },2000);
                }, (error) => {
                    this.setState({text:'Request exception,Publish failed!'});
                    this.refs.Modal.showModal();
                })
        }
        remove_file(filetype,typeindex,fileindex,fileid){
            this.setState({
                params_type:"remove_file"
            })
            let obj = {
                filetype:filetype,
                typeindex:typeindex,
                fileindex:fileindex,
                fileid:fileid
            }
            this.setState({text:'Are you sure want to delete this file?'});
            this.refs.Modal.showModal("comfirm",obj);
        }
        do_remove(callbackObj){
            let fileObj;
            removeFile(callbackObj.fileid).then(res=>{
                fileObj = this.state.fileData;
                fileObj[callbackObj.filetype][callbackObj.typeindex].files.splice(callbackObj.fileindex,1);
                this.setState({
                    fileData:fileObj
                })
            },error=>{

            })
        }
        addinputfile(type, required){
                let fileHtml = '';
                fileHtml = <div className="file_box">
                            <form id={type+"_form"} encType="multipart/form-data">
                                {this.state.fileData[type].map((item, index) => 
                                        <div className="u-grid mg0 u-mt1" key={index}>
                                            <div className="col-sm-12 col-md-10 u-cell">
                                                <a className="upload_file_btn">
                                                    <dfn>No file selected...</dfn>
                                                    {/* accept="application/pdf,application/msword" */}
                                                    {required === "required" ? 
                                                    <div>
                                                        <input type="file" required="required" ref={type+index}  onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.state.disabled} />
                                                        <span>Browse..</span>
                                                        <div className="required_error">
                                                            Please fill out this field and upload this file
                                                        </div>
                                                    </div>
                                                    :<div>
                                                        <input type="file" ref={type+index} onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.state.disabled} />
                                                        <span>Browse..</span>
                                                    </div>}
                                                </a>
                                                <div className="progress">
                                                    <div className="progress-bar" style={{width:"0%"}}>0%</div>
                                                </div>
                                                <div className="progress_files">
                                                    <ul>
                                                        {
                                                            item.files.map((it,i)=>{
                                                                return <li key={i}><a download={it.file_name} href={"/"+it.file_path}>{it.file_name}</a><span className="remove_file" onClick={this.remove_file.bind(this,type,index,i,it.id)}></span></li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2 u-cell">
                                                <a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)}>Upload</a>
                                            </div>
                                            {/* <div className="col-sm-12 col-md-2 u-cell">
                                                {item.buttonName === "none" ? "" : <a onClick={this.fileclick.bind(this, index, type, item.buttonName)} className={"lm--button lm--button--primary "+item.buttonName}>{item.buttonText}</a>}
                                            </div> */}
                                        </div>
                                        )}
                             </form>
                            </div>
                return fileHtml;
            }
            fileclick(index, type, typeName, obj){
                let fileArray = [],
                    allfileObj={};
                    allfileObj = this.state.fileData;
                    fileArray = this.state.fileData[type];
                    if(typeName == "add"){
                        fileArray.push({
                        buttonName:"remove",
                        buttonText:"-"
                        });
                        allfileObj[type] = fileArray;
                        this.setState({fileData:allfileObj})
                    }else{
                        fileArray.splice(index, 1);
                        allfileObj[type] = fileArray;
                        this.setState({fileData:allfileObj})
                    }
                    console.log(this.state.fileData);

            }
            timeBar(type){
                let timeBar;
                clearTimeout(timeBar);
                $("#"+type+"_select_box").next().fadeIn(300);
                timeBar = setTimeout(()=>{
                    $("#"+type+"_select_box").next().fadeOut(300);
                },3000)
            }
            show_send_mail(type){
                this.setState({
                    params_type:"remove_flie"
                })
                let doSend = true;
                if(type === "retailer"){
                    if(this.state.retailer_select === 0){
                        this.timeBar(type);
                        doSend = false;
                    }else if(this.state.fileData["retailer_confidentiality_undertaking_upload"][0].files <= 0){
                        this.timeBar(type);
                        doSend = false;
                    }else{
                        doSend = true;
                    }
                }else{
                    if(this.state.buyer_company_select === 0 && this.state.buyer_individual_select === 0){
                        this.timeBar(type);
                        doSend = false;
                    }else if(this.state.fileData["buyer_tc_upload"][0].files <= 0){
                        this.timeBar(type);
                        doSend = false;
                    }else{
                        doSend = true;
                    }
                }
                if(!doSend){
                    return false;
                }
                this.setState({
                    role_name:type
                })
                this.refs.Modal.showModal("comfirm");
                this.setState({
                    text:"Are you sure want to send this message?",
                });
            }
        send_mail(){
            let sendData = {};
            sendData = {
                id:sessionStorage.auction_id,
                data:{role_name:this.state.role_name}
            }
            sendMail(sendData).then(res=>{
                let timeBar;
                this.refs.Modal.showModal();
                this.setState({
                    text:"Send message has been successful!",
                });
                clearTimeout(timeBar);
                timeBar = setTimeout(()=>{
                    location.reload();
                },5000)
            },error=>{

            })
        }
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid admin_invitation">
            {sessionStorage.isAuctionId === "yes"
                ? <div className="col-sm-12 col-md-8 push-md-2">
                    <h3 className="u-mt3 u-mb1">Invitation</h3>
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
                                At least select one Buyer and Upload one file for Buyer T&C Upload.
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                Buyer to Invite:
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=2`} className="lm--button lm--button--primary col-sm-12">Select Company Buyers</a></div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=3`} className="lm--button lm--button--primary col-sm-12">Select Individual Buyers</a></div>
                                <div className="col-sm-12 col-md-12 u-cell"><a className="lm--button lm--button--primary col-sm-12 orange" onClick={this.show_send_mail.bind(this,'buyer')}>Send Invitation Email</a></div>
                                </div>
                            </div>
                        </div>
                     :<div> 
                        <div className="lm--formItem lm--formItem--inline string role_select">
                            <label className="lm--formItem-left lm--formItem-label string required">
                            Retailers:
                            </label>
                            <div className="lm--formItem-right lm--formItem-control" id="retailer_select_box">
                                <abbr>Selected : {this.state.retailer_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Sent : {this.state.retailer_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.retailer_pend}</abbr>
                            </div>
                            <div className="required_error">
                                Please select at least one retailer and Upload one file for Retailer Confidentiality Undertaking Upload.
                            </div>
                        </div>
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-left lm--formItem-label string required">
                            Retailer to Invite:
                            </label>
                            <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                <div className="col-sm-12 col-md-6 u-cell">
                                    <a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=1`} className="lm--button lm--button--primary col-sm-12">Select Retailers</a>
                                </div>
                                <div className="col-sm-12 col-md-6 u-cell"><a className="lm--button lm--button--primary col-sm-12 orange" onClick={this.show_send_mail.bind(this,'retailer')}>Send Invitation Email</a></div>
                            </div>
                        </div>
                        <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                            <label className="lm--formItem-left lm--formItem-label string required">
                            Buyers:
                            </label>
                            <div className="lm--formItem-right lm--formItem-control" id="buyer_select_box">
                                <abbr>Company Invited : {this.state.buyer_company_select}</abbr>
                                <abbr>Individual Invited : {this.state.buyer_individual_select}</abbr>
                            </div>
                            <div className="required_error">
                                At least select one Buyer and Upload one file for Buyer T&C Upload.
                            </div>
                        </div>
                    </div>
                    )}
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 u-cell consumption" id="aggregate_consumption">
                                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>LT</th>
                                            <th>HT (Small)</th>
                                            <th>HT (Large)</th>
                                            <th>EHT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Peak (7am-7pm)</td>
                                                <td >{this.state.peak_lt}</td>
                                                <td >{this.state.peak_hts}</td>
                                                <td >{this.state.peak_htl}</td>
                                                <td >{this.state.peak_eht}</td>
                                            </tr>
                                            <tr>
                                                <td>Off-Peak (7pm-7am)</td>
                                                <td >{this.state.off_peak_lt}</td>
                                                <td >{this.state.off_peak_hts}</td>
                                                <td >{this.state.off_peak_htl}</td>
                                                <td >{this.state.off_peak_eht}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="required_error">
                                        At least one field in intake level must have value greater than 0 kWh.
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/consumption?type=2`} className="lm--button lm--button--primary col-sm-12">Company Consumption Details</a></div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/consumption?type=3`} className="lm--button lm--button--primary col-sm-12">Individual Consumption Details</a></div>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string u-mt3">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Upload files:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Buyer T&C Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("buyer_tc_upload", "required")}
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Retailer Confidentiality Undertaking Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("retailer_confidentiality_undertaking_upload", "required")}
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Tender Documents Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("tender_documents_upload", "required")}
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Birefing Pack Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("birefing_pack_upload")}
                        </div>
                    </div>
                    <div className="retailer_btn">
                        <a className="lm--button lm--button--primary" href={this.state.publish_status === "0" ? "/admin/auctions/new" : "/admin/auctions/"+sessionStorage.auction_id+"/upcoming"}>Previous</a>
                        {/* <a className="lm--button lm--button--primary">Save</a> */}
                        <a className="lm--button lm--button--primary" id="doPublish" onClick={this.doPublish.bind(this)}>Publish</a>
                    </div>
                </div>
                : <div className="live_modal">
                            <p>
                                Please select an auction again.
                            </p>
                        </div>}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.params_type===''?'':(this.state.params_type==='remove_file'?this.do_remove.bind(this):(this.state.params_type==='do_publish'?this.ra_publish.bind(this):this.send_mail.bind(this)))} ref="Modal" />
            </div>
    )
  }
}
AdminInvitation.propTypes = {onAddClick: () => {}};
function run() {
    const domNode = document.getElementById('admin_invitation');
    if(domNode !== null){
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