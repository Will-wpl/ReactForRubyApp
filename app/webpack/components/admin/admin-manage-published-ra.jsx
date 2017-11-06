import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {CreateNewRA} from './create-new-ra';
import {BidderStatus} from './admin_shared/bidders-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuctionInVersionOne,getBidderStatus} from '../../javascripts/componentService/admin/service';
export class AdminManagePublishedRa extends Component {
    constructor(props, context){
        super(props);
        this.state={
            id:"",
            dataList:[]
        }
    }
    componentWillMount(){
        getAuctionInVersionOne().then(res => {
            //console.log(res);
            getBidderStatus({auction_id:res.id}).then(res => {
                console.log(res);
                this.setState({
                    dataList:res,
                })
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        })
    }
    componentDidMount() {

    }
    render () {
        return (
            <div>
                <TimeCuntDown />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        <CreateNewRA left_name="Manage Upcoming Reverse Auction" />
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <BidderStatus dataList={this.state.dataList} />
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminManagePublishedRa');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminManagePublishedRa),
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