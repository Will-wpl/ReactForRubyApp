import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export class RetailsOnlineStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            list_data:[
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
                {"name":"Keppel","status":"online"},
            ],
        }
    }
    render () {
        return (
            <div className="u-grid bidderStatus">
                <div className="col-sm-12 col-md-12">
                <h4>Bidders Status of Acceptance</h4>
                <ul className="bidders_list">
                    {
                        this.state.list_data.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-md-9">{item.name}</span>
                                <span className="col-md-3"><abbr className={item.status}></abbr></span>
                            </li>
                            )
                        })
                    }
                </ul>               
                </div>
            </div>
        )
    }
}