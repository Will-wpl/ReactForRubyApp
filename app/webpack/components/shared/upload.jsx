import React, { Component } from 'react';
import { removeFile, removeRetailerFile, removeBuyerFile, removeUserAttachFile } from '../../javascripts/componentService/admin/service';
export class UploadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            fileData: this.props.fileData,
            showList: this.props.showList, //1  attachement list show,// 2 attachment list hide
            showWay: this.props.showWay, //1 attachment list show all , 0 attachment show only first one other
            uploadUrl: this.props.uploadUrl,
            deleteType: this.props.deleteType
        }
    }
    componentDidMount() {
    }
    addinputfile(type, required) {

        let buttonWidth = 12 - parseInt(this.props.col_width);
        let fileHtml = '';
        fileHtml = <form id={type + "_form"} encType="multipart/form-data">
            {
                this.state.fileData.map((item, index) =>
                    <div className="col-sm-12 col-md-12 u-grid" key={index}>

                        <div className={`col-sm-12 col-md-${this.props.col_width ? this.props.col_width : "10"} u-cell`}>
                            <a className="upload_file_btn">
                                <dfn className="dfn">No file selected...</dfn>
                                {/* accept="application/pdf,application/msword" */}
                                {required === "required" ?
                                    <div>
                                        <input type="file" name="uploadField" required="required" ref={type + index} onChange={this.changefileval.bind(this, type + index)} id={type + index} name="file" disabled={this.props.propsdisabled ? true : (window.location.href.indexOf("past") > 0 ? true : this.state.disabled)} />
                                        <b>Browse</b>
                                        <div className="required_error">
                                            Please select file.
                                        </div>
                                    </div>
                                    : <div>
                                        <input type="file" ref={type + index} onChange={this.changefileval.bind(this, type + index)} id={type + index} name="file" disabled={this.props.propsdisabled ? true : (window.location.href.indexOf("past") > 0 ? true : this.state.disabled)} />
                                        <b>Browse</b>
                                    </div>}
                            </a>
                            <div className="progress">
                                <div className="progress-bar" style={{ width: "0%" }}>0%</div>
                            </div>
                            <div className="progress_files">
                                {/* <div id="showMessage" className={this.props.validate ? 'isPassValidate' : 'errormessage'}>This field is required!</div> */}
                                {this.state.showList == 1 ?
                                    <ul>
                                        {
                                            this.state.showWay == 1 ? (this.props.type == "COMMON" ? "" : item.files.map((it, i) => {
                                                return <li key={i}><a target="_blank" id="uploadAttachment2" download={it.file_name} href={it.file_path}>{it.file_name}</a>{this.props.propsdisabled ? '' : (this.state.disabled ? '' : (window.location.href.indexOf("past") > 0 ? '' : <span className="remove_file" onClick={this.remove_file.bind(this, type, index, i, it.id)}></span>))}</li>
                                            }))
                                                : item.files.map((it, i) => {
                                                    let length;
                                                    if (this.state.showWay == 0) {
                                                        length = 0;
                                                    } else {
                                                        item.files.length - 1;
                                                    }
                                                    if (i == length) {
                                                        return <li key={i}><a target="_blank" id="uploadAttachment1" download={it.file_name} href={it.file_path}>{it.file_name}</a></li>
                                                    }
                                                })
                                        }
                                    </ul> :
                                    <div></div>
                                }
                            </div>
                        </div>
                        <div className={`col-sm-12 col-md-${buttonWidth} u-cell`}>
                            {
                                this.props.propsdisabled ?
                                    <button className={this.props.propsdisabled ? "lm--button lm--button--primary buttonDisabled" : "lm--button lm--button--primary"} disabled>Upload</button>
                                    : (this.state.disabled ? <button className="lm--button lm--button--primary" disabled>Upload</button>
                                        : (window.location.href.indexOf("past") > 0 ? <button className="lm--button lm--button--primary" disabled>Upload</button> : <a className="lm--button lm--button--primary" onClick={this.upload.bind(this, type, index)}>Upload</a>))
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
    changefileval(id) {
        const fileObj = $("#" + id);
        fileObj.parent().prev("dfn").text(fileObj.val());
    }
    remove_file(filetype, typeindex, fileindex, fileid) {
        let fileObj;
        if (this.props.deleteType === "buyer") {
            removeBuyerFile(fileid).then(res => {
                fileObj = this.state.fileData;
                fileObj[typeindex].files.splice(fileindex, 1);
                this.setState({
                    fileData: fileObj
                })
            }, error => {

            })
        }
        else if (this.props.deleteType === "retailer") {
            removeRetailerFile(fileid).then(res => {
                fileObj = this.state.fileData;
                fileObj[typeindex].files.splice(fileindex, 1);
                this.setState({
                    fileData: fileObj
                })
            }, error => {

            })

        }
        else if (this.props.deleteType === "userAttach") {
            if (this.props.loading) {
                // $("#bg").show();
                // $("#show").show();
                // $("#isLoading").removeClass("idHide").addClass("isDisplay");
                removeUserAttachFile(fileid).then(res => {
                    fileObj = this.state.fileData;
                    fileObj[typeindex].files.splice(fileindex, 1);
                    this.setState({
                        fileData: fileObj
                    })
                    // $("#bg").hide();
                    // $("#show").hide();
                    // $("#isLoading").removeClass("isDisplay").addClass("idHide");
                }, error => {

                })
            }
            else {
                removeUserAttachFile(fileid).then(res => {
                    fileObj = this.state.fileData;
                    fileObj[typeindex].files.splice(fileindex, 1);
                    this.setState({
                        fileData: fileObj
                    })
                }, error => {

                })
            }
        }
        else if (this.props.deleteType === "consumption") {
            removeBuyerFile(fileid).then(res => {
                fileObj = this.state.fileData;
                fileObj[typeindex].files.splice(fileindex, 1);
                this.setState({
                    fileData: fileObj
                })
            }, error => {

            })
        }
        else {

            removeFile(fileid).then(res => {
                fileObj = this.state.fileData;
                fileObj[typeindex].files.splice(fileindex, 1);
                this.setState({
                    fileData: fileObj
                })

            }, error => {

            })
        }

    }
    upload(type, index) {

        let time = null;
        if ($("#" + type + index).val() === "") {
            $("#" + type + index).next().next().fadeIn(300);
            clearTimeout(time);
            time = setTimeout(() => {
                $("#" + type + index).next().next().hide();
            }, 2000)
            return;
        }
        const barObj = $('#' + type + index).parents("a").next();
        $.ajax({
            url: this.state.uploadUrl + type,
            type: 'POST',
            cache: false,
            data: new FormData($('#' + type + "_form")[0]),
            processData: false,
            contentType: false,
            xhr: () => {
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
                        if (percentComplete == 100) {
                            barObj.find(".progress-bar").text('Processing..');
                        }
                    }
                }, false);
                return xhr;
            },
            success: (res) => {
                let fileObj;
                barObj.find(".progress-bar").text('Upload Successful!');
                $("#showMessage").removeClass("errormessage").addClass("isPassValidate");
                setTimeout(() => {
                    barObj.fadeOut(500);
                    $('.dfn').html('Please select file.');
                    this.setState({
                        disabled: false
                    })
                }, 2000);

                fileObj = this.state.fileData;
                fileObj.map((item, index) => {
                    item.files.push({
                        id: res.id,
                        file_name: res.file_name,
                        file_path: res.file_path
                    })
                })
                this.setState({
                    fileData: fileObj
                })
                if (this.props.calbackFn) {
                    this.props.calbackFn(this.state.fileData);
                }
                $("#" + type + index).val('');
            }, error: () => {
                barObj.find(".progress-bar").text('upload failed!');
                barObj.find(".progress-bar").css('background', 'red');
                this.setState({
                    disabled: false
                })
            }
        })
    }
    render() {
        return (
            <div className={this.props.col_main ? `col-sm-12 col-md-${this.props.col_main}` : `col-sm-12 col-md-10`}>
                <div className="file_box">
                    {this.addinputfile(this.props.type, this.props.required)}
                </div>
            </div>
        )
    }
}