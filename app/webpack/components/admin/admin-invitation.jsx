import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {raPublish,adminShowSelects,} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Modal} from '../shared/show-modal';
export default class AdminInvitation extends Component {
  constructor(props){
    super(props);
    this.state={
        text:"",
        retailer_select:0,retailer_send:0,retailer_pend:0,
        buyer_company_select:0,buyer_company_send:0,buyer_company_pend:0,
        buyer_individual_select:0,buyer_individual_send:0,buyer_individual_pend:0,
        peak_lt:0,peak_hts:0,peak_htl:0,eht_htl:0,
        off_peak_lt:0,off_peak_hts:0,off_peak_htl:0,off_eht_htl:0,
        fileData:{
                "buyer_tc_upload":[{buttonName:"none"}],
                "tender_documents_upload":[{buttonName:"add",buttonText:"+"}],
                "birefing_pack_upload":[{buttonName:"add",buttonText:"+"}]
            }
    }
}

componentDidMount() {
    adminShowSelects().then(res=>{
        console.log(res);
        this.setState({
            retailer_select:(res.retailers['2'] ? res.retailers['2'] : 0)+(res.retailers['3'] ? res.retailers['3'] : 0),
            retailer_send:res.retailers['3'] ? res.retailers['3'] : 0,
            retailer_pend:res.retailers['2'] ? res.retailers['2'] : 0,
            buyer_company_select:(res.company_buyers['2'] ? res.company_buyers['2'] : 0)+(res.company_buyers['3'] ? res.company_buyers['3'] : 0),
            buyer_company_send:res.company_buyers['3'] ? res.company_buyers['3'] : 0,
            buyer_company_pend:res.company_buyers['2'] ? res.company_buyers['2'] : 0,
            buyer_individual_select:(res.individual_buyers['2'] ? res.individual_buyers['2'] : 0)+(res.individual_buyers['3'] ? res.individual_buyers['3'] : 0),
            buyer_individual_send:res.individual_buyers['3'] ? res.individual_buyers['3'] : 0,
            buyer_individual_pend:res.individual_buyers['2'] ? res.individual_buyers['2'] : 0,
        })
    },error=>{
        this.setState({
            text:'Request exception failed!'
        });
        this.refs.Modal.showModal();
    })
    getAuction('admin',sessionStorage.auction_id).then(res=>{
        console.log(res);
        this.setState({
            peak_lt:res.total_lt_peak ? res.total_lt_peak : 0,
            peak_hts:res.total_hts_peak ? res.total_hts_peak : 0,
            peak_htl:res.total_htl_peak ? res.total_htl_peak : 0,
            peak_eht:res.total_eht_peak ? res.total_eht_peak : 0,
            off_peak_lt:res.total_lt_off_peak ? res.total_lt_off_peak : 0,
            off_peak_hts:res.total_hts_off_peak ? res.total_hts_off_peak : 0,
            off_peak_htl:res.total_htl_off_peak ? res.total_htl_off_peak : 0,
            off_peak_eht:res.total_eht_off_peak ? res.total_eht_off_peak : 0,
        })
    },error=>{
        this.setState({
            text:'Request exception failed!'
        });
        this.refs.Modal.showModal();
    })
    //window.location.href='';
    //alert(localStorage.auction_id);
}
upload(type,index){
    let barObj = $('#'+type+index).parents("a").next();
    $.ajax({
        url: '/api/admin/auction_attachments?auction_id='+sessionStorage.auction_id+'&file_type='+type+index,
        type: 'POST',
        cache: false,
        data: new FormData($('#'+type+"_form_"+index)[0]),
        processData: false,
        contentType: false,
        xhr:()=>{
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                //console.log(evt)
                if (evt.lengthComputable) {
                    let percentComplete = parseInt(evt.loaded / evt.total * 100, 10);
                    barObj.show();
                    barObj.find(".progress-bar").css('width',percentComplete + '%');
                    barObj.find(".progress-bar").text(percentComplete + '%');
                    if(percentComplete == 100){
                        barObj.find(".progress-bar").text('Processing..');
                    }
                }
            }, false);
            return xhr;
        },
        success:(res)=>{
            barObj.find(".progress-bar").text('upload successful!');
            $('#'+type+index).next().fadeOut(300);
        },
        error:()=>{
            barObj.find(".progress-bar").text('upload failed!');
            barObj.find(".progress-bar").css('background','red');
        }
    })
}
changefileval(id){
    let fileObj = $("#"+id);
    fileObj.parent().prev("dfn").text(fileObj.val());
    fileObj.next().fadeOut(300);
}
checkRequired(){
    let requiredObj = $("input[type='file'][required]"),result = true;
    for(let i=0; i<requiredObj.length; i++){
        if(requiredObj[i].value === ""){
            console.log($("#"+requiredObj[i].id).parents("a.upload_file_btn").next().find(".progress-bar").text());
            $("#"+requiredObj[i].id).next().fadeIn(300);
            result = false;
            break;            
        }else if($("#"+requiredObj[i].id).parents("a.upload_file_btn").next().find(".progress-bar").text() != "upload successful!"){
            $("#"+requiredObj[i].id).next().fadeIn(300);
            result = false;
            break; 
        }
    }
    return result;
}
doPublish(){
    let required;
    if(this.props.onAddClick){
        this.props.onAddClick();
    }
    if(this.state.eht_htl<=0 && this.state.off_eht_htl<=0
        && this.state.peak_lt<=0 && this.state.off_peak_lt<=0
        && this.state.peak_hts<=0 && this.state.off_peak_hts<=0
        && this.state.peak_htl<=0 && this.state.off_peak_htl<=0
    ){
        clearTimeout(required);
        $(".consumption .required_error").fadeIn(300);
        location.href="#aggregate_consumption";
        required = setTimeout(()=>{
            $(".consumption .required_error").fadeOut(300);
        },5000)
        return;
    }
    if(!this.checkRequired()){
        return;
    }
    raPublish({
        pagedata:{publish_status: '1'},
        id:sessionStorage.auction_id
    }).then(res => {
            this.auction = res;
            this.refs.Modal.showModal();
            this.setState({
                text:this.auction.name+" has been successfully published. Please go to 'Manage Published Upcoming Reverse Auction' for further actions.",
                disabled:true
            });
            // setTimeout(() => {
            //      window.location.href="/admin/home"
            //  },5000);
        }, error => {
            this.setState({
                text:'Request exception,Publish failed!'
            });
            this.refs.Modal.showModal();
        })
}
addinputfile(type,required){
        let fileHtml = '';
        fileHtml = <div className="file_box">
                        {this.state.fileData[type].map((item,index)=>{
                        return <form key={index} id={type+"_form_"+index} encType="multipart/form-data">
                                <div className="u-grid mg0 u-mt2" >
                                    <div className="col-sm-12 col-md-8 u-cell">
                                        <a className="upload_file_btn">
                                            <dfn>No file selected...</dfn>
                                            {/* accept="application/pdf,application/msword" */}
                                            {required == "required" ? <div>
                                            <input type="file" required="required" ref={type+index} onChange={this.changefileval.bind(this,type+index)} id={type+index} name="file" disabled={this.state.disabled} />
                                            <div className="required_error">
                                                Please fill out this field and upload this file
                                            </div></div> 
                                            : <input type="file" ref={type+index} onChange={this.changefileval.bind(this,type+index)} id={type+index} name="file" disabled={this.state.disabled} />}
                                            <span>Browse..</span>
                                        </a>
                                        <div className="progress">
                                            <div className="progress-bar" style={{width:"0%"}}>0%</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 u-cell">
                                        <a className="lm--button lm--button--primary" onClick={this.upload.bind(this,type,index)}>Upload</a>
                                    </div>
                                    <div className="col-sm-12 col-md-2 u-cell">
                                        {item.buttonName === "none" ? "" : <a onClick={this.fileclick.bind(this,index,type,item.buttonName)} className={"lm--button lm--button--primary "+item.buttonName}>{item.buttonText}</a>}
                                    </div>
                                </div>
                                </form>
                        })}
                    </div>
        return fileHtml;
    }
    fileclick(index,type,typeName,obj){
        let fileArray = [],allfileObj={};
            allfileObj = this.state.fileData;
            fileArray = this.state.fileData[type];
            if(typeName == "add"){
                fileArray.push({buttonName:"remove",buttonText:"-"});
                allfileObj[type] = fileArray;
                this.setState({
                    fileData:allfileObj
                })
            }else{
                fileArray.splice(index,1);
                allfileObj[type] = fileArray;
                this.setState({
                    fileData:allfileObj
                })
            }
            console.log(this.state.fileData);   

    }
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid admin_invitation">
            {sessionStorage.isAuctionId === "yes" ?
                <div className="col-sm-12 col-md-8 push-md-2">
                    <h3 className="u-mt3 u-mb1">invitation</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Retailers:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <abbr>Selected : {this.state.retailer_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Send : {this.state.retailer_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.retailer_pend}</abbr>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Retailer to Invite:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 col-md-6 u-cell">
                                <a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=1`} className="lm--button lm--button--primary col-sm-12">Selected Retailers</a>
                            </div>                     
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string u-mt3">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Buyers:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <abbr>Company Selected : {this.state.buyer_company_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Send : {this.state.buyer_company_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.buyer_company_pend}</abbr>
                            <abbr>Individual Selected : {this.state.buyer_individual_select}&nbsp;&nbsp;&nbsp;&nbsp;Notification Send : {this.state.buyer_individual_send}&nbsp;&nbsp;&nbsp;&nbsp;Pending Notification : {this.state.buyer_individual_pend}</abbr>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Buyer to Invite:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=2`} className="lm--button lm--button--primary col-sm-12">Selected Company Buyers</a></div>
                        <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=3`} className="lm--button lm--button--primary col-sm-12">Selected Individual Buyers</a></div>
                        <div className="col-sm-12 col-md-12 u-cell"><a className="lm--button lm--button--primary col-sm-12 orange">Send Invitation Email</a></div>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 u-cell consumption" id="aggregate_consumption">
                                <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
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
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/comsumption?type=2`} className="lm--button lm--button--primary col-sm-12">Company Consumption Details</a></div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/comsumption?type=3`} className="lm--button lm--button--primary col-sm-12">Individual Consumption Details</a></div>                
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
                        {this.addinputfile("buyer_tc_upload","required")}
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Tender Documents Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("tender_documents_upload","required")}
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
                        <a className="lm--button lm--button--primary" href="/admin/auctions/new">Previous</a>
                        <a className="lm--button lm--button--primary">Save</a>
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
                <Modal text={this.state.text} ref="Modal" />
            </div>
    )
  }
}
AdminInvitation.propTypes = {
    onAddClick: ()=>{}
  };
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