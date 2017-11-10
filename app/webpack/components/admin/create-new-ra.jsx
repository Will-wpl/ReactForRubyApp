import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { createRa, getAuctionInVersionOne, raPublish } from '../../javascripts/componentService/admin/service';
import { Modal } from '../shared/show-modal';

export class CreateNewRA extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            name:"",
            start_datetime:"",
            startDate:"",
            endDate:"",
            duration:"",
            reserve_price:"",
            left_name:this.props.left_name,
            btn_type:"",text:"",id:"",
            edit_btn:"lm--button lm--button--primary show",
            edit_change:"lm--button lm--button--primary hide",
            disabled:"",live_modal:"",live_modal_do:"",holdOrend:""
        }
        this.auction = {};
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }
    componentDidMount() {
        if (this.props.left_name) {//eidt
            this.setState({
                disabled: "disabled",
                live_modal: "live_hide"
            })
            this.doGetData();
        } else {//create
            this.doGetData("create")
        }
    }
    doGetData(type) {
        getAuctionInVersionOne().then(res => {
            this.auction = res;
            // if(type == "create"){
            //     if(this.auction.publish_status == 1){
            //         this.setState({
            //             live_modal:"live_show",
            //             live_modal_do:"live_hide",
            //         })
            //     }else{
            //         this.setState({
            //             live_modal:"live_hide",
            //             live_modal_do:"live_show",
            //          })
            // }               
            if(res.duration == null){
                this.setState({id:res.id})
            }else{
                this.setState({
                    id: res.id,
                    name: res.name == null ? '' : res.name,
                    start_datetime: res.start_datetime == null ? '' : moment(res.start_datetime),
                    startDate: res.contract_period_start_date == null ? '' :  moment(res.contract_period_start_date),
                    endDate:res.contract_period_end_date == null ? '' : moment(res.contract_period_end_date),
                    duration:res.duration== null ? '' : res.duration,
                    reserve_price:res.reserve_price== null ? '' : this.padZero(res.reserve_price,'4')
                });
                // }
                //console.log(res);

            };
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
            name: obj
        })
    }
    doDuration(e) {
        let obj = e.target.value;
        this.setState({
            duration: obj
        })
    }
    doPrice(e) {
        let obj = e.target.value;
        this.setState({
            reserve_price: obj
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
                        startDate: this.state.endDate,
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
                    endDate: this.state.startDate
                });
            }
        }else{
            this.setState({
                endDate: data
            })
            
        }
    }
    dateChange(data) {
        this.setState({
            ra_date: data
        })
    }
    timeChange(data) {
        this.setState({
            start_datetime: data
        })
    }
    auctionCreate(type, e) {
        this.setState({
            btn_type: type
        })
    }
    edit() {
        this.setState({
            edit_btn: "lm--button lm--button--primary hide",
            edit_change: "lm--button lm--button--primary show",
            disabled: ""
        })
    }
    Cancel() {
        this.setState({
            edit_btn: "lm--button lm--button--primary show",
            edit_change: "lm--button lm--button--primary hide",
            disabled: "disabled"
        })
        this.doGetData();
    }
    setAuction() {
        // this.auction.id=this.state.id;
        this.auction.contract_period_end_date= this.state.endDate.format().split("T")[0];
        this.auction.contract_period_start_date= this.state.startDate.format().split("T")[0];
        this.auction.duration= this.refs.duration.value;
        this.auction.name= this.refs.name.value;
        this.auction.reserve_price= this.refs.reserve_price.value;
        this.auction.start_datetime= this.state.start_datetime.format();
        this.auction.actual_begin_time= moment(this.state.start_datetime.toDate()).format();
        this.auction.actual_end_time = moment(this.state.start_datetime.toDate()).add(this.refs.duration.value,'minutes').format();
        //console.log(this.state.start_datetime.format('YYYY-MM-DD hh:mm:ss'));
        //console.log(moment(this.auction.actual_end_time).format('YYYY-MM-DD hh:mm:ss'));
        return this.auction;
    }

    removeAuction(){
        this.auction.contract_period_end_date= null;
        this.auction.contract_period_start_date= null;
        this.auction.duration= null;
        this.auction.name= null;
        this.auction.reserve_price= null;
        this.auction.start_datetime= null;
        this.auction.publish_status= 0;
        this.auction.published_gid= null;
        this.auction.reserve_price= null;
        this.auction.start_datetime= null;
        this.auction.total_volume= null;
        this.auction.actual_begin_time= null;
        this.auction.actual_end_time= null;
        return this.auction;
    }
    noPermitInput(event){
        event.preventDefault();
    }  
    showDelete(){
        this.refs.Modal.showModal("comfirm");
        this.setState({ text: "Are you sure you want to delete?" });
    }
    delete() {
        createRa({ auction: this.removeAuction() }).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: this.state.name + " has been successfully deleted."
            });
            this.auction = res;
            this.setState({
                id: this.state.id,
                name: "",
                start_datetime: "",
                startDate: "",
                endDate: "",
                duration: "",
                reserve_price: ""
            });
            //sessionStorage.removeItem("raInfo");
            // setTimeout(() => {
            //     window.location.href="http://localhost:3000/admin/home"
            // },3000);
        }, error => {
            console.log(error);
        })
    }
    checkSuccess(event, obj) {
        event.preventDefault();
        if (this.state.btn_type == "save") {
            console.log(this.state.startDate.format());
            console.log(this.state.endDate.format());
            this.setAuction();
            //return;
            createRa({ auction: this.setAuction() }).then(res => {
                this.auction = res;
                this.refs.Modal.showModal();
                this.setState({
                    text: this.auction.name + " has been successfully saved "
                });
            }, error => {
                console.log(error);
            })
    }
    checkSuccess(event,obj){
        event.preventDefault();
        if(this.state.btn_type == "save"){
            //return;
            createRa({auction: this.setAuction()}).then(res => {
                            this.auction = res;
                            this.refs.Modal.showModal();
                            this.setState({
                                text:this.auction.name + " has been successfully saved "
                            });
                        }, error => {
                            console.log(error);
                        })
            if(this.props.left_name){
                this.setState({
                    edit_btn:"lm--button lm--button--primary show",
                    edit_change:"lm--button lm--button--primary hide",
                    disabled:"disabled"
                })
            }
        }
        if (this.state.btn_type == "publish") {
            createRa({ auction: this.setAuction() }).then(res => {
                this.auction = res;
                raPublish({
                    pagedata:{publish_status: '1'},
                    id:this.state.id
                }).then(res => {
                        this.auction = res;
                        this.refs.Modal.showModal();
                        this.setState({
                            text:this.auction.name+" has been successfully published. Please go to 'Manage Published Upcoming Reverse Auction' for further actions."
                        });
                        // setTimeout(() => {
                        //      window.location.href="/admin/home"
                        //  },5000);
                    }, error => {
                        console.log(error);
                    })
            }, error => {
                console.log(error);
            })
        }
    }
    render() {
        let left_name = "";
        let btn_html = "";
        let sStorage = {};
        let styleType = "";
        if (this.props.left_name == undefined) {//Create New Ra
            styleType = "col-sm-12 col-md-8 push-md-2";
            left_name = "Create New Reverse Auction";
            btn_html = <div className="createRa_btn">
                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this, 'save')}>Save</button>
                <a className="lm--button lm--button--primary" onClick={this.showDelete.bind(this)}>Delete</a>
                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this, 'publish')}>Publish</button>
            </div>
        } else {//edit
            styleType = "col-sm-12 col-md-12";
            left_name = this.props.left_name;
            btn_html = <div className="createRa_btn">
                <a className={this.state.edit_btn} onClick={this.edit.bind(this)}>Edit</a>
                <button className={this.state.edit_change} onClick={this.auctionCreate.bind(this, 'save')}>Save</button>
                <a className={this.state.edit_change} onClick={this.Cancel.bind(this)}>Cancel</a>
            </div>
        }
        return (
            <div>
                {/* <div id="live_modal" className={this.state.live_modal}>
                        <div className={this.state.holdOrend}></div>
                        <p>
                        Please standy,bidding will<br></br>
                        commence soon<br></br>
                        Page will automatically refresh when<br></br>reverse auction commences
                        </p>
                    </div> */}
            <div className={"createRaMain u-grid "+this.state.live_modal_do}>
                {/* <div id="live_modal">
                        <div className={this.state.holdOrend}></div>
                        <p>
                        Please standy,bidding will<br></br>
                        commence soon<br></br>
                        Page will automatically refresh when<br></br>reverse auction commences
                        </p>
                    </div> */}
            <div className={styleType}>
                <h2>{left_name}</h2>
                <form action="" ref="CreatRaForm" method="post" id="CreatRaForm" onSubmit={this.checkSuccess.bind(this)}>
                <dl className="vw-block vw-block-cols creatRa">
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Name of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" value={this.state.name} onChange={this.doName.bind(this)} disabled={this.state.disabled} ref="name" name="name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                            {/* <abbr className="error-block" ref="ra_name_error">{this.state.ra_name_error}</abbr> */}
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Date/Time of Reverse Auction :</span>
                        <label className="lm--formItem-right lm--formItem-control">
                        <DatePicker selected={this.state.start_datetime} disabled={this.state.disabled} onKeyDown={this.noPermitInput.bind(this)} ref="start_datetime" shouldCloseOnSelect={true} name="start_datetime" showTimeSelect dateFormat="YYYY-MM-DD HH:mm" timeFormat="HH:mm" timeIntervals={1}  className="time_ico"  onChange = {this.timeChange} minDate={moment()} maxDate={moment().add(30, "days")} title="Time must not be in the past."  required aria-required="true"/>
                        <abbr ref="ra_duration_error" className="col">(SGT)</abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional">
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Reverse Auction Contract Period :</span>
                        <label className="col"><DatePicker disabled={this.state.disabled} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="YYYY-MM-DD" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange = {this.starttimeChange}/>
                        {/* <abbr className="error-block"  ref="ra_time_start_error">{this.state.ra_time_start_error}</abbr> */}
                        </label>
                        <label className="col"><b>to</b></label>
                        <label className="col"><DatePicker disabled={this.state.disabled} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="YYYY-MM-DD" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>
                        {/* <abbr className="error-block" ref="ra_time_end_error">{this.state.ra_time_end_error}</abbr> */}
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
                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Reserve Price ($/kWh):</span>
                        <label className="lm--formItem-right lm--formItem-control">
                            <input type="test" ref="reserve_price" onChange={this.doPrice.bind(this)} value={this.state.reserve_price} disabled={this.state.disabled} name="reserve_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Reserve Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>
                            <abbr ref="ra_duration_error" className="col"></abbr>
                        </label>
                    </dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Time Extension :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Manual</b></label></dd>
                    <dd className="lm--formItem lm--formItem--inline string optional"><span className="lm--formItem-left lm--formItem-label string optional">Average price :</span><label className="lm--formItem-right lm--formItem-control"><b className="textLeft">Weighted Average</b></label></dd>
                </dl>
                {btn_html}
                </form>
                <Modal text={this.state.text} dodelete={this.delete.bind(this)} ref="Modal" />
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('createNewRA');
    if (domNode !== null) {
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