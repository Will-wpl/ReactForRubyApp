import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {getExpiryList,goCreateNewRa} from '../../javascripts/componentService/admin/service';
export default class AdminExpiry extends Component {
  constructor(props){
    super(props);
    this.state={
        start_datetime:moment(),expiry_list:[],
        buyer_ids:[],
        disabled:false
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
    goSearch(){
        getExpiryList(moment(this.state.start_datetime).format()).then(res=>{
            this.setState({
                expiry_list:res.accounts?res.accounts:[],
                buyer_ids:res.buyer_ids?res.buyer_ids:[]
            })
        })
    }
    goCreate(){
        goCreateNewRa({date:moment(this.state.start_datetime).format(),buyer_ids:JSON.stringify(this.state.buyer_ids)}).then(res=>{
            sessionStorage.auction_id = res.auction.id;
            setTimeout(()=>{window.location.href="/admin/auctions/new"},100);
        })
    }
render() {
    return (
        <div className="u-grid admin_expiry" id={"users_search_list"}>
            <div className="col-sm-12 col-md-12">
                <div className="search_type">
                    <dl className="lm--formItem string optional">
                        <dd>
                            <span className="lm--formItem-label string optional">Account Eligille for New Contract Start Date :</span>
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
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                    <tr>
                        <th>Account<br/>No.</th>
                        <th>During<br/>Entity</th>
                        <th>RA ID</th>
                        <th>Contract<br/>Expiry</th>
                        <th>Intake<br/>Level</th>
                        <th>Contract<br/>Capacity</th>
                        <th>Peak<br/>(kWh/mth)</th>
                        <th>Off-Peak<br/>(kWh/mth)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.expiry_list.map((item,index)=>{
                        return <tr key={index}>
                            <td>{item.account_number}</td>
                            <td>{item.entity_name}</td>
                            <td>{item.ra_id}</td>
                            <td>{item.contract_period_end_date}</td>
                            <td>{item.intake_level}</td>
                            <td>{item.contracted_capacity}</td>
                            <td>{item.peak}</td>
                            <td>{item.off_peak}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
  }
}
function run() {
    const domNode = document.getElementById('ContractExpiryMgmt');
    if(domNode !== null){
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