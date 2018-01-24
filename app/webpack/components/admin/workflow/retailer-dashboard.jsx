import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {arrangementDetail} from '../../../javascripts/componentService/admin/service';
export class Adminretailerdashboard extends Component {
    constructor(props, context){
        super(props);
        this.state={
            showDetail:{},
            step:[1,2,3,4,5]
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
        arrangementDetail(id).then(res=>{
            this.setState({
                showDetail:res,
            })
            this.refs.Modal.showModal();
        },error=>{

        })
    }
    manage_contact(id){
        this.props.page(id);
    }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt3 u-mb3">{this.props.title}</h2>
                <div className="col-sm-12 col-md-12 propose_deviations">
                    {this.props.retailer_list.length > 0 ? 
                    <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Sign Confidentiality Undertaking</th>
                                <th>Tender Documents</th>
                                <th>Deviations (if any)</th>
                                <th>Submit Form of Tender</th>
                                <th>Contact Details</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.retailer_list.map((item,index)=>{
                                        return <tr key={index}>
                                                    <td>{item.company_name}</td>
                                                        {
                                                            this.state.step.map((it,i)=>{
                                                                return <td key={i}>{
                                                                                item.detail.flows[i] ? 
                                                                                (item.detail.current.current_node === it ? 
                                                                                    (item.detail.current.current_status === '2' ? <abbr className="step_pending"></abbr> : 
                                                                                    (item.detail.current.current_status === 'closed' ? <abbr className="step_finished"></abbr>:
                                                                                    (item.detail.current.current_status === 'rejected' ? '' : <abbr className="step_finished"></abbr>)))
                                                                                    :<abbr className="step_finished"></abbr>)
                                                                                : ''}</td>
                                                            })
                                                        }
                                                    <td>{item.detail.current.turn_to_role === 2 ? <button disabled={true}>Manage Contact</button> 
                                                        : <button onClick={this.manage_contact.bind(this,item.arrangement_id)}>Manage Contact</button>}
                                                        <button onClick={this.showDetail.bind(this,item.arrangement_id)}>Contact Details</button></td>
                                                </tr>
                                    })
                                }
                            </tbody>
                    </table>
                    :<div></div>
                    }
                </div>
                <Modal showdetail={this.state.showDetail} ref="Modal" />
            </div>
        )}
    }
