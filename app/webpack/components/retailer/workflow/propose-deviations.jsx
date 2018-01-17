import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {retailerWithdrawAllDeviations,retailerSubmitDeviations,retailerNext} from '../../../javascripts/componentService/retailer/service';
export class Proposedeviations extends React.Component{
    constructor(props){
        super(props);
        this.state={
            peak_lt:0,peak_hts:0,
            peak_htl:0,peak_eht:0,off_peak_lt:0,off_peak_hts:0,
            off_peak_htl:0,off_peak_eht:0,buttonType:'',
            deviations_list:[
                {item:1,clause:3.5,select_list:[1,2,3,4,5,6,7,8],propose_deviation:'xxxxxxxxxxxx',retailer_response:'xxxxxx',sp_response:'Accepted : this item should change to 10%'},
                {item:2,clause:5.1,select_list:[1,2,3,4,5,6,7,8],propose_deviation:'xxxxxxxxxxxx',retailer_response:'xxxxxx',sp_response:'Accepted : this item should change to 10%'},
                {item:3,clause:5.2,select_list:[1,2,3,4,5,6,7,8],propose_deviation:'xxxxxxxxxxxx',retailer_response:'xxxxxx',sp_response:'Accepted : this item should change to 10%'},
                {item:4,clause:4.5,select_list:[1,2,3,4,5,6,7,8],propose_deviation:'xxxxxxxxxxxx',retailer_response:'xxxxxx',sp_response:'Accepted : this item should change to 10%'},
            ]
        }
    }
    componentDidMount() {
        
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Withdraw_Deviations"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to withdraw all deviations?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to submit deviations?"
            });
        }
    }
    withdrawDeviations(){
        retailerWithdrawAllDeviations(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        })
    }
    submitDeviations(){
        retailerSubmitDeviations(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        })
    }
    save(){

    }
    next(){
        retailerNext(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        })
    }
    addDeviations(){
        let add_new = {item:'',clause:'',select_list:[1,2,3,4,5,6,7,8],
                        propose_deviation:'',
                        retailer_response:'',
                        sp_response:''},list = this.state.deviations_list;
                        list.push(add_new);
        this.setState({deviations_list:list});
    }
    removeDeviations(index){
        let list  =  this.state.deviations_list;
        list.splice(index,1);
        this.setState({deviations_list:list});
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
                                    return <tr key={index}>
                                            <td>
                                                <select id={"item_"+(index)} defaultValue={item.item}>
                                                    {item.select_list.map((it,i)=>{
                                                        return <option key={i} value={it}>{it}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td ><input type="text" id={"clause_"+(index)} defaultValue={item.clause}/></td>
                                            <td ><input type="text" id={"deviation_"+(index)} defaultValue={item.propose_deviation}/></td>
                                            <td ><input type="text" id={"response_"+(index)} defaultValue={item.retailer_response}/></td>
                                            <td >{item.sp_response}</td>
                                            <td>{item.item === ""?<button onClick={this.removeDeviations.bind(this,index)}>remove</button>:<div><button>History</button><button>Withdraw</button></div>}</td>
                                            </tr>
                                        })
                                :this.state.deviations_list.map((item,index)=>{
                                    return <tr>
                                            <td>{item.item}</td>
                                            <td >{item.clause}</td>
                                            <td >{item.propose_deviation}</td>
                                            <td >{item.retailer_response}</td>
                                            <td >{item.sp_response}</td>
                                            <td><button>History</button></td>
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
                        <button className="lm--button lm--button--primary" disabled={!this.props.current.actions.node3_retailer_submit} onClick={this.showConfirm.bind(this,'Submit_Deviations')}>Submit Deviations</button></div> :
                        <button className="lm--button lm--button--primary" onClick={this.next.bind(this)}>Next</button>
                        }
                    </div>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Withdraw_Deviations'?this.withdrawDeviations.bind(this):this.submitDeviations.bind(this)} ref="Modal" />
            </div>
        )
    }
}
