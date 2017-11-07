import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
export class BidderStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"message",
            modalshowhide:"modal_hide"
        }
    }
    showDetail(message,obj){
        this.setState({
            text:"user:"+message,
        })
        this.refs.Modal.showModal();
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
                <Modal text={this.state.text} ref="Modal" />
            </div>
        )
    }
}