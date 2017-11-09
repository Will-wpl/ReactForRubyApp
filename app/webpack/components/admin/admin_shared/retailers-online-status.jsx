import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {arrangementDetail} from '../../../javascripts/componentService/admin/service';
export class RetailsOnlineStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            showDetail:{},
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
            <div>
            <div className="u-grid bidderStatus">
                <div className="col-sm-12 col-md-12">
                <ul className="bidders_list">
                    {
                        this.props.list_data.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-sm-9 col-md-9">{item.company_name}</span>
                                <span className="col-sm-3 col-md-3" onClick={this.showDetail.bind(this,item.id)}><abbr className={this.props.onlineStatus}></abbr></span>
                            </li>
                            )
                        })
                    }
                </ul>               
                </div>
            </div>
            <Modal showdetail={this.state.showDetail} ref="Modal" />
            </div>
        )
    }
}