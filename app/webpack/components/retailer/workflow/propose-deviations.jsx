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
            select_list:[],
            deviations_list:[]
        }
    }
    componentDidMount() {
        this.changeNext()
        this.refresh();
    }
    refresh(){
        getRetailerDeviationsList(sessionStorage.arrangement_id).then(res=>{
            let select_list = [];
            for(let i = 0; i<res.attachments_count; i++)
            {
                select_list.push(i+1);
            }
            this.setState({select_list:select_list})
            if(res.chats.length > 0){
                console.log(res.chats);
                this.setState({deviations_list:res.chats});
            }else{
                this.setState({
                    deviations_list:[
                        {id:0,item:1,clause:'',propose_deviation:'',retailer_response:'',sp_response:'',sp_response_status:'3'},
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
                text:"Are you sure want to withdraw all deviations?"
            });
        }else if(type == "Withdraw"){
            this.refs.Modal.showModal("comfirm",obj);
            this.setState({
                text:"Are you sure want to withdraw this deviations?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to submit deviations?"
            });
        }
    }
    withdrawAllDeviations(){
        retailerWithdrawAllDeviations(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.props.page();
            //this.props.tenderFn();
        })
    }
    Withdraw(obj){
        $("#withdraw_"+obj.index).attr("disabled","disabled");
        retailerWithdraw(this.props.current.current.arrangement_id,{id:obj.id,propose_deviation:$('#deviation_'+obj.index).val()}).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"This deviation has been withdrawed"
            });
            this.props.page();
            setTimeout(()=>{
                this.changeNext();
            },100)
        })
    }
    changeNext(){
        if(this.props.current.actions){
            if(this.props.current.actions.node3_retailer_next){
                if(this.props.tenderFn){
                  this.props.tenderFn();
                }
            }
        }
    }
    submitDeviations(){
        console.log(this.editData());
        retailerSubmitDeviations(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Submit deviations successful!"
            });
            this.refresh();
        })
    }
    save(){
        retailerDeviationsSave(this.props.current.current.arrangement_id,this.editData()).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Save deviations successful!"
            });
            this.refresh();
        })
    }
    next(){
        retailerNext(this.props.current.current.arrangement_id,3).then(res=>{
            this.props.page();
        })
    }
    editData(){
        let deviationslist = [];
        this.state.deviations_list.map((item, index) => {
            deviationslist += '{"id":"'+item.id+'","item":"'+$("#item_"+(index)).val()+'","clause":"'+$("#clause_"+(index)).val()+'","propose_deviation":"'+$("#deviation_"+(index)).val()+'","retailer_response":"'+$("#response_"+(index)).val()+'","sp_response_status":"'+item.sp_response_status+'"},';
        })
        deviationslist = deviationslist.substr(0, deviationslist.length-1);
        deviationslist = '['+deviationslist+']';
        return deviationslist;
    }
    addDeviations(){
        let add_new = {id:0,item:1,clause:'',
                        propose_deviation:'',
                        retailer_response:'',
                        sp_response_status:'3'},list = this.state.deviations_list;
                        list.push(add_new);
        this.setState({deviations_list:list});
    }
    removeDeviations(index){
        let list  =  this.state.deviations_list;
        list.splice(index,1);
        this.setState({deviations_list:list});
    }
    showhistory(id){
        getTenderhistory('admin',id).then(res=>{
            console.log(res);
            this.refs.history.showModal(res);
        })
    }
    render(){
        return(
            <div className="propose_deviations u-mt3">
                <h2 className="u-mt3 u-mb3">Propose Deviations</h2>
                <div className="col-sm-12 col-md-10 push-md-1">
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
                                {!this.props.tender ? 
                                    this.state.deviations_list.map((item,index)=>{
                                        if(item.sp_response_status === "1"){
                                            return <tr key={index}>
                                            <td>
                                                <select id={"item_"+(index)} defaultValue={item.item} disabled>
                                                    {this.state.select_list.map((it,i)=>{
                                                        return <option key={i} value={it}>{it}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td ><input disabled type="text" id={"clause_"+(index)} defaultValue={item.clause}/></td>
                                            <td ><input disabled type="text" id={"deviation_"+(index)} defaultValue={item.propose_deviation}/></td>
                                            <td ><input disabled type="text" id={"response_"+(index)} defaultValue={item.retailer_response}/></td>
                                            <td >{item.sp_response}</td>
                                            <td><button id={"history_"+index} onClick={this.showhistory.bind(this,item.id)} >History</button></td>
                                            </tr>
                                        }else{
                                            return <tr key={index}>
                                            <td>
                                                <select id={"item_"+(index)} defaultValue={item.item}>
                                                    {this.state.select_list.map((it,i)=>{
                                                        return <option key={i} value={it}>{it}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td ><input type="text" id={"clause_"+(index)} defaultValue={item.clause}/></td>
                                            <td ><input type="text" id={"deviation_"+(index)} defaultValue={item.propose_deviation}/></td>
                                            <td ><input type="text" id={"response_"+(index)} defaultValue={item.retailer_response}/></td>
                                            <td >{item.sp_response}</td>
                                            <td>{item.item === ""?<button id={"remove_"+index} onClick={this.removeDeviations.bind(this,index)}>remove</button>:
                                            (item.id===0?'':<div><button onClick={this.showhistory.bind(this,item.id)} id={"history_"+index}>History</button>
                                            <button disabled={item.sp_response_status === "4" ? true : false} id={"withdraw_"+index} onClick={this.showConfirm.bind(this,'Withdraw',{id:item.id,index:index})}>Withdraw</button></div>)}</td>
                                            </tr>
                                        }
                                    
                                        })
                                :this.state.deviations_list.map((item,index)=>{
                                    return <tr key={index}>
                                            <td>{item.item}</td>
                                            <td >{item.clause}</td>
                                            <td >{item.propose_deviation}</td>
                                            <td >{item.retailer_response}</td>
                                            <td >{item.sp_response}</td>
                                            <td><button onClick={this.showhistory.bind(this,item.id)}>History</button></td>
                                            </tr>
                                        })
                                }
                            </tbody>
                    </table>
                    {!this.props.tender ? <div className="workflow_btn u-mt3 u-mb3"><a onClick={this.addDeviations.bind(this)}>add</a></div> :''}
                    <div className="workflow_btn u-mt3">
                        {!this.props.tender ?
                        <div><button className="lm--button lm--button--primary" disabled={!this.props.current.actions.node3_retailer_withdraw_all_deviations} onClick={this.showConfirm.bind(this,'Withdraw_Deviations')}>Withdraw All Deviations</button>
                        <button className="lm--button lm--button--primary" onClick={this.save.bind(this)}>Save</button>
                        <button className="lm--button lm--button--primary" disabled={!this.props.current.actions.node3_retailer_submit_deviations} onClick={this.showConfirm.bind(this,'Submit_Deviations')}>Submit Deviations</button></div> :
                        <button className="lm--button lm--button--primary" onClick={this.next.bind(this)}>Next</button>
                        }
                    </div>
                </div>
                <Showhistory ref="history" />
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Withdraw_Deviations'?this.withdrawAllDeviations.bind(this):(this.state.buttonType === 'Withdraw'? this.Withdraw.bind(this):this.submitDeviations.bind(this))} ref="Modal" />
            </div>
        )
    }
}
