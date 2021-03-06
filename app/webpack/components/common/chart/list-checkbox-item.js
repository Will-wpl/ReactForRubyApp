import React, { Component } from 'react';
import selected from '../../../images/images_for_white/selected.png';
import unselected from '../../../images/images_for_white/unselected.png';
import {getUserApprovalStatus} from '../../../javascripts/componentService/util';

export default class CheckboxListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { status: true ,list:{}}
    }
    componentWillReceiveProps(next) {
        // console.log(next.list);
        this.setState({status: next.status,list:next.list});
    }
    onItemClick(id, status, color) {
        this.setState({ status: status });
        this.props.onCheck(id, status, color);
    }
    showTitle(id){
        $("#title_"+this.props.type+"_"+id).stop(true,false).fadeIn(500);
    }
    hideTitle(id){
        $("#title_"+this.props.type+"_"+id).stop(false,true).fadeOut(500);
    }
    render() {
        return (
            <li className="checkitem" onMouseOver={this.showTitle.bind(this,this.props.index)} onMouseLeave={this.hideTitle.bind(this,this.props.index)} onClick={this.onItemClick.bind(this, this.props.id, !this.state.status, this.props.color)} style={{ color:this.props.color,cursor: 'pointer' }}>
                <img src={this.state.status ? selected : unselected} alt="selectstatus" />
                <span>{this.props.display}
                <p className={this.state.list? (this.state.list.approval_status==="2"?"isDisplayInLine":"isHide"):''}>{this.state.list? ' (' + getUserApprovalStatus(this.state.list.approval_status) + ')' : ''}</p>
                {/* {this.state.list? ' (' + getUserApprovalStatus(this.state.list.approval_status) + ')' : ''} */}
                </span>
                {this.props.type && this.state.list?<div id={"title_"+this.props.type+"_"+this.props.index}>
                    <b>Name : <bdo>{this.state.list?this.state.list.main_name:""}</bdo></b>
                    <b>Email Address : <bdo>{this.state.list?this.state.list.main_email_address:""}</bdo></b>
                    <b>Mobile Number(+65) : <bdo>{this.state.list?this.state.list.main_mobile_number:""}</bdo></b>
                    <b>Office Number(+65) : <bdo>{this.state.list?this.state.list.main_office_number:""}</bdo></b>
                    {this.state.list.alternative_name !=""?<b>Alternative Name :<bdo>{this.state.list?this.state.list.alternative_name:""}</bdo></b>:''}
                    {this.state.list.alternative_email_address !=""?<b>Alternative Email Address :<bdo>{this.state.list?this.state.list.alternative_email_address:""}</bdo></b>:''}
                    {this.state.list.alternative_mobile_number !=""?<b>Alternative Mobile Number(+65) :<bdo>{this.state.list?this.state.list.alternative_mobile_number:""}</bdo></b>:''}
                    {this.state.list.alternative_office_number !=""?<b>Alternative Office Number(+65) :<bdo>{this.state.list?this.state.list.alternative_office_number:""}</bdo></b>:''}
                </div>:''}
            </li>
        );
    }
}