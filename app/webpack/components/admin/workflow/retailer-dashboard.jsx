import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';

export class Adminretailerdashboard extends Component {
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
                                <th></th>
                                <th>Sign Confidentiality Undertaking</th>
                                <th>Tender Documents</th>
                                <th>Deviations (if any)</th>
                                <th>Submit Form of Tender</th>
                                <th>Contact Details</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Keppel</td>
                                    <td >1</td>
                                    <td >1</td>
                                    <td >0</td>
                                    <td >1</td>
                                    <td >0</td>
                                    <td><button>Manage Contact</button><button>Contact Details</button></td>
                                </tr>
                            </tbody>
                    </table>
                </div>
            </div>
        )}
    }
