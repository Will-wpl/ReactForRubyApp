import React, { Component } from 'react';
import {removeFile} from '../../javascripts/componentService/admin/service';
export class UploadFile extends React.Component{
    constructor(props){
        super(props);
        this.state={
            disabled:false,
            fileData:this.props.fileData,
            showList:this.props.showList,
        }
    }
    componentDidMount() {

    }
    addinputfile(type, required){
        let fileHtml = '';
        fileHtml = <form id={type+"_form"} encType="multipart/form-data">
                {this.state.fileData.map((item, index) =>
                    <div className="col-sm-12 col-md-12 u-grid" key={index}>
                        <div className="col-sm-12 col-md-10 u-cell">
                            <a className="upload_file_btn">
                                <dfn>No file selected...</dfn>
                                {/* accept="application/pdf,application/msword" */}
                                {required === "required" ?
                                    <div>
                                        <input type="file" required="required" ref={type+index}  onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.props.propsdisabled?true:(window.location.href.indexOf("past")>0?true:this.state.disabled)} />
                                        <b>Browse..</b>
                                        <div className="required_error">
                                            Please select file.
                                        </div>
                                    </div>
                                    :<div>
                                        <input type="file" ref={type+index} onChange={this.changefileval.bind(this, type+index)} id={type+index} name="file" disabled={this.props.propsdisabled?true:(window.location.href.indexOf("past")>0?true:this.state.disabled)} />
                                        <b>Browse..</b>
                                    </div>}
                            </a>
                            <div className="progress">
                                <div className="progress-bar" style={{width:"0%"}}>0%</div>
                            </div>
                            <div className="progress_files">
                                {this.state.showList===true ?
                                    <ul>
                                        {
                                            item.files.map((it,i)=>{
                                                return <li key={i}><a target="_blank" download={it.file_name} href={it.file_path}>{it.file_name}</a>{this.props.propsdisabled?'':(this.state.disabled?'':(window.location.href.indexOf("past")>0?'':<span className="remove_file" onClick={this.remove_file.bind(this,type,index,i,it.id)}></span>))}</li>
                                            })
                                        }
                                    </ul>:
                                    <div></div>
                                }

                            </div>
                        </div>
                        <div className="col-sm-12 col-md-2 u-cell">
                            {
                                this.props.propsdisabled?<button className="lm--button lm--button--primary" disabled>Upload</button>:(this.state.disabled?<button className="lm--button lm--button--primary" disabled>Upload</button>
                                    :(window.location.href.indexOf("past")>0?<button className="lm--button lm--button--primary" disabled>Upload</button>:<a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)}>Upload</a>))
                            }
                        </div>
                        {/* <div className="col-sm-12 col-md-2 u-cell">
                                        {item.buttonName === "none" ? "" : <a onClick={this.fileclick.bind(this, index, type, item.buttonName)} className={"lm--button lm--button--primary "+item.buttonName}>{item.buttonText}</a>}
                                    </div> */}
                    </div>
                )}
            </form>
        return fileHtml;
    }
    changefileval(id){
        const fileObj = $("#"+id);
        fileObj.parent().prev("dfn").text(fileObj.val());
    }
    remove_file(filetype,typeindex,fileindex,fileid) {
        let fileObj;
        removeFile(fileid).then(res => {
            fileObj = this.state.fileData;
            fileObj[filetype][typeindex].files.splice(fileindex, 1);
            this.setState({
                fileData: fileObj
            })
        }, error => {

        })
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
            url: '/api/admin/user_attachments?file_type='+type,
            type: 'POST',
            cache: false,
            data: new FormData($('#'+type+"_form")[0]),
            processData: false,
            contentType: false,
            xhr:() => {
                var xhr = new window.XMLHttpRequest();
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
                },2000);
                fileObj = this.state.fileData;
                fileObj.map((item,index)=>{
                    item.files.push({
                        id:res.id,
                        file_name:res.file_name,
                        file_path:res.file_path
                    })
                })
                this.setState({
                    fileData:fileObj
                })
                //console.log(res);
            },error:() => {
                barObj.find(".progress-bar").text('upload failed!');
                barObj.find(".progress-bar").css('background', 'red');
            }
        })
    }
    render(){
        return(
            <div className="col-sm-12 col-md-10">
                <div className="file_box">
                    {this.addinputfile(this.props.type, this.props.required)}
                </div>
            </div>
        )
    }
}