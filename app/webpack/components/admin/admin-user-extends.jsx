import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {SearchType} from '../search/searchOrlist/search-type';
import {getSearchType} from '../../javascripts/componentService/util';
import {getRoleList} from '../../javascripts/componentService/common/service';
export default class UserExtends extends Component{
    constructor(props, context){
        super(props);
        this.state={
        };
        this.searchType = getSearchType();
    }
    doSearch(){
        //console.log("11111")
    }

    render(){
        return(
            <div className="u-grid u-mt3 mg0">
                <div className="col-sm-12 col-md-12">
                    <SearchType type={this.searchType} doSearch={this.doSearch.bind(this)}/>
                </div>
            </div>
        )
    }
}
function run() {
    const domNode = document.getElementById('user_extends');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(UserExtends),
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