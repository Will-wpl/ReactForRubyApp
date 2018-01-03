import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../shared/show-modal';
import {DoFillConsumption} from './fill-consumption'
export class FillConsumption extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"Intake Level has unrepeatable",
            submit_type:""
        }
        this.site_list = [
            {
                number:'A000032100',
                level:['LT','HTS','HTL'],
                peak:5234,
                off_peak:5235
            }
        ]
    }
    add_site(){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let list = {};
        list = {
            number:'A000032100',
            level:['LT','HTS','HTL'],
            peak:'',
            off_peak:''
        }
        this.site_list.push(list);
    }
    remove_site(index){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        this.site_list.splice(index,1);
    }
    showDetail(id,obj){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        if(this.props.onAddturly === 'jest'){
            return;
        }
        this.refs.Modal.showModal();
    }
    doSubmit(type){
        this.setState({submit_type:type});
    }
    checkSuccess(event,obj){
        event.preventDefault();
        if(this.state.submit_type === "Reject"){

        }else if(this.state.submit_type === "Participate"){

        }
    }
    render () {
        return (
            <div>
                <h1>Participate in upcoming Reverse Auction exercise on </h1>
                <form name="buyer_form" method="post" onSubmit={this.checkSuccess.bind(this)}>
                <div className="u-grid buyer">
                <h4><input name="agree_auction" type="checkbox" required /> I agree to the terms and conditions.</h4>
                    <div className="col-sm-12 col-md-8 push-md-2">
                    <DoFillConsumption site_list={this.site_list} remove={this.remove_site.bind(this)} />
                    <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Site</a></div>
                    <div className="buyer_btn">
                        <button className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this,'Reject')}>Reject</button>
                        <button className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this,'Participate')}>Participate</button>
                    </div>
                    </div>
                </div>
                <Modal text={this.state.text} ref="Modal" />
                </form>
            </div>
        )
    }
}

FillConsumption.propTypes = {
  onAddClick: ()=>{}
};