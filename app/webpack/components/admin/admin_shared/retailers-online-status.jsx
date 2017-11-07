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
                <ul className="bidders_list">
                    {
                        this.props.list_data.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-sm-9 col-md-9">{item.company_name}</span>
                                <span className="col-sm-3 col-md-3"><abbr className={item.login_status}></abbr></span>
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