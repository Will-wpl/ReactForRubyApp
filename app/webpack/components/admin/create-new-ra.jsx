import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment'; 
import 'react-datepicker/dist/react-datepicker.css';
import {createRa} from '../../javascripts/componentService/admin/service';
import {Modal} from '../shared/show-modal';

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
            left_name:this.props.left_name,
            btn_type:""
        };
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }
    starttimeChange(data){
        console.log(data.format());
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
    auctionCreate(type,e){
        this.setState({
            btn_type:type
        })
    }
    checkSuccess(event,obj){
        event.preventDefault();
        if(this.state.btn_type == "save"){
            createRa({
                auction: {
                    actual_begin_time: null,
                    actual_end_time: null,
                    contract_period_end_date: this.state.endDate.format().split("T")[0],
                    contract_period_start_date: this.state.startDate.format().split("T")[0],
                    duration: this.refs.duration.value,
                    name: this.refs.name.value,
                    publish_status: null,
                    published_gid: null,
                    reserve_price: this.refs.reserve_price.value,
                    start_datetime: this.state.ra_time.format(),
                    total_volume: null,text:""
                }
            }).then(res => {
                sessionStorage.setItem('raInfo', JSON.stringify(res));
                this.setState({text:"Create Auction Success"})
                this.refs.Modal.showModal();
                setTimeout(() => {
                    window.location.href="http://localhost:3000/admin/home"
                },3000);
            }, error => {
                console.log(error);
            })
        }
        if(this.state.btn_type == "delete"){
            alert("delete");
        }
        if(this.state.btn_type == "publish"){
            alert("publish");
        }
    }
    render () {
        let left_name ="";
        let btn_html ="";
        if(this.props.left_name == undefined){
            left_name = "Create New Reverse Auction";
                btn_html = <div className="createRa_btn">
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'save')}>Save</button>
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'delete')}>Delete</button>
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'publish')}>Publish</button>
                            </div>
        }else{
            left_name = this.props.left_name;
            btn_html = <div className="createRa_btn">
                            <button className="lm--button lm--button--primary">Edit</button>
                        </div>
        }
        return (
            <div className="createRaMain">
            <div>
                <h2>{left_name}</h2>
                <form action="/admin/auctions" ref="CreatRaForm" method="post" id="CreatRaForm" onSubmit={this.checkSuccess.bind(this)}>
                <dl className="vw-block vw-block-cols creatRa">
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Name of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="name" name="name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                            {/* <abbr className="error-block" ref="ra_name_error">{this.state.ra_name_error}</abbr> */}
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Time of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                        <DatePicker selected={this.state.ra_time} ref="start_datetime" name="start_datetime" showTimeSelect dateFormat="YYYY-MM-DD HH:mm" timeFormat="HH:mm" timeIntervals={10}  className="time_ico"  onChange = {this.timeChange} minDate={moment()} maxDate={moment().add(30, "days")} title="Time must not be in the past."  required aria-required="true"/>
                        <abbr ref="ra_duration_error" className="col">(SGT)</abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Auction Contract Period :</span>
                        <label className="col"><DatePicker required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="YYYY-MM-DD" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange = {this.starttimeChange}/>
                        {/* <abbr className="error-block"  ref="ra_time_start_error">{this.state.ra_time_start_error}</abbr> */}
                        </label>
                        <label className="col"><b>to</b></label>
                        <label className="col"><DatePicker required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="YYYY-MM-DD" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>
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
                            <input type="test" ref="duration" name="duration" maxLength="50" required aria-required="true" pattern="^[0-9]*[1-9][0-9]*$" title="Duration must be an integer."></input>
                            <abbr ref="ra_duration_error" className="col">minutes</abbr>
                        </label>
                        </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Price :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="reserve_price" name="reserve_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Reserve Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>
                            <abbr ref="ra_duration_error" className="col">kWh</abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Extension :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Manual</b></label></dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Average price :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Weighted Average</b></label></dd>
                </dl>
                {btn_html}
                </form>
                <Modal text={this.state.text} ref="Modal" />
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