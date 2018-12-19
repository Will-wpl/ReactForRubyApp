import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
//import {DuringCountDown} from '../shared/during-countdown';
import {getRetailerAuctionInVersionOne, retailManageComing,retailManageComingNode5,getRetailerFiles} from '../../javascripts/componentService/retailer/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Modal} from '../shared/show-modal';
import {getLoginUserId} from '../../javascripts/componentService/util';
import moment from 'moment';

export class RetailerManage extends Component {
    constructor(props){
        super(props);
        this.state={
            id:"",
            text:"",
            type:"",live_modal:"",live_modal_do:"",
            btn_status:false,
            disabled:false,
            havedata:false,
            allbtnStatus:true,
            main_name:"",
            main_email_address:"",
            main_mobile_number:"",
            main_office_number:"",
            alternative_name:"",
            alternative_email_address:"",
            alternative_mobile_number:"",
            alternative_office_number:"",
            files:[]
        }
        this.auctionData = {};
    }
    componentWillMount(){
        getAuction('retailer',sessionStorage.auction_id).then(res=>{
            this.auction = res;
            this.timerTitle = res ? `${res.name} on ${moment(res.start_datetime).format('D MMM YYYY, h:mm a')}` : '';

            if(this.props.doJest){//for Jest
                if(this.props.pubStatusJest == 1){
                    this.setState({
                        live_modal:"live_hide",
                        live_modal_do:"live_show"
                    })
                }else{
                    this.setState({
                        live_modal:"live_show",
                        live_modal_do:"live_hide"
                    })
                }
            }else{
                if(res.publish_status == 1){
                    this.setState({
                        live_modal:"live_hide",
                        live_modal_do:"live_show"
                    })
                }else{
                    this.setState({
                        live_modal:"live_show",
                        live_modal_do:"live_hide"
                    })
                }
            }


        }, error => {
            console.log(error);
        })
    }
    componentDidMount() {
        this.getRetailerAuction();
        getRetailerFiles(sessionStorage.arrangement_id).then(res=>{
            this.setState({files:res});
        })
    }
    getRetailerAuction(){
        let auction_id = ''
        if(this.props.doJest){
            auction_id = 1
        }else{
            auction_id = sessionStorage.auction_id;
        }
        let user_id = getLoginUserId();
        getRetailerAuctionInVersionOne({ auction_id: auction_id, user_id: user_id}).then(res => {
            if(this.props.doJest){
                this.setState({
                        disabled:false,
                        havedata:false,
                        id:this.props.main.id,
                        main_name:this.props.main.main_name,
                        main_email_address:this.props.main.main_email_address,
                        main_mobile_number:this.props.main.main_mobile_number,
                        main_office_number:this.props.main.main_office_number,
                        alternative_name:this.props.main.alternative_name,
                        alternative_email_address:this.props.main.alternative_email_address,
                        alternative_mobile_number:this.props.main.alternative_mobile_number,
                        alternative_office_number:this.props.main.alternative_office_number
                })
            }else{
                if(res.main_name && res.main_email_address && res.main_mobile_number && res.main_office_number){
                    this.setState({
                        disabled:true,
                        havedata:true
                    })
                }else{
                    this.setState({
                        disabled:false,
                        havedata:false
                    })
                }
                this.auctionData = res;
                this.setState({
                    id:res.id,
                    main_name:res.main_name ? res.main_name : '',
                    main_email_address:res.main_email_address ? res.main_email_address :'',
                    main_mobile_number:res.main_mobile_number ? res.main_mobile_number:'',
                    main_office_number:res.main_office_number?res.main_office_number:'',
                    alternative_name:res.alternative_name?res.alternative_name:'',
                    alternative_email_address:res.alternative_email_address?res.alternative_email_address:'',
                    alternative_mobile_number:res.alternative_mobile_number?res.alternative_mobile_number:'',
                    alternative_office_number:res.alternative_office_number?res.alternative_office_number:''
                })

            }

        }, error => {
            console.log(error);
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
    btnStatus(){
        this.setState({
            btn_status:true,
            disabled:false
        })
    }
    cancel(){
        this.getRetailerAuction();
        this.setState({
            btn_status:false,
            disabled:true
        })
    }
    retailerManageComing(){
        retailManageComing({
            arrangement: {
                "id": this.state.id,
                "main_name": this.state.main_name,
                "main_email_address": this.state.main_email_address,
                "main_mobile_number": this.state.main_mobile_number,
                "main_office_number": this.state.main_office_number,
                "alternative_name": this.state.alternative_name,
                "alternative_email_address": this.state.alternative_email_address,
                "alternative_mobile_number": this.state.alternative_mobile_number,
                "alternative_office_number": this.state.alternative_office_number,
                "lt_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.lt_peak.value
                "lt_off_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.lt_off_peak.value
                "hts_peak":this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.hts_peak.value
                "hts_off_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.hts_off_peak.value
                "htl_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.htl_peak.value
                "htl_off_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.htl_off_peak.value
                "eht_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.htl_peak.value
                "eht_off_peak": this.auction.starting_price?this.auction.starting_price:0.1458,//+this.refs.htl_off_peak.value
                "accept_status": "1"   // '0':reject '1':accept '2':pending
            }
        }).then(res => {
            if(!this.props.doJest){
                this.refs.Modal.showModal();
            }
                this.setState({
                    text:"Your details have been successfully submitted. You may click on 'Start Bidding' in the published auction list to standby for the live Reverse Auction."
                });
                setTimeout(()=>{
                    window.location.href='/retailer/auctions'
                },3000)
                this.getRetailerAuction();
                this.setState({
                    btn_status:false,
                    disabled:true
                })
            }, error => {
                console.log(error);
            })
    }
    checkSuccess(event,obj){
        if(this.props.onSubmitjest){
            this.props.onSubmitjest();
        }else{
            event.preventDefault();
        }
        if(this.props.node){
            retailManageComingNode5(sessionStorage.arrangement_id).then(res=>{
                this.retailerManageComing();
                this.props.page();
            })
        }else{
            this.retailerManageComing();
        }
    }
    Change(type,e){
        let value = e.target.value;
        switch(type){
            case 'main_name': this.setState({main_name:value})
            break
            case 'main_email_address': this.setState({main_email_address:value})
            break
            case 'main_mobile_number': this.setState({main_mobile_number:value})
            break
            case 'main_office_number': this.setState({main_office_number:value})
            break
            case 'alternative_name': this.setState({alternative_name:value})
            break
            case 'alternative_email_address': this.setState({alternative_email_address:value})
            break
            case 'alternative_mobile_number': this.setState({alternative_mobile_number:value})
            break
            case 'alternative_office_number': this.setState({alternative_office_number:value})
            break
        }
    }
    render () {
        let btn_html ='';
        !this.state.havedata ? btn_html = <button id="submit_form" className="lm--button lm--button--primary" >Submit</button>
        : btn_html = !this.state.btn_status ? (window.location.href.indexOf("past")>0?<button className="lm--button lm--button--primary" disabled>Edit</button>:<a className="lm--button lm--button--primary" onClick={this.btnStatus.bind(this)}>Edit</a> )
                       :<div>
                        <a className="lm--button lm--button--primary" onClick={this.cancel.bind(this)}>Cancel</a>
                        <button id="submit_form" className="lm--button lm--button--primary" >Submit</button>
                        </div>;
        return (
            <div className="retailer_manage_coming">
            <div id="live_modal" className={this.state.live_modal}>
                <div className={this.state.holdOrend}></div>
                <p>
                There is no upcoming reverse auction published.
                </p>
            </div>
            <div id="retailer_form" className={this.state.live_modal_do}>
            {!this.props.hiddentimeCount ? <TimeCuntDown auction={this.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}}/> : ''}
            <form onSubmit={this.checkSuccess.bind(this)}>
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    {this.state.files.length>0?
                    <div>
                        <h3 className="u-mt3 u-mb1">Briefing Pack</h3>
                        <div className="lm--formItem lm--formItem--inline string">
                            <label className="lm--formItem-left lm--formItem-label string required"></label>
                            <div className="lm--formItem-right lm--formItem-control">
                                <ul className="brif_list">
                                {this.state.files.map((item,index)=>{
                                    return <li key={index}><a target="_blank" download={item.file_name} href={item.file_path}>{item.file_name}</a></li>
                                })}
                            </ul>
                            </div>
                        </div>
                    </div>:''}
                    <h3 className="u-mt3 u-mb1">Contact person details for actual day of bidding</h3>
                    <h4 className="lm--formItem lm--formItem--inline string">Main contact person:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_name" value={this.state.main_name} onChange={this.Change.bind(this,'main_name')} disabled={this.state.disabled} ref="main_name" maxLength="150" required aria-required="true" title="The length must not be longer than 150 characters."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_email_address" value={this.state.main_email_address} onChange={this.Change.bind(this,'main_email_address')} disabled={this.state.disabled} ref="main_email_address" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" title="Email address should be in the format name@example.com."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_mobile_number" maxLength="8" value={this.state.main_mobile_number} onChange={this.Change.bind(this,'main_mobile_number')} disabled={this.state.disabled} ref="main_mobile_number"   required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_office_number" maxLength="8" value={this.state.main_office_number} onChange={this.Change.bind(this,'main_office_number')} disabled={this.state.disabled} ref="main_office_number"  required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <h4 className="lm--formItem lm--formItem--inline string">Alternative contact person:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_name" value={this.state.alternative_name} onChange={this.Change.bind(this,'alternative_name')} disabled={this.state.disabled} ref="alternative_name" maxLength="150" title="The length must not be longer than 150 characters."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_email_address" value={this.state.alternative_email_address} onChange={this.Change.bind(this,'alternative_email_address')} disabled={this.state.disabled} ref="alternative_email_address" aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" maxLength="50" title="Email address should be in the format name@example.com."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_mobile_number" value={this.state.alternative_mobile_number} onChange={this.Change.bind(this,'alternative_mobile_number')} disabled={this.state.disabled} ref="alternative_mobile_number" maxLength="8" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_office_number" value={this.state.alternative_office_number} onChange={this.Change.bind(this,'alternative_office_number')} disabled={this.state.disabled} ref="alternative_office_number" maxLength="8" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="retailer_btn">
                        {!this.state.allbtnStatus ? <div className="mask"></div> : ''}
                        {/* <button className="lm--button lm--button--primary">Reject Participation</button> */}
                        {btn_html}
                    </div>
                </div>
            </div>
            </form>
            <Modal text={this.state.text} ref="Modal" />
            </div>
            </div>
        )
    }
}

RetailerManage.propTypes = {
    onSubmitjest: ()=>{}
};




function runs() {
    const domNode = document.getElementById('retailerManage');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerManage),
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
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}