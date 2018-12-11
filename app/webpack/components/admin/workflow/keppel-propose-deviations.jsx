import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {Showhistory} from '../../shared/show-history';
import {adminSendResponse,getAdminDeviations,removeAdminFile} from '../../../javascripts/componentService/admin/service';
import {getTenderhistory} from '../../../javascripts/componentService/common/service';
export class Keppelproposedeviations extends Component {
    constructor(props, context){
        super(props);
        this.state={
            deviations_list:[],
            buttonType:'',detailType:'',
            title:'',detail:'',detail_id:'',textdisabled:false,
            status:null,user_id:0,
            fileData:{
                "attachment_deviation":[
                    {buttonName:"none",files:[]}
                ]
            }
        }
    }
    componentDidMount(){
        console.log(this.props.role_name);
        getAdminDeviations(this.props.current.current.arrangement_id).then(res=>{
            //console.log(res);
            if(res.chats.length > 0){
                //console.log(res.chats);
                let fileObj;
                fileObj = this.state.fileData;
                res.attachments.map((item,index)=>{
                    fileObj[item.file_type][0].files.push({
                        id:item.id,
                        file_name:item.file_name,
                        file_path:item.file_path
                    })
                })
                this.setState({deviations_list:res.chats,fileData:fileObj,user_id:res.retailer_id});
            }else{
                this.setState({
                    deviations_list:[
                        {id:0,item:1,clause:'',propose_deviation:'',retailer_response:'',sp_response:'',response_status:["",""]},
                    ]
                })
            }
        })
        $(".createRaMain a").attr("href",window.location.href);
    }
    editData(){
        let deviationslist = [];
        this.state.deviations_list.map((item, index) => {
            let obj = {
                id:""+item.id+"",
                sp_response:item.sp_response!=null?item.sp_response:"",
                sp_response_status:item.sp_response_status
            }
            deviationslist.push(obj);
            //deviationslist += '{"id":"'+item.id+'","sp_response":"'+(item.sp_response!=null?item.sp_response:"")+'","sp_response_status":"'+item.sp_response_status+'"},';
        })
        //deviationslist = deviationslist.substr(0, deviationslist.length-1);
        //deviationslist = '['+deviationslist+']';
        //console.log(JSON.stringify(deviationslist));
        return JSON.stringify(deviationslist);
    }
    showConfirm(type,obj){
        this.setState({buttonType:type});
        if(type == "Send_Response"){
            let send = this.state.deviations_list.find(item=>{
                return item.sp_response_status ==='2'||item.sp_response_status ==='3'
            })
            if(send){
                this.refs.Modal.showModal();
                this.setState({
                    text:"Please accept or reject the deviation."
                });
                return;
            }
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to send response?"
            });
        }else if(type == "reject"){
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure you want to reject this submission?"
            });
        }else{
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure you want to accept this submission?"
            });
        }
    }
    showhistory(id){
        this.setState({detailType:"history"})
        getTenderhistory('admin',id).then(res=>{
            //console.log(res);
            this.refs.history.showModal(res);
        })
    }
    showpropose(title,detail,id,disabled,status){
        this.setState({
            detailType:"propose",
            title:title,
            detail:detail,
            detail_id:id,
            textdisabled:disabled,
            status:status
        })
        this.refs.history.showModal(null,"propose");
    }
    editDetail(detail){
        //console.log(this.state.detail_id);
        if(this.state.detail_id != ''){
            let list = this.state.deviations_list,id=this.state.detail_id;
            list[id.split("_")[1]].sp_response = detail;
            this.setState({deviations_list:list});
        }
    }
    send_response(){
        adminSendResponse(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Response successfully sent."
            });
            setTimeout(()=>{
                window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
            },3000)

        })
    }
    do_keppel(obj){
        let deviationslist = this.state.deviations_list;
        deviationslist[obj.index].sp_response_status = obj.params;
        deviationslist[obj.index].type = obj.type;
        deviationslist[obj.index].response_status[1] = obj.params;
        //deviationslist[obj.index].sp_response = '';
        this.setState({deviations_list:deviationslist});
        //console.log(this.state.deviations_list);
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
                                                <input type="file" required="required" ref={type+index}  onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.props.propsdisabled?true:(window.location.href.indexOf("past")>0 || this.props.current.user_info.readonly?true:this.state.disabled)} />
                                                <b>Browse..</b>
                                                <div className="required_error">
                                                    Please select file.
                                                </div>
                                            </div>
                                            :<div>
                                                <input type="file" ref={type+index} onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.props.propsdisabled?true:(window.location.href.indexOf("past")>0  || this.props.current.user_info.readonly?true:this.state.disabled)} />
                                                <b>Browse..</b>
                                            </div>}
                                        </a>
                                        <div className="progress">
                                            <div className="progress-bar" style={{width:"0%"}}>0%</div>
                                        </div>
                                        <div className="progress_files">
                                            <ul>
                                                {
                                                    item.files.map((it,i)=>{
                                                        return <li key={i}><a target="_blank" download={it.file_name} href={it.file_path}>{it.file_name}</a>{this.props.propsdisabled?'':(this.state.disabled?'':(window.location.href.indexOf("past")>0 || this.props.current.user_info.readonly?'':<span className="remove_file" onClick={this.remove_file.bind(this,type,index,i,it.id)}></span>))}</li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 u-cell">
                                        {
                                            this.props.propsdisabled?<button className="lm--button lm--button--primary" disabled>Upload</button>:(this.state.disabled?<button className="lm--button lm--button--primary" disabled>Upload</button>
                                            :(window.location.href.indexOf("past")>0 || this.props.current.user_info.readonly?<button className="lm--button lm--button--primary" disabled>Upload</button>:<a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)}>Upload</a>))
                                        }
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
    changefileval(id){
        const fileObj = $("#"+id);
        fileObj.parent().prev("dfn").text(fileObj.val());
    }
    upload(type, index){
        let time = null
        if($("#"+type+index).val() === ""){
            $("#"+type+index).next().next().fadeIn(300);
            clearTimeout(time);
            time = setTimeout(()=>{
                $("#"+type+index).next().next().hide();
            },2000)
            return;
        }
        const barObj = $('#'+type+index).parents("a").next();
        $.ajax({
            url: '/api/admin/auction_attachments?auction_id='+sessionStorage.auction_id+'&file_type='+type+'&user_id='+this.state.user_id,
            type: 'POST',
            cache: false,
            data: new FormData($('#'+type+"_form")[0]),
            processData: false,
            contentType: false,
            xhr:() => {
                var xhr = new window.XMLHttpRequest();
                this.setState({
                    disabled: true
                })
                xhr.upload.addEventListener("progress", function (evt) {
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
                barObj.find(".progress-bar").text('Upload Successful!');
                setTimeout(()=>{
                    barObj.fadeOut(500);
                    $('.dfn').html('Please select file.')
                    this.setState({
                        disabled: false
                    })
                },2000);

                fileObj = this.state.fileData;
                fileObj[type].map((item,index)=>{
                    item.files.push({
                        id:res.id,
                        file_name:res.file_name,
                        file_path:res.file_path
                    })
                })
                this.setState({
                    fileData:fileObj
                })
                $("#" + type + index).val('');
                //console.log(res);
            },error:() => {
                        barObj.find(".progress-bar").text('upload failed!');
                        barObj.find(".progress-bar").css('background', 'red');
                        this.setState({
                            disabled: false
                        })
                    }
                })
            }
            remove_file(filetype,typeindex,fileindex,fileid){
                this.setState({
                    buttonType:"remove_file"
                })
                let obj = {
                    filetype:filetype,
                    typeindex:typeindex,
                    fileindex:fileindex,
                    fileid:fileid
                }
                //console.log(obj);
                this.setState({text:'Are you sure you want to delete this file?'});
                this.refs.Modal.showModal("comfirm",obj);
            }
            do_remove(callbackObj){
                //console.log(callbackObj);
                let fileObj;
                removeAdminFile(callbackObj.fileid).then(res=>{
                    fileObj = this.state.fileData;
                    fileObj[callbackObj.filetype][callbackObj.typeindex].files.splice(callbackObj.fileindex,1);
                    this.setState({
                        fileData:fileObj,
                        text:'File deletion successful!'
                    })
                    this.refs.Modal.showModal();
                },error=>{

                })
            }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt3 u-mb3">{this.props.current.name} Propose Deviations</h2>
                <div className="col-sm-12 col-md-12 propose_deviations">
                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            {/*<th>Item</th>*/}
                            <th>Clause</th>
                            <th>Propose Deviation</th>
                            <th>Retailer Comments</th>
                            <th>{this.props.role_name?this.props.role_name:"SP"} Response</th>
                            <th>Deviation Status</th>
                            <th></th>
                            </tr>
                    </thead>
                    <tbody>
                            {this.state.deviations_list.map((item,index)=>{
                                if(!item.type){
                                    if(item.sp_response_status === '4' || item.sp_response_status === '1'){
                                        return <tr key={index}>
                                                {/*<td>{item.item}</td>*/}
                                                <td >{item.clause}</td>
                                                <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'',true,false)} >Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,`${this.props.role_name?this.props.role_name:"SP"} Response`,item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                <td>{item.sp_response_status === "1"?"Accepted":"Withdrawn"}</td>
                                                <td>
                                                    <button id={"sp_reject_"+index} disabled>Reject</button>
                                                    <button id={"sp_accept_"+index} disabled>Accept</button>
                                                    <button id={"sp_history_"+index} onClick={this.showhistory.bind(this,item.id)}>History</button>
                                                </td>
                                            </tr>
                                    }
                                }
                                return <tr key={index}>
                                            {/*<td>{item.item}</td>*/}
                                            <td >{item.clause}</td>
                                            <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button></td>
                                            <td><button onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'',true,false)} >Details</button></td>
                                            <td>
                                            <button id={"spResponse_"+index} onClick={this.showpropose.bind(this,`${this.props.role_name?this.props.role_name:"SP"} Response`,item.sp_response!=null?item.sp_response:'',"spResponse_"+index,this.props.readOnly,item.response_status)} >Details</button>
                                            {/* <textarea id={"spResponse_"+index} defaultValue={item.sp_response?decodeURI(item.sp_response).split(": ")[1]:''} />*/}
                                            </td>
                                            <td>{item.sp_response_status === "1"?"Accepted":(item.sp_response_status === "0" || item.sp_response_status === "3"?(item.response_status[1]=='0'?"Rejected":''):(item.sp_response_status === "4"?"Withdrawn":""))}</td>
                                            <td>
                                                <button id={"sp_reject_"+index} disabled={this.props.readOnly?this.props.readOnly:(item.type?(item.type=="reject"?true:false):(item.sp_response_status === '4' || item.sp_response_status === '1'?true:false))} onClick={this.do_keppel.bind(this,{params:'0',index:index,type:'reject'})}>Reject</button>
                                                <button id={"sp_accept_"+index} disabled={this.props.readOnly?this.props.readOnly:(item.type?(item.type=="accept"?true:false):(item.sp_response_status === '4' || item.sp_response_status === '1'?true:false))} onClick={this.do_keppel.bind(this,{params:'1',index:index,type:'accept'})}>Accept</button>
                                                <button id={"sp_history_"+index} onClick={this.showhistory.bind(this,item.id)}>History</button>
                                            </td>
                                        </tr>
                            })}
                    </tbody>
                </table>
                <div className="col-sm-12 col-md-8">
                    <div className="lm--formItem lm--formItem--inline string admin_invitation deviation u-mt2">
                        <label className="lm--formItem-left lm--formItem-label string required w_35">
                            {/* <abbr title="required">*</abbr>*/}
                            Upload Appendix of Agreed Deviations :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0 w_35">
                            {this.addinputfile("attachment_deviation", "required")}
                        </div>
                    </div>
                </div>
                <div className="workflow_btn u-mt2">
                    <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Send_Response')}>Send Response</button>
                </div>
            </div>
            <Showhistory ref="history" name={this.props.role_name} status={this.state.status} textdisabled={this.state.textdisabled} type={this.state.detailType} title={this.state.title} detail={this.state.detail} detail_id={this.state.detail_id} editDetail={this.editDetail.bind(this)} />
            <Modal text={this.state.text} acceptFunction={this.state.buttonType === "Send_Response" ? this.send_response.bind(this) : this.do_remove.bind(this)} ref="Modal" />
            </div>
        )}
    }
