import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CounterDownShowBeforeLive} from '../shared/before-live-counterdown';
import {AUCTION_PROPS, getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import {getDHMSbetweenTwoTimes} from '../../javascripts/componentService/util';
import moment from 'moment';
export class RetailerBeforeLive extends Component {

    constructor(props) {
        super(props);
        this.mHoldStatus = false;
        this.state = {holdStatus:false, day: 0, hour: 0, minute: 0, second: 0,timeShow:false}
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.getAuctionTime(this.props.auction.id);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    mouthsHtml(data,index){
        const html = <div key={index} className="col-sm-12">
            <h3 className={"u-mt2 u-mb2"}>{data.contract_duration} months ($/kWh)</h3>
            <div className="lm--formItem lm--formItem--inline string optional">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                    <tr>
                        <th></th>
                        {data.has_lt?<th>LT</th>:<th style={{display:"none"}}></th>}
                        {data.has_hts?<th>HTS</th>:<th style={{display:"none"}}></th>}
                        {data.has_htl?<th>HTL</th>:<th style={{display:"none"}}></th>}
                        {data.has_eht?<th>EHT</th>:<th style={{display:"none"}}></th>}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Peak<br/>(7am-7pm)</td>
                        {data.has_lt?<td>$ {parseFloat(data.starting_price_lt_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_hts?<td>$ {parseFloat(data.starting_price_hts_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_htl?<td>$ {parseFloat(data.starting_price_htl_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_eht?<td>$ {parseFloat(data.starting_price_eht_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                    </tr>
                    <tr>
                        <td>Off Peak <br/>(7pm-7am)</td>
                        {data.has_lt?<td>$ {parseFloat(data.starting_price_lt_off_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_hts?<td>$ {parseFloat(data.starting_price_hts_off_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_htl?<td>$ {parseFloat(data.starting_price_htl_off_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                        {data.has_eht?<td>$ {parseFloat(data.starting_price_eht_off_peak).toFixed(4)}/kWh</td>:<td style={{display:"none"}}></td>}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        return html;
    }
    render() {
        return (
            <div>
                <CounterDownShowBeforeLive
                    auction={this.props.auction} isHold={this.state.holdStatus}
                    day={this.state.day} hour={this.state.hour} minute={this.state.minute} second={this.state.second}/>
                <div className={'live_show'} id="live_modal">
                    <div className={'live_hold'}></div>
                    <p>
                        Please standby, bidding will<br></br>
                        commence soon.<br></br>
                        Page will automatically refresh when<br></br>Reverse Auction commences.
                    </p>
                </div>
                {this.state.timeShow?(this.props.auction.live_auction_contracts?
                    <div className="createRaMain u-grid">
                        <div className={'col-sm-12 col-md-6 push-md-3'}>
                        <h2>Starting Price</h2>
                        {this.props.auction.live_auction_contracts.length>0?
                            this.props.auction.live_auction_contracts.map((item,index)=>{
                                return this.mouthsHtml(item,index)
                            }):''
                        }</div>
                    </div>:''):''
                }
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/auctions">Back</a>
                </div>
            </div>
        );
    }

    getAuctionTime(auctionId) {
        getAuctionTimeRule(auctionId).then(res => {
            const isOver = this.isCountDownOver(res[AUCTION_PROPS.ACTUAL_BEGIN_TIME], res[AUCTION_PROPS.ACTUAL_CURRENT_TIME]);
            if(parseInt(moment(res[AUCTION_PROPS.ACTUAL_BEGIN_TIME]).add(parseInt(0-this.props.auction.starting_price_time),"hours") - moment(res[AUCTION_PROPS.ACTUAL_CURRENT_TIME]))<=0){
                this.setState({timeShow:true});
            }else{
                this.setState({timeShow:false});
            }
            if (isOver) {
                if (this.mHoldStatus !== res[AUCTION_PROPS.HOLD_STATUS]) {
                    this.setState({holdStatus: res[AUCTION_PROPS.HOLD_STATUS]});
                    this.mHoldStatus = res[AUCTION_PROPS.HOLD_STATUS];
                }
            }
            if (isOver && !res[AUCTION_PROPS.HOLD_STATUS]) {
                clearInterval(this.interval);
                if (this.props.countDownOver) {
                    this.props.countDownOver();
                }
            }
        }, error => {
            console.log(error)
        })
    }

    isCountDownOver(startSeq, nowSeq) {
        const time = getDHMSbetweenTwoTimes(startSeq, nowSeq);
        const left = time.day || time.hour || time.minute || time.second;
        if (left <= 0) {
            if (left === 0) {
                this.setState({day: 0, hour: 0, minute: 0, second: 0});
            }
            return true;
        }
        this.setState({day: time.day, hour: time.hour, minute: time.minute, second: time.second});
        return false;
    }
}

RetailerBeforeLive.PropTypes = {
    auction: PropTypes.shape({
        id: PropTypes.number.isRequired,
        start_datetime: PropTypes.string,
        name: PropTypes.string
    }).isRequired,
    countDownOver: PropTypes.func
}