import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {Showhistory} from '../../shared/show-history';
import {adminSendResponse,getAdminDeviations} from '../../../javascripts/componentService/admin/service';
import {getTenderhistory} from '../../../javascripts/componentService/common/service';
export class Keppelproposedeviations extends Component {
    constructor(props, context){
        super(props);
        this.state={
            deviations_list:[],
            buttonType:'',detailType:'',
            title:'',detail:'',detail_id:'',textdisabled:false,
            status:null
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
        $(".createRaMain a").attr("href",window.location.href);
    }
    editData(){
        let deviationslist = [];
        this.state.deviations_list.map((item, index) => {
            deviationslist += '{"id":"'+item.id+'","sp_response":"'+item.sp_response+'","sp_response_status":"'+item.sp_response_status+'"},';
        })
        deviationslist = deviationslist.substr(0, deviationslist.length-1);
        deviationslist = '['+deviationslist+']';
        console.log(deviationslist);
        return deviationslist;
    }
    showConfirm(type,obj){
        this.setState({buttonType:type});
        if(type == "Send_Response"){
            let send = this.state.deviations_list.find(item=>{
                return item.sp_response_status ==='2'||item.sp_response_status ==='3'
            })
            if(send){
                this.refs.Modal.showModal();
                this.setState({
                    text:"Please accept or reject the deviation."
                });
                return;
            }
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to send response?"
            });
        }else if(type == "reject"){
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure you want to reject this submission?"
            });
        }else{
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure you want to accept this submission?"
            });
        }
    }
    showhistory(id){
        this.setState({detailType:"history"})
        getTenderhistory('admin',id).then(res=>{
            console.log(res);
            this.refs.history.showModal(res);
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
    editDetail(detail){
        console.log(this.state.detail_id);
        if(this.state.detail_id != ''){
            let list = this.state.deviations_list,id=this.state.detail_id;
            list[id.split("_")[1]].sp_response = detail;
            this.setState({deviations_list:list});
        }   
    }
    send_response(){
        adminSendResponse(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Response successfully sent."
            });
            setTimeout(()=>{
                window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
            },3000)
            
        })
    }
    do_keppel(obj){
        let deviationslist = this.state.deviations_list;
        deviationslist[obj.index].sp_response_status = obj.params;
        deviationslist[obj.index].type = obj.type;
        this.setState({deviations_list:deviationslist});
        //console.log(this.state.deviations_list);
    }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt3 u-mb3">{this.props.current.name} Propose Deviations</h2>
                <div className="col-sm-12 col-md-12 propose_deviations">
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
                            {this.state.deviations_list.map((item,index)=>{
                                if(!item.type){
                                    if(item.sp_response_status === '4' || item.sp_response_status === '1'){
                                        return <tr key={index}>
                                                <td>{item.item}</td>
                                                <td >{item.clause}</td>
                                                <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,"Retailer Response",item.retailer_response,'',true,false)} >Details</button></td>
                                                <td><button onClick={this.showpropose.bind(this,"SP Response",item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                <td>
                                                    <button id={"sp_reject_"+index} disabled>Reject</button>
                                                    <button id={"sp_accept_"+index} disabled>Accept</button>
                                                    <button id={"sp_history_"+index} onClick={this.showhistory.bind(this,item.id)}>History</button>
                                                </td>
                                            </tr>
                                    }
                                }
                                return <tr key={index}>
                                            <td>{item.item}</td>
                                            <td >{item.clause}</td>
                                            <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button></td>
                                            <td><button onClick={this.showpropose.bind(this,"Retailer Response",item.retailer_response,'',true,false)} >Details</button></td>
                                            <td>
                                            <button id={"spResponse_"+index} onClick={this.showpropose.bind(this,"SP Response",item.sp_response?item.sp_response:'',"spResponse_"+index,this.props.readOnly,item.response_status)} >Details</button>
                                            {/* <textarea id={"spResponse_"+index} defaultValue={item.sp_response?decodeURI(item.sp_response).split(": ")[1]:''} />*/}
                                            </td>
                                            <td>
                                                <button id={"sp_reject_"+index} disabled={this.props.readOnly?this.props.readOnly:(item.type?(item.type=="reject"?true:false):(item.sp_response_status === '4' || item.sp_response_status === '1'?true:false))} onClick={this.do_keppel.bind(this,{params:'0',index:index,type:'reject'})}>Reject</button>
                                                <button id={"sp_accept_"+index} disabled={this.props.readOnly?this.props.readOnly:(item.type?(item.type=="accept"?true:false):(item.sp_response_status === '4' || item.sp_response_status === '1'?true:false))} onClick={this.do_keppel.bind(this,{params:'1',index:index,type:'accept'})}>Accept</button>
                                                <button id={"sp_history_"+index} onClick={this.showhistory.bind(this,item.id)}>History</button>
                                            </td>
                                        </tr>
                            })}
                    </tbody>
                </table>
                <div className="workflow_btn u-mt3">    
                    <button className="lm--button lm--button--primary" disabled={this.props.readOnly} onClick={this.showConfirm.bind(this,'Send_Response')}>Send Response</button>
                </div>
            </div>
            <Showhistory ref="history" status={this.state.status} textdisabled={this.state.textdisabled} type={this.state.detailType} title={this.state.title} detail={this.state.detail} detail_id={this.state.detail_id} editDetail={this.editDetail.bind(this)} />
            <Modal text={this.state.text} acceptFunction={this.state.buttonType === "Send_Response" ? this.send_response.bind(this) : (this.state.buttonType === "reject" ? this.do_keppel.bind(this) : this.do_keppel.bind(this))} ref="Modal" />
            </div>
        )}
    }
