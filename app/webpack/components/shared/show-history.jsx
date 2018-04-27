import React, { Component } from 'react';
export class Showhistory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide",
            retailer_name:'',
            props_data:[]
        }
    }
    showModal(data){
        this.setState({
            modalshowhide:"modal_show",
            props_data:data?data.details:[],
            retailer_name:data?data.retailer_name:''
        })
    }
    closeModal(){
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    render(){
        return(
            <div id="modal_history" className={this.state.modalshowhide}>
                <div className="history_box">
                    <h4><span>History</span><a onClick={this.closeModal.bind(this)}>X</a></h4>
                    <div className="history_nr">
                    {this.state.props_data.map((item,index)=>{
                        return <dl key={index}>
                                    {item.propose_deviation && item.retailer_response ?
                                    <dd>
                                        <dfn><abbr></abbr>{this.state.retailer_name}</dfn>
                                        <span>
                                            Proposed Deviation : {item.propose_deviation?decodeURI(item.propose_deviation):""}<br/>
                                            Response : {item.retailer_response?decodeURI(item.retailer_response):""}
                                        </span>
                                    </dd>:''}
                                    {item.sp_response?
                                    <dt>
                                        <dfn><abbr></abbr>SP Group</dfn>
                                        <span>{item.sp_response?decodeURI(item.sp_response):""}</span>
                                    </dt>:''}
                                </dl>
                    })}
                    </div>
                </div>
            </div>
        )
    }
}