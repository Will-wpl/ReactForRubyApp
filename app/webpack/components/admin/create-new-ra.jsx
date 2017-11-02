import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment'; 
import 'react-datepicker/dist/react-datepicker.css';

export class CreateNewRA extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            ra_name:"",ra_name_error:"",
            ra_date:"",ra_data_error:"",
            ra_time:"",ra_time_error:"",
            startDate:"",ra_time_start_error:"",
            endDate:"",ra_time_end_error:"",
            ra_duration:"",ra_duration_error:"",
            ra_price:"",ra_price_error:"",
        };
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }
    starttimeChange(data){
        this.setState({
            startDate:data
        })
    }
    endtimeChange(data){
        this.setState({
            endDate:data
        })
    }
    dateChange(data){
        this.setState({
            ra_date:data
        })
    }
    timeChange(data){
        this.setState({
            ra_time:data
        })
    }
    render () {
        return (
            <div className="createRaMain">
            <div>
                <h2>Creat New Reverse Auction</h2>
                <form action="" ref="CreatRaForm" method="post">
                <dl className="vw-block vw-block-cols creatRa">
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Name of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="ra_name" name="ra_name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                            {/* <abbr className="error-block" ref="ra_name_error">{this.state.ra_name_error}</abbr> */}
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Date of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                        <DatePicker selected={this.state.ra_date} className="date_ico"  onChange = {this.dateChange} minDate={moment()} maxDate={moment().add(30, "days")} title="Date must not be in the past." required aria-required="true"/>
                            {/* <abbr className="error-block" ref="ra_data_error">{this.state.ra_data_error}</abbr> */}
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Time of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                        <DatePicker selected={this.state.ra_time} dateFormat="DD-MMM YYYY" className="time_ico"  onChange = {this.timeChange} minDate={moment()} maxDate={moment().add(30, "days")} title="Time must not be in the past."  required aria-required="true"/>
                        <abbr ref="ra_duration_error" className="col">(SGT)</abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Auction Contract Period :</span>
                        <label className="col"><DatePicker required aria-required="true" className="date_ico" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange = {this.starttimeChange}/>
                        {/* <abbr className="error-block"  ref="ra_time_start_error">{this.state.ra_time_start_error}</abbr> */}
                        </label>
                        <label className="col"><b>to</b></label>
                        <label className="col"><DatePicker required aria-required="true" className="date_ico" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>
                        {/* <abbr className="error-block" ref="ra_time_end_error">{this.state.ra_time_end_error}</abbr> */}
                        </label>
                    </dd>
                    <dd></dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Auction Paramters</span>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Duration :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="ra_duration" name="ra_duration" maxLength="50" required aria-required="true" pattern="^[0-9]*[1-9][0-9]*$" title="Duration must be an integer."></input>
                            <abbr ref="ra_duration_error" className="col">minutes</abbr>
                        </label>
                        </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Price :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="ra_price" name="ra_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Reserve Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>
                            <abbr ref="ra_duration_error" className="col">kWh</abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Extension :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Manual</b></label></dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Average price :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Weighted Average</b></label></dd>
                </dl>
                <div className="createRa_btn">
                    <button className="lm--button lm--button--primary">Save</button>
                    <button className="lm--button lm--button--primary">Delete</button>
                    <button className="lm--button lm--button--primary">Publish</button>
                </div>
                </form>
            </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('createNewRA');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(CreateNewRA),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}