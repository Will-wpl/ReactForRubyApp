import React, { Component, PropTypes } from 'react'
export class DoFillConsumption extends Component {
    constructor(props){
        super(props);
    }
    render () {
        return (
            <div>
                {
                    this.props.site_list ?
                    this.props.site_list.map((item,index)=>{
                    return <div>
                             <h4 className="site_list_title"><span>{index+1}.My Site Information</span>{index != 0 ? <a onClick={this.props.remove.bind(this,index)}>Delete</a> : ''}</h4>
                             <table className="retailer_fill u-mb3" cellPadding="0" cellSpacing="0">
                                 <tbody>
                                     <tr><td>Accound Number</td><td><input type="text" value={`${item.number}${index+1}`} id={"number"+(index+1)} name={"number"+(index+1)}/></td></tr>
                                     <tr><td>Intake Level</td>
                                        <td>
                                            <select id={"level"+(index+1)} name={"level"+(index+1)}>
                                            {
                                                this.props.site_list[index].level.map((it,i)=>{
                                                    return <option value={i+1}>{it}</option>
                                                })
                                            }
                                            </select>
                                        </td></tr>
                                     <tr><td>Peak Volume (kWh/mouth)</td><td><input type="text" name={"peak"+(index+1)} id={"peak"+(index+1)}/></td></tr>
                                     <tr><td>Off-peak Volume (kWh/mouth)</td><td><input type="text" name={"off_peak"+(index+1)} id={"off_peak"+(index+1)}/></td></tr>
                                 </tbody>
                             </table>
                          </div>
                    }) 
                    : ''
                }
            </div>
        )
    }
}

DoFillConsumption.propTypes = {
  onAddClick: ()=>{}
};