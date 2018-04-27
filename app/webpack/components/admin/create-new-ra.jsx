import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment'; 
import 'react-datepicker/dist/react-datepicker.css';
import {createRa, raPublish} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Modal} from '../shared/show-modal';

export class CreateNewRA extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            name:"",
            start_datetime:"",
            startDate:"",
            endDate:"",
            duration:"",
            reserve_price:"",starting_price:"",
            left_name:this.props.left_name,
            btn_type:"",text:"",id:"0",
            edit_btn:"lm--button lm--button--primary show",
            edit_change:"lm--button lm--button--primary hide",
            disabled:false,live_modal:"",live_modal_do:"",holdOrend:"",
        }
        this.auction = {};
        this.auction_data = null;
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }
    componentDidMount() {
        if(this.props.left_name){//eidt
            if(this.props.disabled){
                this.setState({
                    disabled:this.props.disabled
                })
            }else{
                this.setState({
                    disabled:true
                })
            }
            this.setState({
                editdisabled:this.props.editdisabled,
                live_modal:"live_hide"
            })
            this.doGetData();
        }else{//create
            this.doGetData("create")
        }
    }
    doGetData(type){
        if(sessionStorage.auction_id == "new"){
            return;
        }
        getAuction('admin',sessionStorage.auction_id).then(res => {
            this.auction = res;
            if(type == "create"){
                if(this.auction.publish_status == 1){
                    this.setState({
                        disabled:true
                    })
                }else{
                    this.setState({
                        disabled:false
                    })
                }          
            }else{
                if(moment(this.auction.actual_begin_time) < moment()){
                    this.setState({
                        disabled:true
                    })
                }
            }     
            if(res.name == null){
                    this.setState({id:res.id})
                }else{
                    this.setState({
                        id:res.id,
                        name:res.name == null ? '' : res.name,
                        start_datetime: res.start_datetime == null ? '' : moment(res.start_datetime),
                        startDate: res.contract_period_start_date == null ? '' :  moment(res.contract_period_start_date),
                        endDate:res.contract_period_end_date == null ? '' : moment(res.contract_period_end_date),
                        duration:res.duration== null ? '' : res.duration,
                        reserve_price:res.reserve_price== null ? '' : this.padZero(res.reserve_price,'4'),
                        starting_price:res.starting_price== null ? '' : this.padZero(res.starting_price,'4')
                    });
                }
                $("#time_extension option[value='"+res.time_extension+"']").attr("selected",true);
                $("#average_price option[value='"+res.average_price+"']").attr("selected",true);
                $("#retailer_mode option[value='"+res.retailer_mode+"']").attr("selected",true);
        })
    }
    padZero(num, n) { 
        let len = num.toString().split('.')[1].length; 
        while(len < n) { 
        num = num+"0"; 
        len++; 
        } 
        return num; 
    } 
    doName(e){
        let obj = e.target.value;
        this.setState({
            name:obj
        })
    }
    doDuration(e){
        let obj = e.target.value;
        if(Number(obj) > 1380){
            return false;
        }
        this.setState({
            duration:obj
        })
    }
    doPrice(e){
        let obj = e.target.value;
        this.setState({
            reserve_price:obj
        })
    }
    startPrice(e){
        let obj = e.target.value;
        this.setState({
            starting_price:obj
        })
    }
    starttimeChange(data) {
        if(this.state.endDate != ''){
        let selectDay = new Date(data.format());
        let endDay = new Date(this.state.endDate.format());
                if (selectDay < endDay) {
                    this.setState({
                        startDate: data
                    })
                } else {
                    this.setState({
                        startDate: data,
                        endDate: data
                    });
                }
        }else{
            this.setState({
                startDate: data
            })
        }
        
    }
    endtimeChange(data) {
        if(this.state.startDate != ''){
            let selectDay = new Date(data.format());
            let startDay = new Date(this.state.startDate.format());
            if (selectDay > startDay) {
                this.setState({
                    endDate: data
                })
            } else {
                this.setState({
                    startDate: data,
                    endDate: data
                });
            }
        }else{
            this.setState({
                endDate: data
            })
            
        }
    }
    dateChange(data){
        this.setState({
            ra_date:data
        })
    }
    timeChange(data){
        this.setState({
            start_datetime:data
        })
        if(this.state.startDate != ''){
            if((data-this.state.startDate) >= 0){
                        this.setState({
                            startDate:''
                        })
                    }
        }
        if(this.state.endDate != ''){
            if((data-this.state.endDate) >= 0){
                        this.setState({
                            endDate:''
                        })
                    }
        }        
    }
    auctionCreate(type,e){
        this.setState({
            btn_type:type
        })
    }
    edit(){
        this.setState({
            edit_btn:"lm--button lm--button--primary hide",
            edit_change:"lm--button lm--button--primary show",
            disabled:false
        })
    }
    Cancel(){
        this.setState({
            edit_btn:"lm--button lm--button--primary show",
            edit_change:"lm--button lm--button--primary hide",
            disabled:true
        })
        this.doGetData();
    }
    setAuction(){
        this.auction.id=this.state.id;
        this.auction.contract_period_end_date= this.state.endDate.format().split("T")[0];
        this.auction.contract_period_start_date= this.state.startDate.format().split("T")[0];
        this.auction.duration= this.refs.duration.value;
        this.auction.name= this.refs.name.value;
        this.auction.reserve_price= this.refs.reserve_price.value;
        this.auction.start_datetime= this.state.start_datetime.format();
        this.auction.actual_begin_time= moment(this.state.start_datetime.toDate()).format();
        this.auction.actual_end_time = moment(this.state.start_datetime.toDate()).add(this.refs.duration.value,'minutes').format();
        this.auction.time_extension= this.refs.time_extension.value;
        this.auction.average_price= this.refs.average_price.value;
        this.auction.starting_price= this.refs.starting_price.value;
        this.auction.retailer_mode= this.refs.retailer_mode.value;
        return this.auction;
    }

    noPermitInput(event){
        event.preventDefault();
    }
    checkSubmitTruly(){
        let data = {};
        if(this.auction_data === null){
            data = this.setAuction();
        }else{
            if(JSON.stringify(this.setAuction()) === JSON.stringify(this.auction_data)){
                data = this.auction_data;
            }else{
                data = this.setAuction();
            }
        }
        return data;
    }  
    checkSuccess(event,obj){
        event.preventDefault();
        let timeBar;
        if(!this.state.disabled){
            if(this.state.start_datetime < moment()){
                $("#start_datetime .required_error").fadeIn(300);
                window.location.href="#start_datetime";
                clearTimeout(timeBar);
                timeBar = setTimeout(()=>{
                    $("#start_datetime .required_error").fadeOut(300);
                },5000)
                return false;
            }
            if(this.state.reserve_price > this.state.starting_price){
                $("#reserve_price .required_error").fadeIn(300);
                window.location.href="#reserve_price";
                clearTimeout(timeBar);
                timeBar = setTimeout(()=>{
                    $("#reserve_price .required_error").fadeOut(300);
                },5000);
                return false
            }
        }
        
        if(this.state.btn_type == "save"){
            createRa({auction: this.checkSubmitTruly()}).then(res => {
                            this.auction_data = res;
                            this.auction = res;
                            this.refs.Modal.showModal();
                            this.setState({id:res.id})
                            sessionStorage.auction_id = res.id;
                            if(this.props.left_name){
                                this.setState({
                                    text:this.auction.name + " has been successfully updated. ",
                                    disabled:true
                                });
                            }else{
                                this.setState({
                                    text:this.auction.name + " has been successfully saved. ",
                                    disabled:true
                                });
                            }
                            
                        }, error => {
                            this.setState({
                                text:'Request exception,Save failed!'
                            });
                            this.refs.Modal.showModal();
                        })
            if(this.props.left_name){
                this.setState({
                    edit_btn:"lm--button lm--button--primary show",
                    edit_change:"lm--button lm--button--primary hide"
                })
            }
        }
        if(this.state.btn_type == "next"){
            sessionStorage.isAuctionId = "yes";
            if(this.state.disabled){
                window.location.href=`/admin/auctions/${this.auction.id}/invitation`;
            }else{
                createRa({auction: this.checkSubmitTruly()}).then(res => {
                    this.auction = res;
                    sessionStorage.auction_id = res.id;
                    window.location.href=`/admin/auctions/${res.id}/invitation`;
                }, error => {
                    this.setState({
                        text:'Request exception,Save failed!'
                    });
                    this.refs.Modal.showModal();
                })
            }
            
        }
    }
    render () {
        let left_name ="";
        let btn_html ="";
        let sStorage = {};
        let styleType = "";
        let publish = window.location.href.split("/");
        let status = publish[publish.length-1];// new upcoming
        let url;
        if(status=="new"){
            url = "/admin/auctions/unpublished"
        }else{
            url = "/admin/auctions/published"
        }
        if(this.props.left_name == undefined){//Create New Ra
            styleType = "col-sm-12 col-md-8 push-md-2";
            left_name = "Create New Reverse Auction";
                btn_html = <div className="createRa_btn">
                                {this.state.disabled ? <div className="mask"></div> : ''}
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'save')}>Save</button>
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'next')}>Next</button>
                            </div>
        }else{//edit
            styleType = "col-sm-12 col-md-8 push-md-2";
            left_name = this.props.left_name;
            btn_html = <div className="createRa_btn">
                            {this.props.disabled?
                                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'next')}>Next</button>:
                                <div>
                                    <a className={this.state.edit_btn} onClick={this.edit.bind(this)}>Edit</a>
                                    <a className={this.state.edit_change} onClick={this.Cancel.bind(this)}>Cancel</a>
                                    <button className={this.state.edit_change} onClick={this.auctionCreate.bind(this,'save')}>Save</button>
                                    <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this,'next')}>Next</button>
                                </div>}
                        </div>
        }
        return (
            <div>
            <div className={"createRaMain u-grid "+this.state.live_modal_do}>
            <div className={styleType}>
                <h2>{left_name}</h2>
                <form action="" ref="CreatRaForm" method="post" id="CreatRaForm" onSubmit={this.checkSuccess.bind(this)}>
                <dl className="vw-block vw-block-cols creatRa">
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Name of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" value={this.state.name} onChange={this.doName.bind(this)} disabled={this.state.disabled} ref="name" name="name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Date/Time of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control" id="start_datetime">
                        <DatePicker selected={this.state.start_datetime} disabled={this.state.disabled} onKeyDown={this.noPermitInput.bind(this)} ref="start_datetime" shouldCloseOnSelect={true} name="start_datetime" showTimeSelect dateFormat="DD-MM-YYYY HH:mm" timeFormat="HH:mm" timeIntervals={1}  className="time_ico"  onChange = {this.timeChange} minDate={moment()} title="Time must not be in the past."  required aria-required="true"/>
                        <abbr ref="ra_duration_error" className="col">(SGT)</abbr>
                        <div className="required_error">Auction Date/time must bigger than current time</div>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Reverse Auction Contract Period :</span>
                        <label className="col">
                            {
                                this.state.start_datetime === '' ? <DatePicker disabled={this.state.disabled} minDate={moment()} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange = {this.starttimeChange}/> 
                                :<DatePicker disabled={this.state.disabled} minDate={this.state.start_datetime} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange = {this.starttimeChange}/>
                            }
                        </label>
                        <label className="col"><b>to</b></label>
                        <label className="col">
                            {
                                this.state.start_datetime === '' ? <DatePicker disabled={this.state.disabled} minDate={moment()} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>
                                :<DatePicker disabled={this.state.disabled} minDate={this.state.start_datetime} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>
                            }
                            
                        </label>
                    </dd>
                    <dd></dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">Reverse Auction Parameters</span>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Duration (minutes):</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="duration" onChange={this.doDuration.bind(this)} value={this.state.duration} disabled={this.state.disabled} name="duration" maxLength="50" required aria-required="true" pattern="^[0-9]*[1-9][0-9]*$" title="Duration must be an integer."></input>
                            <abbr ref="ra_duration_error" className="col"></abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">
                            <abbr title="required">*</abbr>Starting Price ($/kWh):</span>
                            <label className="lm--formItem-right lm--formItem-control">
                                <input type="test" ref="starting_price" onChange={this.startPrice.bind(this)} value={this.state.starting_price} disabled={this.state.disabled} name="starting_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>
                                <abbr ref="ra_duration_error" className="col"></abbr>
                            </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Reserve Price ($/kWh):</span>
                        <label className="lm--formItem-right lm--formItem-control" id="reserve_price">
                            <input type="test" ref="reserve_price" onChange={this.doPrice.bind(this)} value={this.state.reserve_price} disabled={this.state.disabled} name="reserve_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Reserve Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>
                            <abbr ref="ra_duration_error" className="col"></abbr>
                            <div className="required_error">Reserve price must be smaller than or equal to starting price.</div>
                        </label>

                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">
                            <abbr title="required">*</abbr>Time Extension :</span>
                            <label className="lm--formItem-right lm--formItem-control">
                                <select ref="time_extension" id="time_extension" disabled={this.state.disabled}>
                                    <option value="0">Manual</option>
                                    <option value="1">Customize</option>
                                </select>
                            </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">
                            <abbr title="required">*</abbr>Average Price :</span>
                            <label className="lm--formItem-right lm--formItem-control">
                                <select ref="average_price" id="average_price" disabled={this.state.disabled}>
                                    <option value="0">Weighted Average</option>
                                </select>
                            </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional">
                            <abbr title="required">*</abbr>Retailer Mode :</span>
                            <label className="lm--formItem-right lm--formItem-control">
                                <select ref="retailer_mode" id="retailer_mode" disabled={this.state.disabled}>
                                    <option value="0">Mode 1: Top 2</option>
                                    <option value="1">Mode 2: 1st, 2nd</option>
                                </select>
                            </label>
                    </dd>
                </dl>
                {btn_html}
                </form>
                <Modal text={this.state.text} ref="Modal" />
            </div>
            </div>
            <div className="createRaMain u-grid">
                <a className="lm--button lm--button--primary u-mt3" href={url}>Back</a>
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
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}