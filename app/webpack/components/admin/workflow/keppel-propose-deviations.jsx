import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';

export class Keppelproposedeviations extends Component {
    constructor(props, context){
        super(props);
        this.state={
            
        }
        this.auction = {};
        this.holdStatus = false;
    }
    componentDidMount(){
        
    }
    
    componentWillMount(){
        
    }
    render (){
        return (
            <div className="col-sm-12">
                <h2 className="u-mt3 u-mb3">{this.props.title}</h2>
                <div className="col-sm-12 col-md-12 propose_deviations">
                <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Clause</th>
                            <th>Proposs Deviation</th>
                            <th>Retailer Response</th>
                            <th>SP Response</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td >5.1</td>
                                <td >xxxxxxxxxxx</td>
                                <td >xxxxxxxxxxxxxxxxxxxx</td>
                                <td >Accepted : this item should change to 10%</td>
                                <td><button>Reject</button><button>Accept</button><button>History</button></td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td >5.1</td>
                                <td >xxxxxxxxxxx</td>
                                <td >xxxxxxxxxxxxxxxxxxxx</td>
                                <td ><input type="text"/></td>
                                <td><button>Reject</button><button>Accept</button><button>History</button></td>
                            </tr>
                        </tbody>
                </table>
                <div className="workflow_btn u-mt3">    
                    <button className="lm--button lm--button--primary">Send Response</button>
                </div>
            </div>
            </div>
        )}
    }
