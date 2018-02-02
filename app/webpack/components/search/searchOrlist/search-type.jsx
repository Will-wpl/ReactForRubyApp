import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment'; 
import 'react-datepicker/dist/react-datepicker.css';
import {searchTypeData} from '../../../javascripts/componentService/common/searchConfig';
export class SearchType extends Component {
    constructor(props, context){
        super(props);
        this.state={
            start_datetime:""
        }
        this.search_type_data = [];
        if(this.props.type){
            this.search_type_data = searchTypeData[`${this.props.type}`].list_data;
            this.list_url = searchTypeData[`${this.props.type}`].list_url;
        }
    }
    componentDidMount(){
        this.goSearch();
    }
    componentWillMount(){

    }
    search_type(type,species,defaultval,options){
            let field = '';
            switch(species){
                case 'input':
                field = <input type="text" id={type}  ref={type}/>
                break
                case 'select':
                field = <select ref={type} id={type}>
                         {options.map((item,index)=>{
                            return <option key={index} value={item.value}>{item.option}</option>
                          })}
                       </select>
                break
                case 'datePacker':
                field = <DatePicker selected={this.state.start_datetime} id={type}  onKeyDown={this.noPermitInput.bind(this)} ref={type} shouldCloseOnSelect={true} name={type} dateFormat="DD-MM-YYYY"  className="time_ico"  onChange = {this.timeChange.bind(this)} title="Time must not be in the past."  />
                break
                case 'hidden':
                field = <input type="hidden" id={type} defaultValue={defaultval}  ref={type}/>
                break
            }
            return field
    }
    noPermitInput(event){
        event.preventDefault();
    }
    timeChange(data){
        this.setState({
            start_datetime:data
        })
    }
    goSearch(){
        let needData = ''
        this.search_type_data.map((item,index)=>{
            //needData += '"'+item.type+'":"'+$('#'+item.type).val()+'",';
            if(item.table){
                if(item.type == "start_datetime"){
                    needData += '"'+item.type+'":["'+this.state.start_datetime+'","'+item.operator+'","'+item.table+'"],';
                }else{
                    needData += '"'+item.type+'":["'+$('#'+item.type).val()+'","'+item.operator+'","'+item.table+'"],';
                }      
            }else{
                if(item.type == "start_datetime"){
                    needData += '"'+item.type+'":["'+this.state.start_datetime+'","'+item.operator+'"],';
                }else{
                    needData += '"'+item.type+'":["'+$('#'+item.type).val()+'","'+item.operator+'"],';
                }
                
            }
        })
        needData = needData.substr(0,needData.length-1);
        needData = '{'+needData+',"page_size":10,"page_index":1}';
        console.log(JSON.parse(needData))
        if(this.props.doSearch){
            this.props.doSearch(JSON.parse(needData),this.list_url)
        }
    }
    goReset(){
        $(".search_type input[type='text']").val("");
        this.setState({start_datetime:''})
        $(".search_type select").val($(".search_type select option:first").val());
        this.goSearch();
    }
    getAuctionId(type,obj){
        sessionStorage.auction_id=type;
    }
    render (){
        return (
            <div className="search_type">
                <dl className="lm--formItem string optional">
                    {
                        this.search_type_data.map((item,index)=>{
                            let sName = item.species === "hidden" ? 'hide':'show';
                            return <dd key={index} className={sName}>
                                        <span className="lm--formItem-label string optional">{item.title}</span>
                                        <label className="lm--formItem-control">
                                            {
                                                item.options ? this.search_type(item.type,item.species,item.defaultval,item.options) : this.search_type(item.type,item.species,item.defaultval)
                                                }
                                        </label>
                                    </dd>
                        })
                    }
                    <dd>
                        <button className="lm--button lm--button--primary search_btn" onClick={this.goSearch.bind(this)}>Search</button>
                        <button className="lm--button lm--button--primary reset_btn" onClick={this.goReset.bind(this)}>Reset</button>
                    </dd>
                    {this.props.type === "Unpublished Auction List" ?<dd className="fright"><a className="lm--button lm--button--primary " onClick={this.getAuctionId.bind(this,"new")} href="/admin/auctions/new">Create</a></dd> : ""}                   
                </dl>
            </div>
        )}
}
