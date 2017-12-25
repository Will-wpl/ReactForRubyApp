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
    search_type(type,species,options){
            let field = '';
            switch(species){
                case 'input':
                field = <input type="test" id={type}  ref={type}/>
                break
                case 'select':
                field = <select ref={type} id={type}>
                         {options.map((item,index)=>{
                            return <option value={index}>{item.option}</option>
                          })}
                       </select>
                break
                case 'datePacker':
                field = <DatePicker selected={this.state.start_datetime} id={type}  onKeyDown={this.noPermitInput.bind(this)} ref={type} shouldCloseOnSelect={true} name={type} showTimeSelect dateFormat="DD-MM-YYYY HH:mm" timeFormat="HH:mm" timeIntervals={1}  className="time_ico"  onChange = {this.timeChange.bind(this)} minDate={moment()} title="Time must not be in the past."  />
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
            needData += '"'+item.type+'":"'+$('#'+item.type).val()+'",';
            // if(item.species === 'input'){
            //     needData += '"'+item.type+'":["'+$('#'+item.type).val()+'","like"],';
            // }else if(item.species === 'select'){
            //     needData += '"'+item.type+'":["'+$('#'+item.type).val()+'","="],';
            // }else{
            //     needData += '"'+item.type+'":["'+$('#'+item.type).val()+'","<="],';
            // }
        })
        needData = needData.substr(0,needData.length-1);
        needData = '{'+needData+',"page_size":10,"page_index":1}';
        console.log(JSON.parse(needData));
        if(this.props.doSearch){
            this.props.doSearch(JSON.parse(needData),this.list_url)
        }
    }
    render (){
        return (
            <div className="search_type">
                <dl className="lm--formItem string optional">
                    {
                        this.search_type_data.map((item,index)=>{
                            return <dd>
                                        <span className="lm--formItem-label string optional">{item.title}</span>
                                        <label className="lm--formItem-control">
                                            {item.options ? this.search_type(item.type,item.species,item.options) : this.search_type(item.type,item.species)}
                                        </label>
                                    </dd>
                        })
                    }
                    <dd>
                        <button className="lm--button lm--button--primary" onClick={this.goSearch.bind(this)}>Search</button>
                        <button className="lm--button lm--button--primary" >Reset</button>
                    </dd>
                </dl>
            </div>
        )}
}
