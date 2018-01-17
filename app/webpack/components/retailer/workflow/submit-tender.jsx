import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {retailerSubmit} from '../../../javascripts/componentService/retailer/service';
export class Submittender extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:'',
            fileData:{
                "upload_tender":[
                    {buttonName:"none",files:[]}
                ]
            }
        }
    }
    componentDidMount() {
        
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Submit"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to submit?"
            });
        }
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
    do_submit(){
        retailerSubmit(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
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
    changefileval(id){
        const fileObj = $("#"+id);
        fileObj.parent().prev("dfn").text(fileObj.val());
    }
    upload(type, index){
        if($("#"+type+index).val() === ""){
            $("#"+type+index).next().next().fadeIn(300);
            return;
        }
        return;
        const barObj = $('#'+type+index).parents("a").next();
        $.ajax({
            url: '/api/retailer/auction_attachments?auction_id='+sessionStorage.auction_id+'&file_type='+type,
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
                barObj.find(".progress-bar").text('upload successful!');
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
                        barObj.find(".progress-bar").text('upload failed!');
                        barObj.find(".progress-bar").css('background', 'red');
                    }
                })
            }
    render(){
        return(
            <div className="col-sm-12 admin_invitation">
                <h4 className="u-mt3 u-mb1">{this.props.submit ? <span className="green">Your submission has been approved by administrator.</span> 
                : <span className="red">Your submission has been rejected by administrator.</span>}</h4>
                <h4>Please upload the following documents for submission of tender:</h4>
                <div className="col-sm-12 col-md-8 push-md-2 u-mt3 u-mb3">
                    {this.addinputfile("upload_tender", "required")}
                    <div className="workflow_btn u-mt3">
                        <a className="lm--button lm--button--primary" disabled={!this.props.current.actions.node4_retailer_submit} onClick={this.showConfirm.bind(this,'Submit')}>Submit</a>
                    </div>
                </div>
                <Modal text={this.state.text} acceptFunction={this.do_submit.bind(this)} ref="Modal" />
            </div>
        )
    }
}
