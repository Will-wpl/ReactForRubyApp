import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
export default class AdminComsumptionList extends Component {
  constructor(props){
    super(props);
    this.state={
        
    }
}

componentDidMount() {
    
}
show_table(index,id){
    if(this.props.onAddClick){
        this.props.onAddClick();
    }
    if(this.props.onAddturly === 'jest'){
        return;
    }
    if(this.props.detail){
        this.props.detail(index,id);
    }
}
render() {
    //console.log(this.winner.data);
    return (
        <div>
            {this.props.comsumption_list ?
                this.props.comsumption_list.map((item,index)=>{
                    return  <div className="comsumption_list" key={index}>
                                <div className="comsumption_list_top u-grid" onClick={this.show_table.bind(this,index,item.id)}>
                                    <div className="col">{this.props.type === 'View Company Consumption Details' ? item.company_name : item.name}</div>
                                    <div className="col">Accounts: {item.count}</div>
                                    <div className="col">LT(Peak): {item.lt_peak}</div>
                                    <div className="col">LT(Off-Peak): {item.lt_off_peak}</div>
                                    <div className="col">HTS(Peak): {item.hts_peak}</div>
                                    <div className="col">HTS(Off-Peak): {item.hts_off_peak}</div> 
                                    <div className="col">HTL(Peak): {item.htl_peak}</div>
                                    <div className="col">HTL(Off-Peak): {item.htl_off_peak}</div>
                                    <div className="col">EHT(Peak): {item.eht_peak}</div>
                                    <div className="col">EHT(Off-Peak): {item.eht_off_peak}</div>
                                    <div className="col">Unit: kWh</div>
                                </div>
                                <div className={this.props.visible?'comsumption_list_table u-grid visible':'comsumption_list_table u-grid'} id={"comsumption_list_table_"+index}> 
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Account Number</th>
                                                    <th>Intake Level</th>
                                                    <th>Peak Volume (kWh/month)</th>
                                                    <th>Off-Peak Volume (kWh/month)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.details.map((it,i)=>{
                                                    return <tr key={i}>
                                                                <td>{it.account_number}</td>
                                                                <td>{it.intake_level}</td>
                                                                <td>{it.peak}</td>
                                                                <td>{it.off_peak}</td>
                                                            </tr>
                                                })}
                                            </tbody>
                                        </table> 
                                </div>
                            </div>    
                }) : ''
            }
        </div>
    )
  }
}

AdminComsumptionList.propTypes = {
    onAddClick: ()=>{},
  };

