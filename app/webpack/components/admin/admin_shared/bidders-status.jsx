import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {arrangementDetail} from '../../../javascripts/componentService/admin/service';
export class BidderStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"message",
            showDetail:{},
            modalshowhide:"modal_hide"
        }
    }
    showDetail(id,obj){
        arrangementDetail(id).then(res=>{
            this.setState({
                showDetail:res,
            })
            this.refs.Modal.showModal();
        },error=>{

        })
    }
    render () {
        return (
            <div className="u-grid bidderStatus">
                <div className="col-sm-12 col-md-12">
                <h3>Bidders Status of Submission</h3>
                <ul className="bidders_list">
                    {
                        this.props.dataList.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-sm-7 col-md-7">{item.company_name}</span>
                                <span className="col-sm-3 col-md-3"><abbr className={'color'+item.accept_status}></abbr></span>
                                <span className="col-sm-2 col-md-2" onClick={this.showDetail.bind(this,item.id)}>Details</span>     
                            </li>)
                        })
                    }
                </ul>
                <div className="color_show">
                    <label><span className="green"></span><dfn>Submitted</dfn></label>
                    <label><span className="yellow"></span><dfn>Pending</dfn></label>
                    {/*Displaying in Future Iteration */}
                    {/*<label><span className="red"></span><dfn>Rejected</dfn></label>*/}
                </div>
                </div>
                <Modal showdetail={this.state.showDetail} ref="Modal" />
            </div>
        )
    }
}