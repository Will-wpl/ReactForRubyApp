import React, {Component, PropTypes} from 'react'
export class DoFillConsumption extends Component {
    constructor(props){
        super(props);
    }
    render () {
        return (
            <div>
                {
                    this.props.site_list
                    ? this.props.site_list.map((item, index) => <div key={index}>
                             <h4 className="site_list_title"><span>{index+1}. My Account Information</span>{index != 0 ? (this.props.checked ? '' : <a onClick={this.props.remove.bind(this, index)}>Delete</a>) : ''}</h4>
                             <table className="retailer_fill u-mb3" cellPadding="0" cellSpacing="0">
                                 <tbody>
                                     <tr><td>Account Number</td><td><input type="text" disabled={this.props.checked} defaultValue={item.account_number}  id={"account_number"+(index+1)} required aria-required="true" name={"number"+(index+1)}/></td></tr>
                                     <tr><td>Intake Level</td>
                                        <td>
                                            <select id={"intake_level"+(index+1)} disabled={this.props.checked} name={"intake_level"+(index+1)} defaultValue={this.props.site_list[index].intake_level_selected}>
                                            {
                                                this.props.site_list[index].intake_level.map((it, i) => <option key={i} value={(it.split("(")[1]).split(")")[0]}>{it}</option>)
                                            }
                                            </select>
                                        </td></tr>
                                     <tr><td>Peak Volume (kWh/month)</td><td><input type="text" disabled={this.props.checked} required aria-required="true" name={"peak"+(index+1)} id={"peak"+(index+1)} defaultValue={item.peak ? parseInt(item.peak) : ''} pattern="^(0|[1-9][0-9]*)$" title="Must be positive integers, and the first cannot be 0."/></td></tr>
                                     <tr><td>Off-Peak Volume (kWh/month)</td><td><input type="text" disabled={this.props.checked} required aria-required="true" name={"off_peak"+(index+1)} defaultValue={item.off_peak ? parseInt(item.off_peak) : ''} id={"off_peak"+(index+1)} pattern="^(0|[1-9][0-9]*)$" title="Must be positive integers, and the first cannot be 0."/></td></tr>
                                 </tbody>
                             </table>
                          </div>)
                    : ''
                }
            </div>
        )
    }
}

DoFillConsumption.propTypes = {onAddClick: () => {}};