import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export class TimeCuntDown extends Component {
    constructor(props){
        super(props);
        this.state = {
            interval:1000
        }
    } 
    componentDidMount() {
        setInterval(() => {
            this.ShowCountDown(2018,1,12,'countdown_timer');
        }, this.state.interval);
    }
    ShowCountDown(year,month,day,obj) 
    { 
        var now = new Date(); 
        var endDate = new Date(year, month-1, day); 
        var leftTime=endDate.getTime()-now.getTime(); 
        var leftsecond = parseInt(leftTime/1000); 
        var day=Math.floor(leftsecond/(60*60*24)); 
        var hour=Math.floor((leftsecond-day*24*60*60)/3600); 
        var minute=Math.floor((leftsecond-day*24*60*60-hour*3600)/60); 
        var second=Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60); 
        var cc = document.getElementById(obj); 
        cc.innerHTML = '<span><font>'+day+'</font>DAYS</span>'+
                        '<span><font>'+hour+'</font>HOURS</span>'+
                        '<span><font>'+minute+'</font>MINUTES</span>'+  
                        '<span><font>'+second+'</font>SECONDS</span>'; 
    } 
    render () {
        return (
            <div className="time_cuntdown">
                <p>SP Reverse Auction on 1 Dec 2017,10:00AM</p>
                <div className="Countdown"><abbr>Countdown Timer:</abbr><ol id="countdown_timer"></ol></div>
            </div>
        )
    }
}