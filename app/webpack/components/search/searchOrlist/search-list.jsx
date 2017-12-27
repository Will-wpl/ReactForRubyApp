import React, { Component, PropTypes } from 'react'
//import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
export class SearchList extends Component {
    constructor(props, context){
        super(props);
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
                                                <td><a className={this.props.table_data.actions[0].icon} href={`${this.props.table_data.actions[0].url.split(":id")[0]}${item.id}${this.props.table_data.actions[0].url.split(":id")[1]}`}>{this.props.table_data.actions[0].name}</a></td>
                                            </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <div className="table_page">
                        <span onClick={this.gotopage.bind(this,'prev')}>{"<"}</span>
                        {
                            this.props.page_total.map((item)=>{
                                return <span className={this.props.list_data.page_index === item ? 'table_page_selected' : ''} onClick={this.dosearch.bind(this,item)}>{item}</span>
                            })
                        }
                        {/* <span className="table_page_selected">1</span>
                        <span>2</span> */}
                        <span onClick={this.gotopage.bind(this,'next')}>{">"}</span>
                    </div>
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