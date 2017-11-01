import React, { Component } from 'react';

export default class RetailerRanking extends Component {
  constructor(props){
    super(props);
    this.state={
        list_data:[
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"},
            {"name":"Senoko","price":"$ 0.0739/kWh"}
        ],
    }
}
  render() {
    return (
      <div className="retailrank_main">
      <h4>Retailer Ranking</h4>
      <div className="retailrank_box">
      <table className="retailer_fill" cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Retailer</th>
            <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.list_Data.map((item,index)=>{
                return(
                  <tr key={index}><td>{index+1}</td><td>{item.name}</td><td>{item.price}</td></tr>
                )
              })
            }
          </tbody>
      </table>
      </div>
      </div>
    )
  }
}
