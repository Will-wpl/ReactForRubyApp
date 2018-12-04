import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {Showhistory} from '../../shared/show-history';
import {arrangementDetail,adminReject,adminAccept,getAdminKeppelForm} from '../../../javascripts/componentService/admin/service';
import {getTenderhistory} from '../../../javascripts/componentService/common/service';

export class BuyerKeppelformtender extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:'',buttonType:'',linklist:[],chats:[],comments:"",
            detailType:'',title:'',detail:'',detail_id:'',textdisabled:false,prev_status:'',
            status:null
        }
    }
    componentDidMount() {
        getAdminKeppelForm(this.props.current.current.arrangement_id).then(res=>{
            //console.log(res);
            let attachments = res.attachments.filter((item)=>{
                return item.file_type === "upload_tender";
            })
            this.setState({
                linklist:attachments,
                chats:res.chats,
                comments:(res.comments?res.comments:""),
                prev_status:res.pre_state_machine!=null?res.pre_state_machine.current_status:''
            })
        })
        $(".createRaMain a").attr("href",window.location.href);
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if($("#adminComment").val().trim()==="" && type === "Reject"){
            this.refs.Modal.showModal();
            this.setState({
                text:"Please fill in your comments."
            });
            return;
        }
        if(type == "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to reject this submission?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to accept this submission?"
            });
        }
    }
    admin_reject(){
        adminReject(this.props.current.current.arrangement_id,encodeURI($("#adminComment").val())).then(res=>{
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    admin_accept(){
        adminAccept(this.props.current.current.arrangement_id,encodeURI($("#adminComment").val())).then(res=>{
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    showhistory(id){
        this.setState({detailType:"history"})
        getTenderhistory('admin',id).then(res=>{
            //console.log(res);
            this.refs.history.showModal(res);
        })
    }
    changeAdminComment(e){
        let val = encodeURI(e.target.value);
        this.setState({
            comments:val
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
        this.refs.history.showModal();
    }
    render(){
        return(
            <div className="col-sm-12 col-md-10 push-md-1 u-mt3 tender_documents">
                <h2 className="u-mt2 u-mb2">{this.props.current.name} - Form of {this.state.chats.length>0?'':'Base'} Tender</h2>
                <h3 className="u-mt1 u-mb1">Tender Submission Status : {this.state.prev_status === '3' ? <span className="green">Accepted</span>
                :(this.state.prev_status === '4'?<span className="red">Rejected</span>:"Pending") }</h3>
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Please see below for {this.state.chats.length>0?'':'base'} tender submission:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                        <ul className="tender_list">
                            {this.state.linklist.length > 0 ? this.state.linklist.map((item,index)=>{
                                    return <li key={index}>Item {index+1} : <a target="_blank" download={item.file_name} href={item.file_path}>{item.file_name}</a></li>
                            }) : ''}
                        </ul>
                    </div>
                </div>
                {this.state.chats.length>0?
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Deviation:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control propose_deviations">
                        <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Clause</th>
                                <th>Propose Deviation</th>
                                <th>Retailer Comments</th>
                                <th>SP Response</th>
                                <th>Deviation Status</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.chats.map((item,index)=>{
                                    return <tr key={index}>
                                                <td>{item.item}</td>
                                                <td >{item.clause}</td>
                                                <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'',true,false)} >Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,"SP Response",item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                <td>{item.sp_response_status === "1"?"Accepted":(item.sp_response_status === "0" || item.sp_response_status === "3"?(item.response_status[1]=='0'?"Rejected":''):(item.sp_response_status === "4"?"Withdrawn":""))}</td>
                                                <td><button onClick={this.showhistory.bind(this,item.id)}>History</button></td>
                                            </tr>
                                })}
                            </tbody>
                    </table>
                    </div>
                </div>:''}
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Comment:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                        <textarea id="adminComment" disabled={this.props.readOnly} onChange={this.changeAdminComment.bind(this)} value={decodeURI(this.state.comments)}></textarea>
                    </div>
                </div>
                <div className="workflow_btn u-mt3">
                        <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Reject')}>Reject</button>
                        <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Accept')}>Accept</button>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Reject'?this.admin_reject.bind(this):this.admin_accept.bind(this)} ref="Modal" />
                <Showhistory ref="history" status={this.state.status} textdisabled={this.state.textdisabled} type={this.state.detailType} title={this.state.title} detail={this.state.detail} detail_id={this.state.detail_id} />
            </div>
        )
    }
}
