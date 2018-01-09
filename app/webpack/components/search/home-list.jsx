import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {getSearchType} from '../../javascripts/componentService/util';
import {getRoleList} from '../../javascripts/componentService/common/service';
import moment from 'moment';
import {SearchType} from './searchOrlist/search-type'
import {SearchList} from './searchOrlist/search-list'
export class ListHome extends Component {
    constructor(props, context){
        super(props);
        this.searchType = getSearchType();
        this.state={
            total:[],
            list_data:{},list_url:'',table_data:null
        }
    }
    doSearch(data,url){
        getRoleList(data,url).then(res => {
            let total = [],total_size=1;
            console.log(res);
            if(res.bodies.total%data.page_size != 0){
                if(res.bodies.total%data.page_size > 0){
                    total_size = parseInt(res.bodies.total/data.page_size)+1;
                }else{
                    total_size = 1;
                }
            }else{
                if(res.bodies.total/data.page_size > 1){
                    total_size = res.bodies.total/data.page_size;
                }else{
                    total_size = 1;
                }
            }
            for(let i=0; i<total_size; i++){
                total.push((i+1));
            }
            this.setState({
                table_data:res,
                total:total,
                list_data:data,
                list_url:url,
            })
        }, error => {
            console.log(error);
            this.setState({
                table_data:null
            })
        })
    }
    render (){
        return (
            <div className="u-grid u-mt3 mg0">
                <div className="col-sm-12 col-md-12">
                    <SearchType type={this.searchType} doSearch={this.doSearch.bind(this)}/>
                </div>
                <div className="col-sm-12 col-md-12">
                    <SearchList type={this.searchType} table_data={this.state.table_data} page_total={this.state.total} list_data={this.state.list_data} list_url={this.state.list_url} doSearch={this.doSearch.bind(this)}/>
                </div>
            </div>
        )}
    }

    function run() {
        const domNode = document.getElementById('users_search_list');
        if(domNode !== null){
            ReactDOM.render(
                React.createElement(ListHome),
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