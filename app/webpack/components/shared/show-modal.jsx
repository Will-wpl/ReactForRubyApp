import React, { Component } from 'react';
//共通弹出框组件
export class Modal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide"
        }
    }
    showModal(type){
        this.setState({
            modalshowhide:"modal_show"
        })
        if(type == "comfirm"){
            this.setState({
                type:"comfirm"
            })
        }else{
            this.setState({
                type:"default"
            })
        }
    }
    Accept(){
        this.props.dodelete();
        this.setState({
            type:"default"
        })
    }
    closeModal(){
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    componentDidMount() {
         
    }
    render(){
        let showDetail = '',secondary = '',secondStatus='';
        if(this.props.showdetail && !this.props.text){
            this.secondaryData = [
                this.props.showdetail.alternative_name,
                this.props.showdetail.alternative_email_address,
                this.props.showdetail.alternative_mobile_number,
                this.props.showdetail.alternative_office_number
            ]
            let isChanged = this.secondaryData.some((element, index) => {
                    return element !== '' || undefined;
                })
                if(isChanged){
                    secondStatus = "live_show"
                }else{
                    secondStatus = "live_hide"
                }     
            secondary = <ol className={"showdetail "+secondStatus}>
                                <li>Alternative Contact</li>
                                <li>Name : {this.props.showdetail.alternative_name}</li>
                                <li>Email : {this.props.showdetail.alternative_email_address}</li>
                                <li>Mobile : {this.props.showdetail.alternative_mobile_number}</li>
                                <li>Office : {this.props.showdetail.alternative_office_number}</li>
                            </ol>
            showDetail = <ul className="showdetail">
                            <li>Main Contact</li>
                            <li>Name : {this.props.showdetail.main_name}</li>
                            <li>Email : {this.props.showdetail.main_email_address}</li>
                            <li>Mobile : {this.props.showdetail.main_mobile_number}</li>
                            <li>Office : {this.props.showdetail.main_office_number}</li>
                            {secondary}
                        </ul>
        }else{
            showDetail = '';
        }       
        let btn_html = '';
        if(this.state.type == "default"){
            btn_html = <div className="modal_btn"><a onClick={this.closeModal.bind(this)}>OK</a></div>;
        }else{
            btn_html = <div className="modal_btn"><a onClick={this.Accept.bind(this)}>Yes</a><a onClick={this.closeModal.bind(this)}>No</a></div>;
        }
        return(
            <div id="modal_main" className={this.state.modalshowhide}>
                <h4><a onClick={this.closeModal.bind(this)}>X</a></h4>
                <div className="modal_detail">{this.props.text}{showDetail}</div>
                {btn_html}
            </div>
        )
    }
}