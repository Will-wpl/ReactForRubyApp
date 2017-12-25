import React, { Component, PropTypes } from 'react'
//import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
export class SearchList extends Component {
    constructor(props, context){
        super(props);
        this.state={
            
        }
    }
    componentDidMount(){
        
    }
    componentWillMount(){
        
    }

    render (){
        return (
            <div className="lm--table-container">
                <table className="lm--table lm--table--responsive">
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>
                        <tr></tr>
                    </tbody>
                </table>
                <div className="table_page">
                    <span>{"<"}</span>
                    <span className="table_page_selected">1</span>
                    <span>2</span>
                    <span>{">"}</span>
                </div>
            </div>
        )}
}
