import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {UploadFile} from '../shared/upload';
import {Modal} from '../shared/show-modal';
import moment from 'moment';
import {getContractAttachmentsByType , deleteContractAttachmentById}  from '../../javascripts/componentService/admin/service';
export default class AdminContact extends Component {
  constructor(props){
    super(props);
    this.state={
        listdetail:[],
        uploadUrl:'/api/admin/user_attachments?file_type=',
        validate:true,
        fileData:{
                "SELLER_BUYER_TC":[
                    {buttonName:"none",files:[]}
                ],
                "SELLER_REVV_TC":[
                    {buttonName:"none",files:[]}
                ],
                "BUYER_REVV_TC":[
                    {buttonName:"none",files:[]}
                ]
            },
    }
 }

 componentDidMount() {
     this.refresh();
 }
 refresh(){
        this.getFiles('SELLER_BUYER_TC',false);
        this.getFiles('SELLER_REVV_TC',false);
        this.getFiles('BUYER_REVV_TC',false);
 }
 getFiles(type,showModal){
     let attachements=[];

     getContractAttachmentsByType(type).then( res => {
         let fileObj;
         fileObj = this.state.fileData;
         fileObj[type][0].files=[];
         res.map((item,index)=>{
             let obj={
                 file_name:item.file_name,
                 file_path:item.file_path,
                 fileid:item.id,
                 file_time:moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
                 file_type:item.file_type
             }
             fileObj[item.file_type][0].files.push(obj);
             attachements.push(obj);
         });
         this.setState({
             fileData:fileObj,
             listdetail : attachements,

         })
         if(showModal) {
             this.refs.Modal.showModal('default', {}, type);
         }
     },error=>{
     })

 }
 show_history(type){
    this.getFiles(type,true);
 }

    removeFile(filetype,fileindex,fileid) {
        let fileObj;
        deleteContractAttachmentById(fileid).then(res => {
        fileObj = this.state.fileData;
        fileObj[filetype][0].files.splice(fileindex, 1);
        this.setState({
            listdetail: fileObj[filetype][0].files,
            fileData:fileObj
        })
    }, error => {

    })
}

render() {
    return (
        <div className="u-grid admin_invitation">
            <div className="col-sm-12 col-md-8 push-md-2">
                <div className="lm--formItem lm--formItem--inline string u-mt3">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        Manage Contract:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr>Electricity Procurement Agreement :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="SELLER_BUYER_TC" calbackFn={this.refresh.bind(this)} required="required" validate={this.state.validate} col_width="10" showList="1" showWay="0" fileData={this.state.fileData.SELLER_BUYER_TC} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'SELLER_BUYER_TC')} >History</button>
                        </div>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr>Seller Platform Terms of Use :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="SELLER_REVV_TC" calbackFn={this.refresh.bind(this)} required="required" validate={this.state.validate} showList="1" col_width="10"  showWay="0" fileData={this.state.fileData.SELLER_REVV_TC} propsdisabled={false}  uploadUrl={this.state.uploadUrl}/>
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'SELLER_REVV_TC')} >History</button>
                        </div>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr>Buyer Platform Terms of Use :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="BUYER_REVV_TC" calbackFn={this.refresh.bind(this)} required="required" validate={this.state.validate} showList="1" col_width="10"  showWay="0" fileData={this.state.fileData.BUYER_REVV_TC} propsdisabled={false}  uploadUrl={this.state.uploadUrl}/>
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'BUYER_REVV_TC')} >History</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal  otherFunction={this.removeFile.bind(this)} listdetail={this.state.listdetail} listdetailtype="Link History" ref="Modal" />
        </div>
    )
  }
}
AdminContact.propTypes = {onAddClick: () => {}};
function run() {
    const domNode = document.getElementById('admin_contact');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminContact),
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