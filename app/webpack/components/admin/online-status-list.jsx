import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {RetailsOnlineStatus} from './admin_shared/retailers-online-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuctionInVersionOne,getBidderStatus} from '../../javascripts/componentService/admin/service';
import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
const ACTUAL_END_TIME = 'actual_end_time';
const ACTUAL_CURRENT_TIME = 'current_time';
export class OnlineStatusMain extends Component {
    constructor(props, context){
        super(props);
        this.state={
            id:"",
            dataList:[],
            data_online:[],
            data_pedding:[],
            data_outline:[],
        }
    }
    componentWillMount(){
        getAuctionInVersionOne().then(res => {
            //console.log(res);
            this.auction = res;
            this.timerTitle = this.auction ? `${this.auction.name} on ${moment(this.auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            getBidderStatus({auction_id:res.id}).then(res => {
                console.log(res);
                this.setState({
                    dataList:res,
                })
                let data_outline=[],
                    data_online=[],
                    data_pedding=[]
                for(let i=0; i<this.state.dataList.length; i++){
                    if(this.state.dataList[i].login_status == "off"){
                        data_outline.push(this.state.dataList[i]);
                    }
                    if(this.state.dataList[i].login_status == "on"){
                        data_online.push(this.state.dataList[i]);
                    }
                    if(this.state.dataList[i].login_status == "other"){
                        data_pedding.push(this.state.dataList[i]);
                    }
                }
                this.setState({
                    data_online:data_online,
                    data_outline:data_outline,
                    data_pedding:data_pedding,
                })
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        })
    }
    goToDashboard(){
        window.location.href=`/admin/auctions/${this.auction.id}/dashboard`
    }
    render (){
        return (
            <div className="onlineStatusMain">
                <TimeCuntDown title={this.timerTitle} auction={this.auction} countDownOver={this.goToDashboard.bind(this)} />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-10 push-md-1">
                    <h3 className="col-sm-12 col-md-12 u-mb3">Online Status of Retailers</h3>
                    <div className="u-grid u-mt2">
                        <div className="col-sm-12 col-md-4">
                            <RetailsOnlineStatus list_data={this.state.data_online} />
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <RetailsOnlineStatus list_data={this.state.data_pedding} />
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <RetailsOnlineStatus list_data={this.state.data_outline} />
                        </div>
                    </div>
                    </div>
                    <div className="col-sm-12 col-md-10 push-md-1 u-mt3">
                        <div className="col-sm-12 col-md-5">
                            <ul className="ros_tab">
                                <li className="on">Retailer has logged in and is located in the 'start bidding' page</li>
                                <li className="other">Retailer has logged in but not located in the 'start bidding' page</li>
                                <li className="off">Retailer has logout</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-10 push-md-1 u-mt3">
                        <button className="lm--button lm--button--primary fright">Hold</button>
                    </div>
                </div>
                <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
            </div>
            </div>
        )}
    }

    function run() {
        const domNode = document.getElementById('OnlineStatusMain');
        if(domNode !== null){
            ReactDOM.render(
                React.createElement(OnlineStatusMain),
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