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
    }
    componentDidMount(){
       
    }
    componentWillMount(){
        
    }
    doSearch(data,url){
        getRoleList(data,url).then(res => {
            console.log(res);
        }, error => {
            console.log(error);
        })
    }
    render (){
        return (
            <div className="u-grid u-mt3 mg0">
                <div className="col-sm-12 col-md-12">
                    <SearchType type={this.searchType} doSearch={this.doSearch.bind(this)}/>
                </div>
                <div className="col-sm-12 col-md-12">
                    <SearchList/>
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