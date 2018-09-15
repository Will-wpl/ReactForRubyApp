import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { getExpiryList, goCreateNewRa } from '../../javascripts/componentService/admin/service';
export default class AdminExpiry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_datetime: moment(), expiry_list: [],
            buyer_ids: [],
            disabled: false
        }
    }

    componentDidMount() {
        this.goSearch();
    }
    timeChange(data) {
        this.setState({
            start_datetime: data
        })
    }
    goSearch(sort) {
        let obj = {
            time: moment(this.state.start_datetime).format(),
            sort: sort instanceof Array ? sort : null
        }
        getExpiryList(obj).then(res => {
            $(".u-contain").css("padding","0px");
            $(".lm--header").css("margin-bottom","0px");
            $(".createRaMain a,.lm--footer div").css("margin-left","24px");
            this.setState({
                expiry_list: res.accounts ? res.accounts : [],
                buyer_ids: res.buyer_ids ? res.buyer_ids : []
            })
        })
    }
    goCreate() {
        goCreateNewRa({ date: moment(this.state.start_datetime).format(), buyer_ids: JSON.stringify(this.state.buyer_ids) }).then(res => {
            sessionStorage.auction_id = res.auction.id;
            setTimeout(() => { window.location.href = "/admin/auctions/new" }, 100);
        })
    }
    dosort(field_name, sort) {
        $(".lm--table th dfn").removeClass("selected");
        $(".search_list_" + sort + "." + field_name + "").addClass("selected");
        this.goSearch([field_name, sort]);
    }
    render() {
        return (
            <div className="admin_expiry" id={"users_search_list"}>
                <div className="col-sm-12 col-md-12">
                    <div className="search_type padLR24 bgwhite">
                        <dl className="lm--formItem string optional">
                            <dd>
                                <span className="lm--formItem-label string optional">Account(s) Eligible for New Contract Start Date :</span>
                                <label className="lm--formItem-control">
                                    <DatePicker selected={this.state.start_datetime} disabled={this.state.disabled} ref="start_datetime" shouldCloseOnSelect={true} name="start_datetime" dateFormat="DD-MM-YYYY" className="time_ico" onChange={this.timeChange.bind(this)} minDate={moment()} title="Time must not be in the past." required aria-required="true" />
                                </label>
                            </dd>
                            <dd>
                                <button onClick={this.goSearch.bind(this)} className="lm--button lm--button--primary search_btn">Search</button>
                                <button onClick={this.goCreate.bind(this)} className="lm--button lm--button--primary create_btn">Create</button>
                            </dd>
                        </dl>
                    </div>
                    <div className={"padLR24"}>
                    <div className={"lm--table-container"}>
                        <table className="lm--table lm--table--responsive" cellPadding="0" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Account<br />No.
                            <div><dfn className={"search_list_asc account_number"} onClick={this.dosort.bind(this, 'account_number', 'asc')}></dfn>
                                            <dfn className={"search_list_desc account_number"} onClick={this.dosort.bind(this, 'account_number', 'desc')}></dfn></div>
                                    </th>
                                    <th>Puchasing<br />Entity
                            <div><dfn className={"search_list_asc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'asc')}></dfn>
                                            <dfn className={"search_list_desc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'desc')}></dfn></div>
                                    </th>
                                    <th>RA ID
                            <div><dfn className={"search_list_asc ra_id"} onClick={this.dosort.bind(this, 'ra_id', 'asc')}></dfn>
                                            <dfn className={"search_list_desc ra_id"} onClick={this.dosort.bind(this, 'ra_id', 'desc')}></dfn></div>
                                    </th>
                                    <th>Contract<br />Expiry
                            <div><dfn className={"search_list_asc contract_period_end_date"} onClick={this.dosort.bind(this, 'contract_period_end_date', 'asc')}></dfn>
                                            <dfn className={"search_list_desc contract_period_end_date"} onClick={this.dosort.bind(this, 'contract_period_end_date', 'desc')}></dfn></div>
                                    </th>
                                    <th>Intake<br />Level
                            <div><dfn className={"search_list_asc intake_level"} onClick={this.dosort.bind(this, 'intake_level', 'asc')}></dfn>
                                            <dfn className={"search_list_desc intake_level"} onClick={this.dosort.bind(this, 'intake_level', 'desc')}></dfn></div>
                                    </th>
                                    <th>Contract<br />Capacity
                            <div><dfn className={"search_list_asc contracted_capacity"} onClick={this.dosort.bind(this, 'contracted_capacity', 'asc')}></dfn>
                                            <dfn className={"search_list_desc contracted_capacity"} onClick={this.dosort.bind(this, 'contracted_capacity', 'desc')}></dfn></div>
                                    </th>
                                    <th>Peak<br />(kWh/mth)
                            <div><dfn className={"search_list_asc peak"} onClick={this.dosort.bind(this, 'peak', 'asc')}></dfn>
                                            <dfn className={"search_list_desc peak"} onClick={this.dosort.bind(this, 'peak', 'desc')}></dfn></div>
                                    </th>
                                    <th>Off-Peak<br />(kWh/mth)
                            <div><dfn className={"search_list_asc off_peak"} onClick={this.dosort.bind(this, 'off_peak', 'asc')}></dfn>
                                            <dfn className={"search_list_desc off_peak"} onClick={this.dosort.bind(this, 'off_peak', 'desc')}></dfn></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.expiry_list.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item.account_number}</td>
                                        <td>{item.entity_name}</td>
                                        <td>{item.ra_id}</td>
                                        <td>{moment(item.contract_period_end_date).format('DD-MM-YYYY')}</td>
                                        <td>{item.intake_level}</td>
                                        <td>{(item.contracted_capacity!==null && item.contracted_capacity!=="")?parseInt(item.contracted_capacity):""}</td>
                                        <td>{(item.peak!==null && item.peak!=="")?parseInt(item.peak):""}</td>
                                        <td>{(item.off_peak!==null && item.off_peak!=="")?parseInt(item.off_peak):""}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
function run() {
    const domNode = document.getElementById('ContractExpiryMgmt');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminExpiry),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}