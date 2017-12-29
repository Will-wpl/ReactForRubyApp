import React, { Component, PropTypes } from 'react'
//import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {deleteAuction} from '../../../javascripts/componentService/admin/service';
export class SearchList extends Component {
    constructor(props, context){
        super(props);
        this.state={
            text:""
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
    clickFunction(id,url,name,type,obj){
        if(type == "auction"){
            localStorage.auction_id=id;
        }
        if(name == "Delete"){
            this.auction_id = id;
            this.showDelete();
        }else{
            window.location.href=`${url.replace(":id",id)}`;
        }
        
    }
    showDelete(){
        this.refs.Modal.showModal("comfirm");
        this.setState({text:"Are you sure you want to delete?"});
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
    render (){
        if(this.props.table_data){
            console.log(this.props.table_data);
            return (
                <div className="lm--table-container">
                    <table className="lm--table lm--table--responsive">
                        <thead>
                        <tr>
                            {
                                this.props.table_data.headers.map((item,index)=>{
                                    return <th key={index}>{item.name}</th>
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
                                                        return <td key={i}>{item[`${it.field_name}`]}</td>
                                                    })
                                                }
                                                <td>
                                                    {
                                                        this.props.table_data.actions.map((ik,k)=>{
                                                            return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "")}>{ik.name}</a>
                                                        })
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
                                return <span key={index} className={this.props.list_data.page_index === item ? 'table_page_selected' : ''} onClick={this.dosearch.bind(this,item)}>{item}</span>
                            })
                        }
                        {/* <span className="table_page_selected">1</span>
                        <span>2</span> */}
                        <span onClick={this.gotopage.bind(this,'next')}>{">"}</span>
                    </div>
                    <Modal text={this.state.text} dodelete={this.delete.bind(this)} ref="Modal" />
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