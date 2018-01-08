import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../shared/show-modal';
import {DoFillConsumption} from './fill-consumption'
import {setBuyerParticipate} from '../../javascripts/componentService/common/service';
export class FillConsumption extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"",
            submit_type:"",
            site_list:[
                {
                    number:'A000032100',
                    level:['LT','HTS','HTL','EHT'],
                    peak:'',
                    off_peak:''
                }
            ]
        }
        this.consumptions_id = (window.location.href.split("consumptions/")[1]).split("/edit")[0];
    }
    add_site(){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let list = {},site_listObj = this.state.site_list;
        list = {
            number:'A000032100',
            level:['LT','HTS','HTL','EHT'],
            peak:'',
            off_peak:''
        }
        site_listObj.push(list)
        this.setState({
            site_list:site_listObj
        })
    }
    remove_site(index){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let site_listObj = this.state.site_list;
        site_listObj.splice(index,1);
        this.setState({
            site_list:site_listObj
        })
    }
    doAccept(){
        let makeData = {},buyerlist = [];
        this.state.site_list.map((item,index)=>{
            let detail = {};
            detail.account_number = $("#number"+(index+1)).val();
            detail.intake_level = $("#level"+(index+1)).val();
            detail.peak = $("#peak"+(index+1)).val();
            detail.off_peak = $("#off_peak"+(index+1)).val();
            detail.consumption_id = this.consumptions_id;
            buyerlist.push(detail);
            // buyerlist += '{"account_number":"'+$("#number"+(index+1)).val()+'","intake_level":"'+$("#level"+(index+1)).val()+'","peak":"'+$("#peak"+(index+1)).val()+'","off_peak":"'+$("#off_peak"+(index+1)).val()+'","consumption_id":"'+this.consumptions_id+'"},';
        })
        // buyerlist = buyerlist.substr(0,buyerlist.length-1);
        // buyerlist = '['+buyerlist+']';

        makeData = {
            consumption_id:this.consumptions_id,
            // details:JSON.parse(buyerlist)
            details:JSON.stringify(buyerlist)
        }
        console.log("---makeData-->"+makeData.details);
        if(this.state.submit_type === "Reject"){ //do Reject
            setBuyerParticipate({consumption_id:this.consumptions_id},'/api/buyer/consumption_details/reject').then(res=>{
                this.refs.Modal.showModal();
                this.setState({
                    text:"Thank you for the confirmation. You have rejected this auction."
                });
            },error=>{
                this.refs.Modal.showModal();
                this.setState({
                    text:"Interface failed"
                });
            })
            
        }else{//do Participate
            setBuyerParticipate(makeData,'/api/buyer/consumption_details/participate').then(res=>{
                this.refs.Modal.showModal();
                this.setState({
                    text:"Congratulations, your participation in this auction has been confirmed."
                });
            },error=>{
                this.refs.Modal.showModal();
                this.setState({
                    text:"Interface failed"
                });
            })
        }
    }
    doSubmit(type){
        this.setState({submit_type:type});
        if(type === "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to reject this auction?"
            });
        }
    }
    checkSuccess(event,obj){
        event.preventDefault();
        if(this.state.submit_type === "Participate"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure you want to participate in this auction?"
            });
        }
    }
    render () {
        return (
            <div>
                <h1>Participate in upcoming Reverse Auction exercise on </h1>
                <form name="buyer_form" method="post" onSubmit={this.checkSuccess.bind(this)}>
                <div className="u-grid buyer mg0">
                <h4 className="u-mb3"><input name="agree_auction" type="checkbox" required /> I agree to the terms and conditions.</h4>
                    <div className="col-sm-12 col-md-8 push-md-2">
                    <DoFillConsumption site_list={this.state.site_list} remove={this.remove_site.bind(this)} />
                    <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Site</a></div>
                    <div className="buyer_btn">
                        <a className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this,'Reject')}>Reject</a>
                        <button className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this,'Participate')}>Participate</button>
                    </div>
                    </div>
                </div>
                <Modal text={this.state.text} acceptFunction={this.doAccept.bind(this)} ref="Modal" />
                </form>
            </div>
        )
    }
}

FillConsumption.propTypes = {
  onAddClick: ()=>{}
};

function run() {
    const domNode = document.getElementById('buyer_fill_consumption');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(FillConsumption),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}