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

    //这块是回显上传的文件需要做的，到时候问马克要接口
    // getFileList(sessionStorage.auction_id).then(res=>{
    //     let fileObj;
    //     fileObj = this.state.fileData;
    //     res.map((item,index)=>{
    //         fileObj[item.file_type][0].files.push({
    //             id:item.id,
    //             file_name:item.file_name,
    //             file_path:item.file_path
    //         })
    //     })
    //     this.setState({
    //         fileData:fileObj
    //     })
    // },error=>{
    //
    // })

}

show_history(type){
      //拿到类别传给后台，后台返回对应res列表数据后，塞进listdetail中

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