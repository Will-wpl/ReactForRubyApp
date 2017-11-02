import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
export class BidderStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            list_data:[
                {"name":"Keppel","color":"green","message":"1"},
                {"name":"Keppel","color":"red","message":"2"},
                {"name":"Keppel","color":"yellow","message":"3"},
                {"name":"Keppel","color":"green","message":"4"},
                {"name":"Keppel","color":"green","message":"5"},
                {"name":"Keppel","color":"green","message":"6"},
                {"name":"Keppel","color":"green","message":"7"},
                {"name":"Keppel","color":"green","message":"8"},
                {"name":"Keppel","color":"green","message":"9"},
                {"name":"Keppel","color":"green","message":"10"},
                {"name":"Keppel","color":"green","message":"11"},
                {"name":"Keppel","color":"green","message":"12"},
                {"name":"Keppel","color":"green","message":"13"},
            ],
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
                <h3>Bidders Status of Acceptance</h3>
                <ul className="bidders_list">
                    {
                        this.state.list_data.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-md-7">{item.name}</span>
                                <span className="col-md-3"><abbr className={item.color}></abbr></span>
                                <span className="col-md-2" onClick={this.showDetail.bind(this,item.message)}>Details</span>     
                            </li>)
                        })
                    }
                </ul>
                <div className="color_show">
                    <label><span className="green"></span><dfn>Accepled</dfn></label>
                    <label><span className="yellow"></span><dfn>Pending</dfn></label>
                    <label><span className="red"></span><dfn>Rejected</dfn></label>
                </div>
                </div>
                <Modal text={this.state.text} ref="Modal" />
            </div>
        )
    }
}