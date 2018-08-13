import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import { formatPower } from '../../../javascripts/componentService/util';
export default class AdminComsumptionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseEntity: [],
            comsumption_list: []
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(next) {
        if (next.comsumption_list) {
            this.setState({
                comsumption_list: next.comsumption_list,
                purchaseEntity: next.comsumption_list.length > 0 ? next.comsumption_list[0].entities : []
            })
        }
    }

    show_table(index, id) {
        if (this.props.onAddClick) {
            this.props.onAddClick();
        }
        if (this.props.onAddturly === 'jest') {
            return;
        }
        if (this.props.detail) {
            this.props.detail(index, id);
        }
    }
    getPurchase(id,index) {
        let name = "";
        if (this.state.comsumption_list[index].entities.length > 0) {
            for (let i = 0; i < this.state.comsumption_list[index].entities.length; i++) {
                if (this.state.comsumption_list[index].entities[i].id == id) {
                    name = this.state.comsumption_list[index].entities[i] ? this.state.comsumption_list[index].entities[i].company_name : '';
                    return name;
                    break;
                }
            }
        }
        return name;
    }
    render() {
        
        return (
            this.props.dataVersion ?
                <div>
                    {this.props.comsumption_list ?
                        this.props.comsumption_list.map((item, index) => {
                            return <div className="comsumption_list" key={index}>
                                <div className={this.props.visible ? "comsumption_list_top u-grid open" : "comsumption_list_top u-grid"} onClick={this.show_table.bind(this, index, item.id)}>
                                    <div className="col">{this.props.type === 'View Company Consumption Details' ? item.company_name : item.name}</div>
                                    <div className="col">Accounts: <p>{item.count}</p></div>
                                    <div className="col">LT(Peak): <p>{formatPower(parseInt(Number(item.lt_peak)), 0, '')}</p></div>
                                    <div className="col">LT(Off-Peak): <p>{formatPower(parseInt(Number(item.lt_off_peak)), 0, '')}</p></div>
                                    <div className="col">HTS(Peak): <p>{formatPower(parseInt(Number(item.hts_peak)), 0, '')}</p></div>
                                    <div className="col">HTS(Off-Peak): <p>{formatPower(parseInt(Number(item.hts_off_peak)), 0, '')}</p></div>
                                    <div className="col">HTL(Peak): <p>{formatPower(parseInt(Number(item.htl_peak)), 0, '')}</p></div>
                                    <div className="col">HTL(Off-Peak): <p>{formatPower(parseInt(Number(item.htl_off_peak)), 0, '')}</p></div>
                                    <div className="col">EHT(Peak): <p>{formatPower(parseInt(Number(item.eht_peak)), 0, '')}</p></div>
                                    <div className="col">EHT(Off-Peak): <p>{formatPower(parseInt(Number(item.eht_off_peak)), 0, '')}</p></div>
                                    <div className="col">Contract Period: <p>{item.contract_period}</p></div>
                                    <div className="col">Unit: kWh</div>
                                </div>
                                <div className={this.props.visible ? 'comsumption_list_table u-grid visible' : 'comsumption_list_table u-grid'} id={"comsumption_list_table_" + index}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Account No.</td>
                                                <td>Existing Plan</td>
                                                <td>Contract Expiry </td>
                                                <td>Purchasing Entity</td>
                                                <td>Intake Level</td>
                                                <td>Contracted Capacity</td>
                                                <td>Premise Address</td>
                                                <td>Consumption Details</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.details.map((it, i) => {
                                                return (<tr key={i}>
                                                    <td>{it.account_number}</td>
                                                    <td>{it.existing_plan}</td>
                                                    <td>{it.contract_expiry !== "" ? moment(it.contract_expiry).format('YYYY-MM-DD') : "—"}</td>
                                                    <td>{this.getPurchase(it.company_buyer_entity_id,index)}</td>
                                                    <td>{it.intake_level}</td>
                                                    <td>{it.contracted_capacity ? parseInt(it.contracted_capacity) : '—'}</td>
                                                    <td>{it.blk_or_unit} {it.street} {it.unit_number} {it.postal_code} </td>
                                                    <td className="left">
                                                        <div><span>Total Monthly:</span><span className="textDecoration" >{parseInt(it.totals)}</span><span> kWh/month</span></div>
                                                        <div><span>Peak:</span><span className="textDecoration">{parseFloat(it.peak_pct).toFixed(2)}</span><span> %</span><span style={{ fontWeight: "bold", fontSize: "14px" }} title="Click on '?' to see Admin's reference information on peak/offpeak ratio." >&nbsp;&nbsp;?</span></div>
                                                        <div><span>Off-Peak:</span><span className="textDecoration">{parseFloat(100 - it.peak_pct).toFixed(2)}</span><span> %</span></div>
                                                        {/* <div className={it.user_attachment ? "isDisplay" : "isHide"}><span>Upload bill(s):</span><span><a href={it.user_attachment ? it.user_attachment.file_path : "#"} target="_blank">{it.user_attachment ? it.user_attachment.file_name : ""}</a></span></div> */}
                                                        <div className={item.user_attachment ? "isDisplay" : "isHide"}><span>Upload bill(s):</span>
                                                        <span>
                                                            <ul>
                                                                {
                                                                    item.user_attachment ? item.user_attachment.map((item, i) => {
                                                                        return <li key={i}>
                                                                            <a href={item.file_path ? item.file_path : "#"} target="_blank">{item.file_name ? item.file_name : ""}</a>
                                                                        </li>
                                                                    }) :
                                                                        <li> </li>
                                                                }
                                                            </ul>
                                                        </span>
                                                    </div>
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }) : ''
                    }
                </div> :
                <div>
                    {this.props.comsumption_list ?
                        this.props.comsumption_list.map((item, index) => {
                            return <div className="comsumption_list" key={index}>
                                <div className={this.props.visible ? "comsumption_list_top u-grid open" : "comsumption_list_top u-grid"} onClick={this.show_table.bind(this, index, item.id)}>
                                    <div className="col">{this.props.type === 'View Company Consumption Details' ? item.company_name : item.name}</div>
                                    <div className="col">Accounts: <p>{item.count}</p></div>
                                    <div className="col">LT(Peak): <p>{formatPower(parseInt(Number(item.lt_peak)), 0, '')}</p></div>
                                    <div className="col">LT(Off-Peak): <p>{formatPower(parseInt(Number(item.lt_off_peak)), 0, '')}</p></div>
                                    <div className="col">HTS(Peak): <p>{formatPower(parseInt(Number(item.hts_peak)), 0, '')}</p></div>
                                    <div className="col">HTS(Off-Peak): <p>{formatPower(parseInt(Number(item.hts_off_peak)), 0, '')}</p></div>
                                    <div className="col">HTL(Peak): <p>{formatPower(parseInt(Number(item.htl_peak)), 0, '')}</p></div>
                                    <div className="col">HTL(Off-Peak): <p>{formatPower(parseInt(Number(item.htl_off_peak)), 0, '')}</p></div>
                                    <div className="col">EHT(Peak): <p>{formatPower(parseInt(Number(item.eht_peak)), 0, '')}</p></div>
                                    <div className="col">EHT(Off-Peak): <p>{formatPower(parseInt(Number(item.eht_off_peak)), 0, '')}</p></div>
                                    <div className="col">Unit: kWh</div>
                                </div>
                                <div className={this.props.visible ? 'comsumption_list_table u-grid visible' : 'comsumption_list_table u-grid'} id={"comsumption_list_table_" + index}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Account Number</th>
                                                <th>Intake Level</th>
                                                <th>Peak Volume (kWh/month)</th>
                                                <th>Off-Peak Volume (kWh/month)</th>
                                                <th>Contracted Capacity (kW)</th>
                                                <th>Premise Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.details.map((it, i) => {
                                                return <tr key={i}>
                                                    <td>{it.account_number}</td>
                                                    <td>{it.intake_level}</td>
                                                    <td>{formatPower(parseInt(Number(it.peak)), 0, '')}</td>
                                                    <td>{formatPower(parseInt(Number(it.off_peak)), 0, '')}</td>
                                                    <td>{it.contracted_capacity ? formatPower(parseInt(Number(it.contracted_capacity)), 0, '') : '--'}</td>
                                                    <td>{it.premise_address ? it.premise_address : '--'}</td>
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
    onAddClick: () => { },
};

