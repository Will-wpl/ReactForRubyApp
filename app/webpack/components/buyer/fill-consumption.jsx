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
                             <h4 className="site_list_title"><span>{index+1}.My Site Information</span>{index != 0 ? <a onClick={this.props.remove.bind(this, index)}>Delete</a> : ''}</h4>
                             <table className="retailer_fill u-mb3" cellPadding="0" cellSpacing="0">
                                 <tbody>
                                     <tr><td>Account Number</td><td><input type="text" defaultValue={`${item.account_number}${index+1}`} id={"account_number"+(index+1)} required aria-required="true" name={"number"+(index+1)}/></td></tr>
                                     <tr><td>Intake Level</td>
                                        <td>
                                            <select id={"intake_level"+(index+1)} name={"intake_level"+(index+1)} defaultValue={this.props.site_list[index].intake_level_selected}>
                                            {
                                                this.props.site_list[index].intake_level.map((it, i) => <option key={i} value={it}>{it}</option>)
                                            }
                                            </select>
                                        </td></tr>
                                     <tr><td>Peak Volume (kWh/month)</td><td><input type="text" required aria-required="true" name={"peak"+(index+1)} id={"peak"+(index+1)} defaultValue={item.peak}/></td></tr>
                                     <tr><td>Off-peak Volume (kWh/month)</td><td><input type="text" required aria-required="true" name={"off_peak"+(index+1)} defaultValue={item.off_peak} id={"off_peak"+(index+1)}/></td></tr>
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