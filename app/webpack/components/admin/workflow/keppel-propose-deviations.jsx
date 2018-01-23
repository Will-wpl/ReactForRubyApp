import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {adminSendResponse,getAdminDeviations} from '../../../javascripts/componentService/admin/service';
export class Keppelproposedeviations extends Component {
    constructor(props, context){
        super(props);
        this.state={
            deviations_list:[],
            buttonType:''
        }
    }
    componentDidMount(){
        getAdminDeviations(this.props.current.current.arrangement_id).then(res=>{
            console.log(res);
            if(res.chats.length > 0){
                console.log(res.chats);
                this.setState({deviations_list:res.chats});
            }else{
                this.setState({
                    deviations_list:[
                        {id:0,item:1,clause:'',propose_deviation:'',retailer_response:'',sp_response:''},
                    ]
                })
            }
        })
    }
    editData(){
        let deviationslist = [];
        this.state.deviations_list.map((item, index) => {
            deviationslist += '{"id":"'+item.id+'","sp_response":"'+$("#sp_response_"+(index)).val()+'","sp_response_status":"'+item.sp_response_status+'"},';
        })
        deviationslist = deviationslist.substr(0, deviationslist.length-1);
        deviationslist = '['+deviationslist+']';
        //console.log(deviationslist);
        return deviationslist;
    }
    showConfirm(type,obj){
        this.setState({buttonType:type});
        if(type == "Send_Response"){
            let send = this.state.deviations_list.find(item=>{
                return item.sp_response_status ==='2'||item.sp_response_status ==='3'||item.sp_response_status ==='4'
            })
            if(send){
                this.refs.Modal.showModal();
                this.setState({
                    text:"Please accept or reject the deviation!"
                });
                return;
            }
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to send response?"
            });
        }else if(type == "reject"){
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure want to reject this submission?"
            });
        }else{
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure want to accept this submission?"
            });
        }
    }
    send_response(){
        adminSendResponse(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"You have sent the response."
            });
            setTimeout(()=>{
                window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
            },3000)
            
            //this.props.page(this.props.current.current.arrangement_id);
        })
    }
    do_reject(obj){
        let deviationslist = this.state.deviations_list;
        deviationslist[obj.index].sp_response_status = obj.params;
        this.setState({deviations_list:deviationslist});
    }
    do_accept(obj){
        let deviationslist = this.state.deviations_list;
        deviationslist[obj.index].sp_response_status = obj.params;
        this.setState({deviations_list:deviationslist});
    }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt3 u-mb3">{this.props.title}</h2>
                <div className="col-sm-12 col-md-12 propose_deviations">
                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Clause</th>
                            <th>Proposs Deviation</th>
                            <th>Retailer Response</th>
                            <th>SP Response</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.deviations_list.map((item,index)=>{
                                return <tr key={index}>
                                            <td>{item.item}</td>
                                            <td >{item.clause}</td>
                                            <td >{item.propose_deviation}</td>
                                            <td >{item.retailer_response}</td>
                                            <td ><input type="text" id={"sp_response_"+index} defaultValue={item.sp_response} /></td>
                                            <td>
                                                <button id={"sp_reject_"+index} disabled={item.sp_response_status === '4' ? true:(item.sp_response_status === '0'?true:false)} onClick={this.showConfirm.bind(this,'reject',{params:'0',index:index})}>Reject</button>
                                                <button id={"sp_accept_"+index} disabled={item.sp_response_status === '4' ? true:(item.sp_response_status === '1'?true:false)} onClick={this.showConfirm.bind(this,'accept',{params:'1',index:index})}>Accept</button>
                                                <button id={"sp_history_"+index}>History</button>
                                            </td>
                                        </tr>
                            })}
                        </tbody>
                </table>
                <div className="workflow_btn u-mt3">    
                    <button className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Send_Response')}>Send Response</button>
                </div>
            </div>
            <Modal text={this.state.text} acceptFunction={this.state.buttonType === "Send_Response" ? this.send_response.bind(this) : (this.state.buttonType === "reject" ? this.do_reject.bind(this) : this.do_accept.bind(this))} ref="Modal" />
            </div>
        )}
    }
