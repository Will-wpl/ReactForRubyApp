import React, { Component, PropTypes } from 'react'
//import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {deleteAuction,updateStatus,deleteStatus,getUsersDetail} from '../../../javascripts/componentService/admin/service';
export class SearchList extends Component {
    constructor(props, context){
        super(props);
        this.state={
            text:"",showDetail:{},
            name:"",params_type:true
        }
    }
    dosearch(index,obj){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let listData = {};
        if(this.props.list_data){
            listData = this.props.list_data;
            listData.page_index = index;
            //console.log(listData);
            if(this.props.doSearch && this.props.list_url){
                this.props.doSearch(listData,this.props.list_url);
            }
        }
    }
    gotopage(type,obj){
        if(this.props.list_data){
            let index = this.props.list_data.page_index;
            if(type === 'prev'){
                if(index === 1){
                    return;
                }else{
                    index = index - 1;
                    this.dosearch(index);
                }
            }else{
                if(index === this.props.page_total.length){
                    return;
                }else{
                    index = index + 1;
                    this.dosearch(index);
                }
            }
        }
    }
    clickFunction(id,url,name,type,list_name,auction_id){
        if(type == "auction"){
            if(auction_id){
                sessionStorage.arrangement_id=id;
                sessionStorage.auction_id=auction_id;
            }else{
                sessionStorage.auction_id=id;
            }
        }
        if(type == "show_detail"){
            this.setState({
                params_type:true
            })
            getUsersDetail(id).then(res=>{
                console.log(res);
                this.setState({
                    showDetail:res,
                })
                this.refs.Modal.showModal();
            },error=>{

            })
            return;
        }
        if(name == "Delete"){
            this.auction_id = id;
            this.showDelete(list_name);
        }else{
            window.location.href=`${url.replace(":id",id)}`;
        }
        
    }
    showDelete(auction_name){
        this.refs.Modal.showModal("comfirm");
        this.setState({text:"Are you sure want to delete?",name:auction_name,params_type:false});
    }
    delete(){
        deleteAuction({ auction: {id:this.auction_id}}).then(res => {
                this.refs.Modal.showModal();
                this.setState({
                    text:this.state.name + " has been successfully deleted."
                });
                this.dosearch(1);
            }, error => {
                this.setState({
                    text:'Request exception,Delete failed!'
                });
                this.refs.Modal.showModal();
            })
    }
    doinvite(type,user_id,select_action){
        let invite_type = this.props.type === 'Select Retailers' ? 'arrangements' : 'consumptions';
        if(type === "invite"){
            updateStatus({
                id:0,
                type:invite_type,
                data:{
                    id:0,
                    auction_id:sessionStorage.auction_id,
                    user_id:user_id
                }
            }).then(res=>{
                this.dosearch(this.props.list_data.page_index);
            },error=>{
                this.setState({
                    text:'Request exception failed!'
                });
                this.refs.Modal.showModal();
            })
        }else{
            deleteStatus({
                id:select_action,
                type:invite_type,
                data:{
                    action_status:0
                }
            }).then(res=>{
                this.dosearch(this.props.list_data.page_index);
            },error=>{
                this.setState({
                    text:'Request exception failed!'
                });
                this.refs.Modal.showModal();
            })
        }
    }
    render (){
        if(this.props.table_data){
            //console.log(this.props.table_data);
            return (
                <div className="lm--table-container">
                    <table className="lm--table lm--table--responsive">
                        <thead>
                        <tr>
                            {
                                this.props.table_data.headers.map((item,index)=>{
                                    if(item.name){
                                        return <th key={index}>{item.name}</th>
                                    }
                                    
                                })
                            }
                        <th/>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.table_data.bodies.data.map((item,index)=>{
                                    return <tr key={index}>
                                                {
                                                    this.props.table_data.headers.map((it,i)=>{
                                                        if(it.field_name === 'select_action'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === null 
                                                                        ? <span className={'invite'} onClick={this.doinvite.bind(this,'invite',item.user_id)}>Invite</span> 
                                                                        :(
                                                                            item[`select_status`] === '2' 
                                                                            ? <span className={'cancel_invite'} onClick={this.doinvite.bind(this,'not_invite',item.user_id,item.select_action)}>Cancel Invite</span>
                                                                            : (item[`select_status`] === null ? <span className={'invite'} onClick={this.doinvite.bind(this,'invite',item.user_id)}>Invite</span>  : '')
                                                                        )
                                                                    }
                                                                   </td>
                                                        }else if(it.field_name === 'select_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === null ? <div className={'select_ico_0'}></div> : <div className={'select_ico_'+item[`${it.field_name}`]}></div>}
                                                                   </td>
                                                        }else if(it.field_name === 'publish_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? 'Unpublished' : 'Published'}
                                                                   </td>
                                                        }else if(it.field_name === 'participation_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? <div className={'participation_status_0'}></div> : <div className={'participation_status_'+item[`${it.field_name}`]}></div>}
                                                                   </td>
                                                        }else if(it.field_name === 'account_housing_type'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? 'HDB' : (item[`${it.field_name}`] === '1' ? 'Private High-rise' : 'Landed')}
                                                                   </td>
                                                        }else if(it.field_name === 'actions'){
                                        
                                                        }else{
                                                            return <td key={i}>
                                                                {it.field_name === "actual_begin_time" 
                                                                ? moment(item[`${it.field_name}`]).format('D MMM YYYY hh:mm A') 
                                                                : item[`${it.field_name}`]}
                                                                </td>
                                                        }
                                                        
                                                    })
                                                }
                                                <td className="search_list_btn">
                                                    {
                                                        item["actions"] >= 0 ? (<a className={this.props.table_data.actions[item["actions"]].icon} 
                                                                            onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,this.props.table_data.actions[item["actions"]].url,this.props.table_data.actions[item["actions"]].name,this.props.table_data.actions[item["actions"]].interface_type ? this.props.table_data.actions[item["actions"]].interface_type : "",item.name ? item.name : '',item.auction_id)}>
                                                                            {this.props.table_data.actions[item["actions"]].name}</a>)
                                                        : (this.props.table_data.actions.map((ik,k)=>{
                                                            return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "",item.name ? item.name : '',item.auction_id)}>{ik.name}</a>
                                                        }))
                                                    }
                                                </td>
                                            </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <div className="table_page">
                        <span onClick={this.gotopage.bind(this,'prev')}>{"<"}</span>
                        {
                            this.props.page_total.map((item,index)=>{
                                return <span key={index} className={this.props.list_data.page_index === item ? 'table_page_selected' : ''} onClick={this.dosearch.bind(this,item)} id={"table_page_"+item}>{item}</span>
                            })
                        }
                        {/* <span className="table_page_selected">1</span>
                        <span>2</span> */}
                        <span onClick={this.gotopage.bind(this,'next')}>{">"}</span>
                    </div>
                    <Modal text={this.state.text} listdetail={this.state.params_type ? this.state.showDetail : null} listdetailtype={this.props.type} dodelete={this.delete.bind(this)} ref="Modal" />
                </div>
            )
        }else{
            return <div>interface bad!!</div>
        }
    }
}
SearchList.propTypes = {
    onAddClick: ()=>{}
  };