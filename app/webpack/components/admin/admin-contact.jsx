import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {UploadFile} from '../shared/upload';
import {Modal} from '../shared/show-modal';
import {getContractAttachmentsByType , deleteContractAttachmentById}  from '../../javascripts/componentService/admin/service';
export default class AdminContact extends Component {
  constructor(props){
    super(props);
    this.state={
        listdetail:[],
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
            }
    }
 }

 componentDidMount() {

 }

show_history(type){
    let attachements=[];
    getContractAttachmentsByType(type).then( res => {
        res.map((item,index)=>{
            attachements.push(
                {
                file_name:item.file_name,
                file_path:item.file_path,
                file_id:item.id,
                file_time:item.created_at
                }
            )
        })
        this.setState({listdetail:attachements});
        this.refs.Modal.showModal();

    },error=>{
    })
}

remove_file(filetype,fileindex,fileid) {
    let fileObj;
    removeFile(fileid).then(res => {
        fileObj = this.state.fileData;
        fileObj[filetype][0].files.splice(fileindex, 1);
        this.setState({
            fileData: fileObj
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
                        Admin Contract:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Seller - Buyer T&C :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="SELLER_BUYER_TC" required="required" showlist={false} fileData={this.state.fileData.SELLER_BUYER_TC} propsdisabled={false} />
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'SELLER_BUYER_TC')} >History</button>
                        </div>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Seller - Revv T&C :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="SELLER_REVV_TC" required="required" showlist={false} fileData={this.state.fileData.SELLER_REVV_TC} propsdisabled={false} />
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'SELLER_REVV_TC')} >History</button>
                        </div>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string">
                    <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Buyer - Revv T&C :
                    </label>
                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <UploadFile type="BUYER_REVV_TC" required="required" showlist={false} fileData={this.state.fileData.BUYER_REVV_TC} propsdisabled={false} />
                        <div className="col-sm-12 col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.show_history.bind(this,'BUYER_REVV_TC')} >History</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal listdetail={this.state.listdetail} listdetailtype="Link History" ref="Modal" />
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