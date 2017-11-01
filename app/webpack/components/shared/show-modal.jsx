import React, { Component } from 'react';
//共通弹出框组件
export class Modal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide"
        }
    }
    showModal(){
        this.setState({
            modalshowhide:"modal_show"
        })
    }
    closeModal(){
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    render(){
        return(
            <div id="modal_main" className={this.state.modalshowhide}>
                <h4><span>Warm tips</span><a onClick={this.closeModal.bind(this)}>X</a></h4>
                <div className="modal_detail">{this.props.text}</div>
            </div>
        )
    }
}