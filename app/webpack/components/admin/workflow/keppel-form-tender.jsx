import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {Showhistory} from '../../shared/show-history';
import {arrangementDetail,adminReject,adminAccept,getAdminKeppelForm} from '../../../javascripts/componentService/admin/service';
import {getTenderhistory} from '../../../javascripts/componentService/common/service';

export class Keppelformtender extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:'',buttonType:'',linklist:[],chats:[]
        }
    }
    componentDidMount() {
        getAdminKeppelForm(this.props.current.current.arrangement_id).then(res=>{
            this.setState({
                linklist:res.attachments,
                chats:res.chats
            })
        })
        $(".createRaMain a").attr("href",window.location.href);
    }
    showConfirm(type){
        this.setState({buttonType:type});
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
        adminReject(this.props.current.current.arrangement_id,$("#adminComment").val()).then(res=>{
            //this.props.page(this.props.current.current.arrangement_id);
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    admin_accept(){
        adminAccept(this.props.current.current.arrangement_id,$("#adminComment").val()).then(res=>{
            //this.props.page(this.props.current.current.arrangement_id);
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    showhistory(id){
        getTenderhistory('admin',id).then(res=>{
            console.log(res);
            this.refs.history.showModal(res);
        })
    }
    render(){
        return(
            <div className="col-sm-12 col-md-10 push-md-1 u-mt3 tender_documents">
                <h2 className="u-mt3 u-mb3">{this.props.current.name} - Form of {this.state.chats.length>0?'':'Base'} Tender</h2>
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Please see below for {this.state.chats.length>0?'':'base'} tender submission:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                        <ul className="tender_list">
                            {this.state.linklist.length > 0 ? this.state.linklist.map((item,index)=>{
                                return <li key={index}>Item {index+1} : <a download={item.file_name} href={"/"+item.file_path}>{item.file_name}</a></li>
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
                                <th>Retailer Response</th>
                                <th>SP Response</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.chats.map((item,index)=>{
                                    return <tr key={index}>
                                                <td>{item.item}</td>
                                                <td >{item.clause}</td>
                                                <td >{item.propose_deviation}</td>
                                                <td >{item.retailer_response}</td>
                                                <td >{item.sp_response}</td>
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
                        <textarea id="adminComment" disabled={this.props.readOnly}></textarea>
                    </div>
                </div>
                <div className="workflow_btn u-mt3">
                        <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Reject')}>Reject</button>
                        <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Accept')}>Accept</button>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Reject'?this.admin_reject.bind(this):this.admin_accept.bind(this)} ref="Modal" />
                <Showhistory ref="history" />
            </div>
        )
    }
}
