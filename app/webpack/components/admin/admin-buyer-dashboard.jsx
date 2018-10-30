import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuction} from '../../javascripts/componentService/common/service';
import {getAdminBuyerDashboard} from '../../javascripts/componentService/admin/service';
import {BuyerList} from './admin_shared/admin-buyer-list';
export default class AdminBuyerDashboard extends Component {
  constructor(props){
    super(props);
    this.state={
        comsumption_list:[],
        price:{},
        detail:[],
        detail_index:0,
        auction:{},
        buyer_company:{
            count:0,list:[]
        },buyer_individual:{
            count:0,list:[]
        }
    }
}

componentDidMount() {
    getAdminBuyerDashboard(sessionStorage.auction_id).then(res=>{
        // console.log(res)
        this.setState({
            buyer_company:{
                count:res.count_company,
                list:res.consumptions_company,
                type:'company'
            },
            buyer_individual:{
                count:res.count_individual,
                list:res.consumptions_individual,
                type:'individual'
            }
        });
    })
}
componentWillMount(){
    getAuction('admin',sessionStorage.auction_id).then(res => {//sessionStorage.auction_id
        this.setState({auction:res})
    }, error => {
    })
}
tab(type){
    $(".buyer_tab a").removeClass("selected");
    $("#tab_"+type).addClass("selected");
    $(".buyer_list").hide();
    $("#buyer_"+type).fadeIn(500);
}
render() {
    return (
        <div className="u-grid mg0">
            <TimeCuntDown auction={this.state.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}} timehidden="countdown_seconds" />
            <h2 className="u-mt3 u-mb3">Buyer Dashboard</h2>
            <div className="admin_buyer_list col-sm-12 col-md-12">
                <div className="col-sm-12 buyer_tab">
                    <a className="col-sm-4 col-md-2 selected" onClick={this.tab.bind(this,'company')} id="tab_company">Company</a>
                    <a className="col-sm-4 col-md-2" onClick={this.tab.bind(this,'individual')} id="tab_individual">Individual</a>
                </div>
                <div className="col-sm-12 buyer_list" id="buyer_company">
                    <BuyerList type="company" dashboard={this.state.buyer_company} />
                </div>
                <div className="col-sm-12 buyer_list" id="buyer_individual">
                    <BuyerList type="individual" dashboard={this.state.buyer_individual} />
                </div>
            </div>
            <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href={window.location.href.indexOf("past")>0?"/admin/auction_results":(window.location.href.indexOf("unpublished")>0?"/admin/auctions/unpublished":"/admin/auctions/published")} >Back</a>
            </div>
        </div>
    )
  }
}

function run() {
    const domNode = document.getElementById('buyer_dashboard');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminBuyerDashboard),
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