import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../shared/show-modal';
import {DoFillConsumption} from './fill-consumption'
export class FillConsumption extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"Intake Level has unrepeatable",
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
    componentDidMount() {
        
    }
    componentWillUnmount() {
         
    }
    add_site(){
        let list = {};
        list = {
            number:'A000032100',
            level:['LT','HTS','HTL'],
            peak:'',
            off_peak:''
        }
        this.site_list.push(list);
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
    render () {
        return (
            <div>
                <form>
                <div className="u-grid buyer">
                    <div className="col-sm-12 col-md-8 push-md-2">
                    <DoFillConsumption site_list={this.site_list} />
                    <div className="addSite"><a>Add Site</a></div>
                    <div className="buyer_btn">
                        <button className="lm--button lm--button--primary">Reject</button>
                        <button className="lm--button lm--button--primary">Participate</button>
                    </div>
                    </div>
                </div>
                <Modal text={this.state.text} ref="Modal" />
                </form>
            </div>
        )
    }
}

BidderStatus.propTypes = {
  onAddClick: ()=>{}
};