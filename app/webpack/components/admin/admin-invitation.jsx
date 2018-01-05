import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {raPublish} from '../../javascripts/componentService/admin/service';
import {Modal} from '../shared/show-modal';
export default class AdminInvitation extends Component {
  constructor(props){
    super(props);
    this.state={
        text:"",
        fileData:{
                "buyer_tc_upload":[{buttonName:"none"}],
                "tender_documents_upload":[{buttonName:"add",buttonText:"+"}],
                "birefing_pack_upload":[{buttonName:"add",buttonText:"+"}]
            }
    }
}

componentDidMount() {
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
    if(this.props.onAddClick){
        this.props.onAddClick();
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
                            <abbr>You have selected 5 retailers</abbr>
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
                            <abbr>You have selected 0 company buyers and 6 individual buyers.</abbr>
                            <abbr>You have selected send to 6 buyers</abbr>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Buyer to Invite:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=2`} className="lm--button lm--button--primary col-sm-12">Selected Company Retailers</a></div>
                        <div className="col-sm-12 col-md-6 u-cell"><a href={`/admin/auctions/${sessionStorage.auction_id}/select?type=3`} className="lm--button lm--button--primary col-sm-12">Selected Individual Retailers</a></div>
                        <div className="col-sm-12 col-md-12 u-cell"><a className="lm--button lm--button--primary col-sm-12 orange">Send Invitation Email</a></div>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 u-cell">
                                <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>LT</th>
                                            <th>HT (Small)</th>
                                            <th>HT (Large)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Peak (7am-7pm)</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                            </tr>
                                            <tr>
                                                <td>Off-Peak (7pm-7am)</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                            </tr>
                                        </tbody>
                                    </table>
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