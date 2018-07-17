import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import { formatPower } from '../../../javascripts/componentService/util';
export default class AdminComsumptionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseEntity: []
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(next) {
        if (next.comsumption_list) {
            console.log(next.comsumption_list)
            this.setState({
                purchaseEntity: next.comsumption_list
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
        if (this.state.purchaseEntity[index].entities) {
            for (let i = 0; i < this.state.purchaseEntity[index].entities.length; i++) {
                if (this.state.purchaseEntity[index].entities[i].id == id) {
                    name = this.props.comsumption_list[index].entities[i].company_name;
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
                                {/* <div className={this.props.visible ? "comsumption_list_top u-grid open" : "comsumption_list_top u-grid"} onClick={this.show_table.bind(this, index, item.id)}>
                                    <div className="col">Account No.</div>
                                    <div className="col">Existing Plan</div>
                                    <div className="col">Contract Expiry </div>
                                    <div className="col">Purchasing Entity</div>
                                    <div className="col">Intake Level</div>
                                    <div className="col">Contract Capacity</div>
                                    <div className="col">Permise Address</div>
                                    <div className="col">Consumption Details</div>
                                </div> */}
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
                                                    <td>{item.existing_plan}</td>
                                                    <td>{item.contract_expiry !== "" ? moment(item.contract_expiry).format('YYYY-MM-DD HH:mm') : ""}</td>
                                                    <td>{item.company_buyer_entity_id ? this.getPurchase(item.company_buyer_entity_id, i) : ""}</td>
                                                    <td>{item.intake_level}</td>
                                                    <td>{item.contracted_capacity}</td>
                                                    <td>{item.blk_or_unit} {item.street} {item.unit_number} {item.postal_code} </td>
                                                    <td><span className="textBold">Total Monthly:<div>{item.totals}</div>kWh/month,Peak:<div>{item.peak_pct}</div></span>,Off-Peak:<span className="textNormal"><div>{item.peak_pct ? (100 - item.peak_pct) : 100}</div></span>(auto calculate).<span className="textBold">Upload bill(s) compulsory for Category 3(new Accounts)</span>.
                                                    <div title="Click on '?' to see Admin's reference information on peak/offpeak ratio.">?</div></td>
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

