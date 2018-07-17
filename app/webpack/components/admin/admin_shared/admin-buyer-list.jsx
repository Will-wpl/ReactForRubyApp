import React, { Component, PropTypes } from 'react'
import {Modal} from '../../shared/show-modal';
import {arrangementDetail,getBidderStatus} from '../../../javascripts/componentService/admin/service';
export class BuyerList extends Component {
    constructor(props){
        super(props);
        this.state={
            showDetail:{},
            text:""
        }
    }
    componentDidMount() {
        
    }
    showDetail(item,obj){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        if(this.props.onAddturly === 'jest'){
            return;
        }
        if(item.participation_status === "1"){
            sessionStorage.setItem('comsumptiontype', this.props.dashboard.type)
            window.location.href="/admin/consumptions/"+item.id;
        }else{
            this.setState({
                text:'This buyer has yet to confirm participation.'
                });
            this.refs.Modal.showModal();
        }  
    }
    render () {
        return (
            this.props.dashboard?
            <div className="u-grid bidderStatus">
                <div className="col-sm-12 col-md-12">
                    <div className="lm--formItem lm--formItem--inline string optional">
                            <span className="lm--formItem-left lm--formItem-label string optional">Total number of buyers : </span>
                            <label className="lm--formItem-right lm--formItem-label lm--formItem-control">
                                {this.props.dashboard.count}
                            </label>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string optional">
                            <span className="lm--formItem-left lm--formItem-label string optional">Status of Requirements Submission : </span>
                            <label className="lm--formItem-right lm--formItem-control">
                            <ul className="bidders_list">
                                {
                                    this.props.dashboard.list.map((item,index) => {
                                    return(
                                        <li key={index} className="u-grid">
                                            <span className="col-sm-7 white" title={item.name}>{item.name}</span>
                                            <span className="col-sm-3"><abbr className={'color'+item.participation_status}></abbr></span>
                                            <span id="showDetail" className={item.participation_status==='1' ?"col-sm-2":"col-sm-2 isHide" }    onClick={this.showDetail.bind(this,item)}>Consumption Details{item.participation_status}</span>     
                                        </li>)
                                    })
                                }                          
                            </ul>
                            <div className="color_show">
                                <label><span className="green"></span><dfn>Confirmed</dfn></label>
                                <label><span className="yellow"></span><dfn>Pending</dfn></label>
                                <label><span className="red"></span><dfn>Rejected</dfn></label>
                            </div>
                            </label>
                    </div>
                </div>
                <Modal text={this.state.text} ref="Modal" />
            </div>:''
        )
    }
}
