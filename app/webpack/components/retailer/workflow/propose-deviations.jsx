import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {Showhistory} from '../../shared/show-history';
import {retailerWithdrawAllDeviations,retailerSubmitDeviations,retailerNext,getRetailerDeviationsList,retailerDeviationsSave,retailerWithdraw} from '../../../javascripts/componentService/retailer/service';
import {getTenderhistory} from '../../../javascripts/componentService/common/service';
export class Proposedeviations extends React.Component{
    constructor(props){
        super(props);
        this.state={
            peak_lt:0,peak_hts:0,
            peak_htl:0,peak_eht:0,off_peak_lt:0,off_peak_hts:0,
            off_peak_htl:0,off_peak_eht:0,buttonType:'',
            select_list:[],alldisabled:false,
            deviations_list:[],detailType:'',
            title:'',detail:'',detail_id:'',textdisabled:false,
            status:null,attachments:[]
        }
    }
    componentDidMount() {
        this.changeNext()
        this.refresh();
    }
    refresh(){
        getRetailerDeviationsList(sessionStorage.arrangement_id).then(res=>{
            if(this.props.current.current.turn_to_role === 1){
                this.setState({alldisabled:true});
            }
            let select_list = [""];
            for(let i = 0; i<res.attachments_count; i++)
            {
                select_list.push(i+1);
            }
            this.setState({select_list:select_list})
            if(res.chats.length > 0){
                console.log(res);
                this.setState({deviations_list:res.chats,attachments:res.attachments});
            }else{
                this.setState({
                    deviations_list:[
                        {id:0,item:'',clause:'',propose_deviation:'',retailer_response:'',sp_response:'',sp_response_status:'',key:1},
                    ]
                })
            }
        })
    }
    showConfirm(type,obj){
        this.setState({buttonType:type});
        if(type == "Withdraw_Deviations"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to withdraw all deviations and proceed with base tender submission?"
            });
        }else if(type == "Withdraw"){
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure you want to withdraw deviation?"
            });
        }else{
            if(this.state.deviations_list.length <= 0){
                this.refs.Modal.showModal();
                this.setState({
                    text:"No Deviations,please add a new deviation!",
                });
                return;
            }
            let check = this.state.deviations_list.find((item,index)=>{
                return $("#item_"+(index)).val() === "" || $("#clause_"+(index)).val() === "" || this.state.deviations_list[index].propose_deviation === "";
            })
            if(check){
                this.refs.Modal.showModal();
                this.setState({
                    text:"Please fill out all the fields",
                });
                return;
            }
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to submit deviations?"
            });
        }
    }
    withdrawAllDeviations(){
        retailerWithdrawAllDeviations(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.props.page();
        })
    }
    Withdraw(obj){
        let withdraw = this.state.deviations_list;
        withdraw[obj.index].sp_response_status = '4';
        this.setState({deviations_list:withdraw});
        retailerWithdraw(this.props.current.current.arrangement_id,{id:obj.id,propose_deviation:this.state.deviations_list[obj.index].propose_deviation}).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"You have successfully updated"
            });
            this.props.page();
            // setTimeout(()=>{
            //     this.changeNext();
            // },500)
        })
    }
    componentWillReceiveProps(next) {
        if(next.current.actions){
            if(next.current.actions.node3_retailer_next || next.current.current.current_node>3){
                if(next.tenderFn){
                    if(!next.tender){
                        if(next.update){
                            next.tenderFn();
                        }
                    }                    
                }
            }
        }
    }
    changeNext(){
        if(this.props.current.actions){
            if(this.props.current.actions.node3_retailer_next || this.props.current.current.current_node>3){
                if(this.props.tenderFn){
                  this.props.tenderFn();
                }
            }
        }
    }
    submitDeviations(){
        console.log(this.editData(3));
        retailerDeviationsSave(this.props.current.current.arrangement_id,this.editData('2')).then(a=>{
            getRetailerDeviationsList(sessionStorage.arrangement_id).then(b=>{
                this.setState({deviations_list:b.chats});
                retailerSubmitDeviations(this.props.current.current.arrangement_id,this.editData('3')).then(c=>{
                    this.refs.Modal.showModal();
                    this.setState({
                        text:"Deviations pending administrator's review.",
                        alldisabled:true
                    });
                    this.refresh();
                    this.props.page();
                })
            })
        })
    }
    save(){
        if(this.state.deviations_list.length <= 0){
            this.refs.Modal.showModal();
            this.setState({
                text:"No Deviations,please add a new deviation.",
            });
            return;
        }
        let check = this.state.deviations_list.find((item,index)=>{
            return $("#item_"+(index)).val() === "" || $("#clause_"+(index)).val() === "" || this.state.deviations_list[index].propose_deviation === "";
        })
        if(check){
            this.refs.Modal.showModal();
            this.setState({
                text:"Please fill out all the fields",
            });
            return;
        }
        console.log(this.editData(2));
        retailerDeviationsSave(this.props.current.current.arrangement_id,this.editData('2')).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Deviations successfully saved."
            });
            this.refresh();
        })
    }
    next(){
        retailerNext(this.props.current.current.arrangement_id,3).then(res=>{
            this.props.page('false');
        })
    }
    editData(sum){
        let deviationslist = [];
        this.state.deviations_list.map((item, index) => {
            let deviation = item.propose_deviation,response = item.retailer_response;
            if(item.sp_response_status != sum){
                if(item.sp_response_status == ""){
                    deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+deviation+'","retailer_response":"'+response+'","sp_response_status":"'+sum+'"},';
                }else{
                    if(item.sp_response_status == "0"){
                        deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+deviation+'","retailer_response":"'+response+'","sp_response_status":"3"},';
                    }else if(item.sp_response_status == "2"){
                        if(sum == "3"){
                            deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+deviation+'","retailer_response":"'+response+'","sp_response_status":"3"},';
                        }
                    }else{
                        deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+deviation+'","retailer_response":"'+response+'","sp_response_status":"'+item.sp_response_status+'"},';
                    } 
                }
            }else{
                deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+deviation+'","retailer_response":"'+response+'","sp_response_status":"'+sum+'"},';
            }       
        })
        deviationslist = deviationslist.substr(0, deviationslist.length-1);
        deviationslist = '['+deviationslist+']';
        return deviationslist;
    }

    addDeviations(){
        let add_new = {id:0,item:'',clause:'',
                        propose_deviation:'',
                        retailer_response:'',
                        sp_response_status:'',key:Math.floor((Math.random()*10000)+1)},list = this.state.deviations_list;
                        list.push(add_new);
        this.setState({deviations_list:list});
    }
    removeDeviations(index){
        if(this.state.deviations_list.length <= 1){
            this.refs.Modal.showModal();
            this.setState({
                text:"Please submit at least one deviation."
            });
            return;
        }
        let list  =  this.state.deviations_list;
        list.splice(index,1);
        this.setState({deviations_list:list});
        this.refs.Modal.showModal();
        this.setState({text:"Please click 'Save' button to effect the change."});
    }
    showhistory(id){
        this.setState({detailType:"history"})
        getTenderhistory('retailer',id).then(res=>{
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
        console.log(detail);
        if(this.state.detail_id != ''){
            let list = this.state.deviations_list,id=this.state.detail_id;
            //$("#"+this.state.detail_id).val(detail);
            if(id.split("_")[0] == "deviation"){
                list[id.split("_")[1]].propose_deviation = detail;
            }else{
                list[id.split("_")[1]].retailer_response = detail;
            }
            this.setState({deviations_list:list});
        }   
    }
    render(){
        return(
            <div className="propose_deviations u-mt3">
                <h2 className="u-mt3 u-mb2">Propose Deviations</h2>
                <h4 className="u-mb2">Submit only deviations for Conditions of Contract. Deviations for other items will not be accepted.</h4>
                {!this.props.tender ? (this.props.current.current.turn_to_role === 1?<h4 className="u-mb3 pending_review">Status : Deviations pending administrator's review</h4>:''):''}
                <div className="col-sm-12 col-md-10 push-md-1">
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
                                {!this.props.tender ? 
                                    this.state.deviations_list.map((item,index)=>{
                                        if(item.sp_response_status === "1" || item.sp_response_status === "4"){
                                            return (<tr key={item.id}>
                                                    <td>{item.item}<input id={"item_"+(index)} type="hidden" defaultValue={item.item}/></td>
                                                    <td >{item.clause}<input type="hidden" id={"clause_"+(index)} defaultValue={item.clause}/></td>
                                                    <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button><input type="hidden" id={"deviation_"+(index)} defaultValue={item.propose_deviation}/></td>
                                                    <td><button onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'',true,false)} >Details</button><input disabled type="hidden" id={"response_"+(index)} defaultValue={item.retailer_response}/></td>
                                                    <td><button onClick={this.showpropose.bind(this,"SP Response",item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                    <td>{item.sp_response_status === "1"?"Accepted":"Withdrawn"}</td>
                                                    <td>
                                                        <button id={"history_"+index} onClick={this.showhistory.bind(this,item.id)} >History</button>
                                                        <button disabled={this.props.propsdisabled?true:(this.state.alldisabled?true:(item.sp_response_status === "4" ? true : false))} id={"withdraw_"+index} onClick={this.showConfirm.bind(this,'Withdraw',{id:item.id,index:index})}>Withdraw</button>
                                                    </td>
                                                    </tr>)
                                        }else{
                                            return (<tr key={item.id===0?item.key:item.id}>
                                                        <td>
                                                            {this.props.propsdisabled?<div>{item.item}<input id={"item_"+(index)} type="hidden" defaultValue={item.item}/></div>
                                                            :(this.state.alldisabled?<div>{item.item}<input id={"item_"+(index)} type="hidden" defaultValue={item.item}/></div>:(item.sp_response_status !='2'?(item.sp_response_status ==''?<select id={"item_"+(index)} defaultValue={item.item} >
                                                                {this.state.select_list.map((it,i)=>{
                                                                    return <option key={i} value={it}>{it}</option>
                                                                })}
                                                            </select>:<div>{item.item}<input id={"item_"+(index)} type="hidden" defaultValue={item.item}/></div>):<select id={"item_"+(index)} defaultValue={item.item}>
                                                                {this.state.select_list.map((it,i)=>{
                                                                    return <option key={i} value={it}>{it}</option>
                                                                })}
                                                            </select>))}
                                                        </td>
                                                        <td >{this.props.propsdisabled?
                                                            <div>{item.clause}<input type="hidden" id={"clause_"+(index)} defaultValue={item.clause}/></div>:
                                                            (this.state.alldisabled?<div>{item.clause}<input type="hidden" id={"clause_"+(index)} defaultValue={item.clause}/></div>:
                                                            (item.sp_response_status !='2'?(item.sp_response_status ==''?
                                                            <input type="text" id={"clause_"+(index)} defaultValue={item.clause}/>:<div>{item.clause}<input type="hidden" id={"clause_"+(index)} defaultValue={item.clause}/></div>)
                                                            :<input type="text" id={"clause_"+(index)} defaultValue={item.clause}/>))}
                                                        </td>
                                                        <td><button id={"deviation_"+(index)} onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'deviation_'+index,this.props.propsdisabled?true:(this.state.alldisabled),false)}>Details</button></td>
                                                        <td><button id={"response_"+(index)} onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'response_'+index,this.props.propsdisabled?true:(this.state.alldisabled),false)} >Details</button></td>
                                                        <td><button onClick={this.showpropose.bind(this,"SP Response",item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                        <td>{item.sp_response_status === "0"?"Rejected":""}</td>
                                                        <td>{item.item === ""?<button id={"remove_"+index} onClick={this.removeDeviations.bind(this,index)} disabled={this.props.propsdisabled?true:(this.state.alldisabled)}>Remove</button>:
                                                        (item.sp_response_status==='2'?<button id={"remove_"+index} onClick={this.removeDeviations.bind(this,index)} disabled={this.props.propsdisabled?true:(this.state.alldisabled)}>Remove</button>
                                                        :<div>
                                                            <button onClick={this.showhistory.bind(this,item.id) } id={"history_"+index}>History</button>
                                                            <button disabled={this.props.propsdisabled?true:(this.state.alldisabled?true:(item.sp_response_status === "4" ? true : false))} id={"withdraw_"+index} onClick={this.showConfirm.bind(this,'Withdraw',{id:item.id,index:index})}>Withdraw</button>
                                                        </div>
                                                        )}</td>
                                                </tr>)
                                            }                                   
                                        })
                                :this.state.deviations_list.map((item,index)=>{
                                    return <tr key={item.id}>
                                                <td>{item.item}</td>
                                                <td>{item.clause}</td>
                                                <td><button onClick={this.showpropose.bind(this,"Propose Deviation",item.propose_deviation,'',true,false)}>Details</button><input type="hidden" id={"deviation_"+(index)} defaultValue={item.propose_deviation}/></td>
                                                <td><button onClick={this.showpropose.bind(this,"Retailer Comments",item.retailer_response,'',true,false)} >Details</button><input disabled type="hidden" id={"response_"+(index)} defaultValue={item.retailer_response}/></td>
                                                <td><button onClick={this.showpropose.bind(this,"SP Response",item.sp_response,'',true,item.response_status)} >Details</button></td>
                                                <td>{item.sp_response_status === "1"?"Accepted":(item.sp_response_status === "0"?"Rejected":(item.sp_response_status === "4"?"Withdraw":""))}</td>
                                                <td><button onClick={this.showhistory.bind(this,item.id)}>History</button></td>
                                            </tr>
                                        })
                                }
                        </tbody>
                    </table>
                    {this.state.attachments.length>0?
                    <div className="col-sm-12 col-md-12">
                        <div className="lm--formItem lm--formItem--inline string u-mt2 deviation">
                            <label className="lm--formItem-left lm--formItem-label string required">
                                Download Appendix of Agreed Deviations :
                            </label>
                            <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                <ul className="brif_list">
                                    {this.state.attachments ? this.state.attachments.map((item,index)=>{
                                        return <li key={index}><a disabled={this.props.propsdisabled} download={item.file_name} href={"/"+item.file_path}>{item.file_name}</a></li>
                                    }) : ''}
                                </ul>
                            </div>
                        </div>
                    </div>:''}
                    {!this.props.tender ? <div className="workflow_btn u-mt3 u-mb3"><button className="add_deviation" disabled={this.props.propsdisabled?true:(this.state.alldisabled)} onClick={this.addDeviations.bind(this)}>Add</button></div> :''}
                    <div className="workflow_btn u-mt3">
                        {!this.props.tender ?
                        <div><button className="lm--button lm--button--primary" disabled={this.props.propsdisabled?true:(this.state.alldisabled?true:(!this.props.current.actions.node3_retailer_withdraw_all_deviations))} onClick={this.showConfirm.bind(this,'Withdraw_Deviations')}>Withdraw All Deviations</button>
                        <button className="lm--button lm--button--primary" onClick={this.save.bind(this)} disabled={this.props.propsdisabled?true:(this.state.alldisabled)}>Save</button>
                        <button className="lm--button lm--button--primary" disabled={this.props.propsdisabled?true:(this.state.alldisabled?true:(!this.props.current.actions.node3_retailer_submit_deviations))} onClick={this.showConfirm.bind(this,'Submit_Deviations')}>Submit Deviations</button></div> :
                        <button className="lm--button lm--button--primary" disabled={this.props.propsdisabled} onClick={this.next.bind(this)}>Next</button>
                        }
                    </div>
                </div>
                <Showhistory ref="history" status={this.state.status} textdisabled={this.state.textdisabled} type={this.state.detailType} title={this.state.title} detail={this.state.detail} detail_id={this.state.detail_id} editDetail={this.editDetail.bind(this)} />
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Withdraw_Deviations'?this.withdrawAllDeviations.bind(this):(this.state.buttonType === 'Withdraw'? this.Withdraw.bind(this):this.submitDeviations.bind(this))} ref="Modal" />
            </div>
        )
    }
}
