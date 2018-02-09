import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {retailerReject,retailerAccept,getUndertaking} from '../../../javascripts/componentService/retailer/service';

export class Signconfidentialityundertaking extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buttonType:'',file_path:'',file_name:''
        }
    }
    componentDidMount() {
        getUndertaking(sessionStorage.arrangement_id).then(res=>{
            //console.log(res);
            this.setState({
                file_path:res[0].file_path,
                file_name:res[0].file_name
            })
        })
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to reject the Confidentiality Undertaking ?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to accept the Confidentiality Undertaking ?"
            });
        }
    }
    do_reject(){
        retailerReject(this.props.current.current.arrangement_id).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"Thank you for the confirmation. You have rejected the Confidentiality Undertaking."
            });
            setTimeout(()=>{
                window.location.href="/retailer/auctions";
            },3000)
        },error=>{

        })
    }
    do_accept(){
        retailerAccept(this.props.current.current.arrangement_id).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"You have accepted the Confidentiality Undertaking."
            });
            setTimeout(()=>{
                this.props.page();
            },3000)
        },error=>{

        })
    }
    render(){
        return(
            <div className="sign_box">
                {this.props.current.current.current_status ?
                <h4>You have {this.props.current.current.current_status === 'reject' ? 'rejected' : 'accepted'} the Confidentiality Undertaking.</h4>
                :''}
                <p>Please read attached Confidentiality Undertaking and click on 'Accept' to indicate acceptance. 
                    Tender documents will only be released to you upon your acceptance of Confidentiality Undertaking.</p>
                    <div className="u-mt3 u-mb3 download">
                        <span>Click to Download : </span>
                        <a className="download_ico" download={this.state.file_name} href={"/"+this.state.file_path}></a>
                    </div>
                {this.props.current.actions ?
                <div className="workflow_btn u-mt3">
                    <button disabled={this.props.propsdisabled?true:(this.props.current.actions.node1_retailer_reject?!this.props.current.actions.node1_retailer_reject:false)} className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Reject')} >Reject</button>
                    <button disabled={this.props.propsdisabled?true:(this.props.current.actions.node1_retailer_accept?!this.props.current.actions.node1_retailer_accept:false)} className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Accept')} >Accept</button>
                </div>
                : <div></div>}
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Reject'?this.do_reject.bind(this):this.do_accept.bind(this)} ref="Modal" />
            </div>
        )
    }
}
