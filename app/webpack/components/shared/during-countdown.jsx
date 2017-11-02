import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export class DuringCountDown extends Component {
    constructor(props){
        super(props);
        this.state = {
            interval:1000,
            retailer_hold:"show",
            admin_hold:"hide"
        }
    } 
    componentDidMount() {
        setInterval(() => {
            this.ShowCountDown(2017,11,2,9,20,'during_countdown_timer');
        }, this.state.interval);
    }
    ShowCountDown(year,month,day,hours,minutes,obj) 
    { 
        var now = new Date(); 
        var endDate = new Date(year, month-1, day, hours, minutes); 
        var leftTime=endDate.getTime()-now.getTime(); 
        var leftsecond = parseInt(leftTime/1000); 
        var day=Math.floor(leftsecond/(60*60*24)); 
        var hour=Math.floor((leftsecond-day*24*60*60)/3600); 
        var minute=Math.floor((leftsecond-day*24*60*60-hour*3600)/60); 
        var second=Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60); 
        var cc = document.getElementById(obj); 
        cc.innerHTML =  '<span><font>'+minute+'</font>MINUTES</span>'+  
                        '<span><font>'+second+'</font>SECONDS</span>'; 
    } 
    render () {
        return (
            <div className="time_cuntdown during">
                <p>SP Reverse Auction on 1 Dec 2017,10:00AM</p>
                <div className="Countdown">
                    <abbr>Countdown Timer:</abbr>
                    <ol id="during_countdown_timer"></ol>
                    <div id="admin_hold" className={this.state.admin_hold}><span>Extend Time:</span><input type="tel" className="fill_hold"/><span>Min</span><input type="submit" className="hold_submit" value="Submit"/></div>
                    <div id="retailer_hold" className={this.state.retailer_hold}><b>Admin has extended auction duration by 2 minuties</b></div>
                </div>
            </div>
        )
    }
}