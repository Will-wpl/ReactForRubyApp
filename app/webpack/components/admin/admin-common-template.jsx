import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { removeUserAttachFile } from '../../javascripts/componentService/admin/service';
import { Modal } from '../shared/show-modal';
import { getEmailFile } from '../../javascripts/componentService/admin/service';
import { UploadFile } from '../shared/upload';
import TemplatesList from './admin_shared/template-list';
import {CopyToClipboard} from 'react-copy-to-clipboard';
export default class CommonTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "", size: '',
            uploadUrl: '/api/admin/user_attachments?file_type=',
            fileData: {
                "COMMON": [
                    { buttonName: "none", files: [] }
                ]
            }
        }
    }
    componentDidMount() {
        getEmailFile('COMMON').then(res => {
            let file = this.state.fileData;
            file.COMMON[0].files = res;
            this.setState({
                fileData: file
            })
        })
    }
    remove_file(typeindex, fileindex, fileid) {
        let fileObj;
        removeUserAttachFile(fileid).then(res => {
            fileObj = this.state.fileData;
            fileObj['COMMON'][typeindex].files.splice(fileindex, 1);
            this.setState({
                fileData: fileObj
            })
        }, error => {

        })
    }
    refreshForm(obj) {
        let file = this.state.fileData;
        file["COMMON"][0].files = obj[0].files;
        this.setState({
            fileData: file
        })
    }
    copy(index){
        $("button.copy").text("Copy");
        $("button.copy").css("background","#00b0b2");
        $("#copy_"+index).text("Copied");
        $("#copy_"+index).css("background","red");
    }
    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="col-sm-12 buyer_list" id="template_registration">
                    <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                        <label className="lm--formItem-left lm--formItem-label string required" >
                            <abbr title="required">*</abbr> Common Files :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <UploadFile type="COMMON" required="required" deleteType="userAttach" showList="1" col_width="10" showWay="1" calbackFn={this.refreshForm.bind(this)} fileData={this.state.fileData.COMMON} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                        </div>
                    </div>
                    <table className={"retailer_fill common_template"}>

                        <thead>
                            <tr><th width={"80%"}>File Name</th>
                                {/*<th width={"55%"}>File Url</th>*/}
                                <th width={"20%"}>Operation</th></tr>
                        </thead>
                        <tbody>
                            {this.state.fileData.COMMON[0].files.map((item, index) => {
                                return <tr key={index}>
                                    <td width={"80%"}><a target="_blank" download={item.file_name} href={item.file_path}>{item.file_name}</a></td>
                                    {/*<td width={"55%"}>{item.file_path}</td>*/}
                                    <td width={"20%"} style={{ "textAlign": "center" }} >
                                        <CopyToClipboard text={item.file_path} onCopy={this.copy.bind(this,index)}>
                                            <button className="lm--button lm--button--primary copy" id={"copy_"+index}>Copy</button>
                                        </CopyToClipboard>
                                        <button className="lm--button lm--button--primary" onClick={this.remove_file.bind(this, 0, index, item.id)}>Delete</button>
                                    </td></tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        )
    }
}

function run() {
    const domNode = document.getElementById('admin_common_template');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(CommonTemplates),
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