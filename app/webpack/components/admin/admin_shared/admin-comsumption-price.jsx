import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
export default class AdminComsumptionPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        
    }
}

componentDidMount() {
    
}
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
               <div className="col-sm-12 u-mb1" id="price_title">{this.props.type === 'View Company Consumption Details' ? 'Company' : 'Individual'} Consumption Total Summary:</div>
               <div className="col-sm-12 u-mb1" id="price_number">Number of Buyers: {this.props.price.consumption_count} Number of Accounts: {this.props.price.account_count}</div>
               <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
               <thead>
               <tr>
                   <th></th>
                   <th>LT</th>
                   <th>HT (Small)</th>
                   <th>HT (Large)</th>
                   <th>EHT</th>
                   </tr>
               </thead>
               <tbody>
                   <tr>
                       <td>Peak (7am-7pm)</td>
                       <td >{this.props.price.lt_peak}</td>
                       <td >{this.props.price.hts_peak}</td>
                       <td >{this.props.price.htl_peak}</td>
                       <td >{this.props.price.eht_peak}</td>
                   </tr>
                   <tr>
                       <td>Off-Peak (7pm-7am)</td>
                       <td >{this.props.price.lt_off_peak}</td>
                       <td >{this.props.price.hts_off_peak}</td>
                       <td >{this.props.price.htl_off_peak}</td>
                       <td >{this.props.price.eht_off_peak}</td>
                   </tr>
               </tbody>
           </table>
            </div>
    )
  }
}
