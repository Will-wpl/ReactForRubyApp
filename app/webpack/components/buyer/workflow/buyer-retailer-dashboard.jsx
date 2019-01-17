import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {buyerarrangementDetail} from '../../../javascripts/componentService/common/service';
import {getUserApprovalStatus } from '../../../javascripts/componentService/util';
export class Buyerretailerdashboard extends Component {
    constructor(props, context){
        super(props);
        this.state={
            showDetail:{},
            step:[1,2,3,5]
        }
        this.auction = {};
        this.holdStatus = false;
    }
    componentDidMount(){

    }
    componentWillMount(){

    }
    showDetail(id){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        if(this.props.onAddturly === 'jest'){
            return;
        }
        buyerarrangementDetail(id).then(res=>{
            this.setState({
                showDetail:res,
            })
            this.refs.Modal.showModal();
        },error=>{

        })
    }
    manage_contact(id,name,truely,index){
        this.props.page(id,name,truely,index);
    }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt2 u-mb2">{this.props.title}</h2>
                <h4 className="u-mt1 u-mb1">Total number of Retailers : {this.props.step_counts[0]}</h4>
                <div className="col-sm-12 col-md-12 propose_deviations">
                    {this.props.retailer_list.length > 0 ?
                    <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Auction Participation<br/>({this.props.step_counts[1]})</th>
                                <th>Tender Documents<br/>({this.props.step_counts[2]})</th>
                                <th>Deviations (if any)<br/>({this.props.step_counts[3]})</th>
                                {/*<th>Submit Form of Tender</th>*/}
                                <th>Contact Details<br/>({this.props.step_counts[5]})</th>
                                <th>Finished<br/>({this.props.step_counts[6]})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.retailer_list.map((item,index)=>{
                                        return <tr key={index}>
                                                    <td>{item.company_name}<br/><span className="statusBack" style={item.status=='0'?{"color":"red"}:(item.status=='2'?{"color":"orange"}:{"color":"#54BD1B"})}>({getUserApprovalStatus(item.status)})</span></td>
                                                        {
                                                            this.state.step.map((it,i)=>{
                                                                let flows = [null,null,null,null];
                                                                item.detail.flows.map((s,k)=>{
                                                                    if(s==5){
                                                                        flows[s-2]=s;
                                                                    }else{
                                                                        flows[s-1]=s;
                                                                    }

                                                                })
                                                                return <td key={i}>{
                                                                                flows[i] ?
                                                                                (item.detail.current.current_node === it ?
                                                                                    (item.detail.current.current_status === '2' ? <abbr className="step_pending" onClick={item.detail.current.turn_to_role === 2?this.manage_contact.bind(this,item.arrangement_id,item.company_name,false):this.manage_contact.bind(this,item.arrangement_id,item.company_name,true)}></abbr> : // 2 retailer click submit in step4
                                                                                    (item.detail.current.current_status === '0' ? <abbr className="step_pending" onClick={item.detail.current.turn_to_role === 2?this.manage_contact.bind(this,item.arrangement_id,item.company_name,false):this.manage_contact.bind(this,item.arrangement_id,item.company_name,true)}></abbr> : // 0 in progress
                                                                                    (item.detail.current.current_status === '4' ? <abbr className="step_pending" onClick={item.detail.current.turn_to_role === 2?this.manage_contact.bind(this,item.arrangement_id,item.company_name,false):this.manage_contact.bind(this,item.arrangement_id,item.company_name,true)}></abbr> : //4 admin reject
                                                                                    (item.detail.current.current_status === '3' ? <abbr className="step_finished cursor" onClick={item.detail.current.turn_to_role === 2?this.manage_contact.bind(this,item.arrangement_id,item.company_name,false):this.manage_contact.bind(this,item.arrangement_id,item.company_name,true)}></abbr> ://3 admin accept
                                                                                    (item.detail.current.current_status === 'closed' ? <abbr className="step_finished"></abbr>: //retailer step 5 submit
                                                                                    (item.detail.current.current_status === 'reject' ? '' : <abbr className="step_finished"></abbr>))))))//retailer 1step reject
                                                                                    :(it===3||it===4?<abbr className="step_finished cursor" onClick={this.manage_contact.bind(this,item.arrangement_id,item.company_name,false,it)}></abbr>:<abbr className="step_finished"></abbr>))
                                                                                : (i==2&&item.detail.current.current_node>3?"—":"")}</td>
                                                            })
                                                        }
                                                    <td>{item.detail.current.turn_to_role === 2 ? <button disabled={true}>Manage Contract</button>
                                                        :(item.detail.current.current_status === 'closed' || item.detail.current.current_status === null || item.detail.current.current_status === 'reject'?<button disabled={true}>Manage Contract</button>
                                                            :<button onClick={this.manage_contact.bind(this,item.arrangement_id,item.company_name,true)}>Manage Contract</button>)}
                                                        <button onClick={this.showDetail.bind(this,item.arrangement_id)}>Contact Details</button></td>
                                                </tr>
                                    })
                                }
                            </tbody>
                    </table>
                    :<h3 className="u-mt2 u-mb2"></h3>
                    }
                </div>
                <Modal showdetail={this.state.showDetail} ref="Modal" />
            </div>
        )}
    }
