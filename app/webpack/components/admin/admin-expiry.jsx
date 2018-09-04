import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {getExpiryList} from '../../javascripts/componentService/admin/service';
export default class AdminExpiry extends Component {
  constructor(props){
    super(props);
    this.state={
        start_datetime:moment(),expiry_list:[],
        buyer_ids:'',
        disabled:false
    }
 }

 componentDidMount() {

 }
    timeChange(data) {
        this.setState({
            start_datetime: data
        })
    }
    goSearch(){
        getExpiryList(moment(this.state.start_datetime.toDate()).format()).then(res=>{
            this.setState({
                expiry_list:res.accounts?res.accounts:[],
                buyer_ids:res.buyer_ids
            })
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
                    {this.state.expiry_list.map(()=>{
                        return <tr>
                            <td>Account<br/>No.</td>
                            <td>During<br/>Entity</td>
                            <td>RA ID</td>
                            <td>Contract<br/>Expiry</td>
                            <td>Intake<br/>Level</td>
                            <td>Contract<br/>Capacity</td>
                            <td>Peak<br/>(kWh/mth)</td>
                            <td>Off-Peak<br/>(kWh/mth)</td>
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