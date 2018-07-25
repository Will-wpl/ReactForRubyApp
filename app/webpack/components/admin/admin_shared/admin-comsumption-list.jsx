import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import { formatPower } from '../../../javascripts/componentService/util';
export default class AdminComsumptionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseEntity: [],
            comsumption_list:[]
        }
    }

    componentDidMount() {

    } 

    componentWillReceiveProps(next) {
        if (next.comsumption_list) {
            this.setState({
                comsumption_list: next.comsumption_list,
                purchaseEntity:next.comsumption_list.length>0?next.comsumption_list[0].entities:[]
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
    getPurchase(id, index) {
        let name = "";
        if (this.state.purchaseEntity.length>0) {
            for (let i = 0; i < this.state.purchaseEntity.length; i++) {
                if (this.state.purchaseEntity[i].id == id) {
                    name = this.state.comsumption_list[i]?this.state.comsumption_list[i].company_name:'';
                    return name;
                    break;
                }
            }
        }
        return name;
    }
    render() {
        return (
            <div>
                {this.props.comsumption_list ?
                    this.props.comsumption_list.map((item, index) => {

                        return <div key={index}>
                            <div>New Accounts</div>
                            <div className="comsumption_list" >
                                <div className={this.props.visible ? 'comsumption_list_table u-grid visible' : 'comsumption_list_table u-grid'} id={"comsumption_list_table_" + index}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td className="col">Account No.</td>
                                                <td className="col">Existing Plan</td>
                                                <td className="col">Contract Expiry </td>
                                                <td className="col">Purchasing Entity</td>
                                                <td className="col">Intake Level</td>
                                                <td className="col">Contract Capacity</td>
                                                <td className="col">Permise Address</td>
                                                <td className="col">Consumption Details</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.details.map((it, i) => {
                                                return <tr key={i}>
                                                    <td>{it.account_number}</td>
                                                    <td>{it.existing_plan}</td>
                                                    <td>{it.contract_expiry !== "" ? moment(it.contract_expiry).format('YYYY-MM-DD HH:mm') : ""}</td>
                                                    <td>{it.company_buyer_entity_id ? this.getPurchase(it.company_buyer_entity_id, i) : ""}</td>
                                                    <td>{it.intake_level}</td>
                                                    <td>{it.contracted_capacity?it.contracted_capacity:'—'}</td>
                                                    <td>{it.blk_or_unit} {it.street} {it.unit_number} {it.postal_code} </td>
                                                    <td>
                                                        <div><span>Total Monthly:</span><span className="textDecoration" >{it.totals}</span><span>kWh/month</span></div>
                                                        <div><span>Peak:</span><span className="textDecoration">{it.peak_pct}</span><span>%</span><span  title="Click on '?' to see Admin's reference information on peak/offpeak ratio.">&nbsp;&nbsp;?</span></div>
                                                        <div><span>Off-Peak:</span><span className="textDecoration">{100 - it.peak_pct}</span><span>%(auto calculate)</span></div>
                                                        <div><span>Upload bill(s):</span><span><a href={it.user_attachment?it.user_attachment.file_path:"#"} target="_blank">{it.user_attachment?it.user_attachment.file_name:""}</a></span></div>
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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

