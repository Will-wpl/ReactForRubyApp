import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {retailerReject,retailerAccept} from '../../../javascripts/componentService/retailer/service';

export class Signconfidentialityundertaking extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buttonType:''
        }
    }
    componentDidMount() {
        
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to reject this auction?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to accept this auction?"
            });
        }
    }
    do_reject(){
        retailerReject(this.props.current.current.arrangement_id).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"This auction has been rejected!"
            });
            setTimeout(()=>{
                window.location.href="/retailer/auctions";
            },3000)
        },error=>{

        })
    }
    do_accept(){
        retailerAccept(this.props.current.current.arrangement_id).then(res=>{
            this.props.page();
        },error=>{

        })
    }
    render(){
        return(
            this.props.current.actions ?
            <div className="sign_box">
                <h4>You have rejected the Confidentiality Undertaking.</h4>
                <p>Please read attached Confidentiality Undertaking and click on 'Accept' to indicate acceptance. 
                    Tender documents will only be released to you upon your acceptance of Confidentiality Undertaking</p>
                    <div className="u-mt3 u-mb3">
                        <a href="#">download</a>
                    </div>
                <div className="workflow_btn u-mt3">
                    <button disabled={!this.props.current.actions.node1_retailer_reject} className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Reject')} >Reject</button>
                    <button disabled={!this.props.current.actions.node1_retailer_accept} className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Accept')} >Accept</button>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Reject'?this.do_reject.bind(this):this.do_accept.bind(this)} ref="Modal" />
            </div>
            : <div></div>
        )
    }
}
