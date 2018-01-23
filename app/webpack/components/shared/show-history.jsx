import React, { Component } from 'react';
export class Showhistory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide",
            props_data:[]
        }
    }
    showModal(data){
        this.setState({
            modalshowhide:"modal_show",
            props_data:data?data:[]
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
                                    <dd>
                                        <dfn><abbr></abbr>Retailer</dfn>
                                        <span>
                                            Propose Deviation : {item.propose_deviation}<br/>
                                            Response : {item.retailer_response}
                                        </span>
                                    </dd>
                                    <dt>
                                        <dfn><abbr></abbr>SP</dfn>
                                        <span>{item.sp_response?item.sp_response:'No Response'}</span>
                                    </dt>
                                </dl>
                    })}
                    </div>
                </div>
            </div>
        )
    }
}