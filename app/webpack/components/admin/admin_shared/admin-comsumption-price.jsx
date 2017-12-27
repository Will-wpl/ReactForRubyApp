import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
export default class AdminComsumptionPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        
    }
    //this.winnerdata=[];
    //this.winnerauction={};
    this.winner = {
        data:{},
        auction:{}
    }
    //this.auction={}
}

componentDidMount() {
    
}
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
               <div className="col-sm-12 u-mb1">{this.props.price.title} Consumpation Total Summary:</div>
               <div className="col-sm-12 u-mb1">Number of Companies: {this.props.price.number} Number of Accounts: {this.props.price.accounts}</div>
               <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
               <thead>
               <tr>
                   <th></th>
                   <th>LT</th>
                   <th>HT (Small)</th>
                   <th>HT (Large)</th>
                   </tr>
               </thead>
               <tbody>
                   <tr>
                       <td>Peak (7am-7pm)</td>
                       <td >147878</td>
                       <td >147878</td>
                       <td >147878</td>
                   </tr>
                   <tr>
                       <td>Off-Peak (7pm-7am)</td>
                       <td >147878</td>
                       <td >147878</td>
                       <td >147878</td>
                   </tr>
               </tbody>
           </table>
            </div>
    )
  }
}
