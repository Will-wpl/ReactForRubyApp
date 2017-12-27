import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
export default class AdminComsumptionList extends Component {
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
show_table(index){
    $("#comsumption_list_table_"+index).slideToggle(300);
}
render() {
    //console.log(this.winner.data);
    return (
        <div>
            {
                this.props.comsumption_list.map((item,index)=>{
                    return  <div className="comsumption_list" key={index}>
                                <div className="comsumption_list_top u-grid" onClick={this.show_table.bind(this,index)}>
                                    <div className="col">{item.name}</div>
                                    <div className="col">Accounts: {item.accounts}</div>
                                    <div className="col">LT(Peak): {item.lt_peak}</div>
                                    <div className="col">LT(Off-Peak): {item.lt_off_peak}</div>
                                    <div className="col">HTS(Peak): {item.hts_peak}</div>
                                    <div className="col">HTS(Off-Peak): {item.hts_off_peak}</div> 
                                    <div className="col">HTL(Peak): {item.htl_peak}</div>
                                    <div className="col">HTL(Off-Peak): {item.htl_off_peak}</div>
                                    <div className="col">Unit: {item.unit}</div>
                                </div>
                                <div className="comsumption_list_table u-grid" id={"comsumption_list_table_"+index}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Account Number</th>
                                                <th>Intake Level</th>
                                                <th>Peak Volume (kWh/mouth)</th>
                                                <th>Off-Peak Volume (kWh/mouth)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.table.map((it,i)=>{
                                                return <tr key={i}>
                                                            <td>{it.account_number}</td>
                                                            <td>{it.intake_level}</td>
                                                            <td>{it.peak_volume}</td>
                                                            <td>{it.off_peak_volume}</td>
                                                        </tr>
                                            })}
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>    
                }) 
            }
        </div>
    )
  }
}

