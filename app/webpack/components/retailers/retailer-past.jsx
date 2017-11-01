import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export class RetailerPast extends Component {
    constructor(props){
        super(props);
        this.state={
            list_data:[
                {"name":"SP Reverse Auction","time":"1 DEC 2017","result":"Awarded"},
                {"name":"SP Reverse Auction","time":"2 DEC 2017","result":"Awarded"},
                {"name":"SP Reverse Auction","time":"3 DEC 2017","result":"Not Awarded"},
                {"name":"SP Reverse Auction","time":"4 DEC 2017","result":"Not Awarded"}
            ]
        }
    }
    render () {
        return (
            <div className="u-grid">
            <div className="col-sm-12 col-md-6 push-md-3">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr><th>Name</th><th>Date</th><th>Result</th></tr>
                    </thead>
                    <tbody>
                        {
                            this.state.list_data.map((item,index)=>{
                                return <tr><td>{item.name}</td><td>{item.time}</td><td>{item.result}</td></tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            </div>
        )
    }
}