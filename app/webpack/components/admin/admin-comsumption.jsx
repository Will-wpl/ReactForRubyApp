import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import AdminComsumptionList from './admin_shared/admin-comsumption-list';
import AdminComsumptionPrice from './admin_shared/admin-comsumption-price';
import {getSearchType} from '../../javascripts/componentService/util';
import {getBuyerDetails,getBuyerDetailsConsumptions} from '../../javascripts/componentService/admin/service';
export default class AdminComsumption extends Component {
  constructor(props){
    super(props);
    this.pageType = getSearchType();
    if(this.pageType.indexOf('Company')>0){
        this.datail_type = '2';
    }else{
        this.datail_type = '3';
    }
    this.state={
        comsumption_list:[],
        price:{},
        detail:[],
        detail_index:0
    }
}

componentDidMount() {
      let role = window.location.href.indexOf('admin')>0?'admin':(window.location.href.indexOf('retailer')>0?'retailer':'admin');
    getBuyerDetails({id:sessionStorage.auction_id,type:this.datail_type,role:role,contract_duration:window.location.href.split('duration=')[1]}).then(res=>{
        //console.log(res);
        this.setState({
            comsumption_list:res.list,
            price:res.total_info
        })
    },error=>{

    })
}
show_detail(index,consumption_id){
    let obj = $("#comsumption_list_table_"+index);
    if(obj.is(":visible")){
        obj.prev().removeClass("open");
        obj.slideUp(300);
    }else{
        obj.prev().addClass("open");
        obj.slideDown(300);
    }
}
render() {
    return (
        <div className="u-grid mg0">
            <div className="col-sm-12 u-mb3">
                <AdminComsumptionList table={this.state.detail} detail_index={this.state.detail_index} type={this.pageType} comsumption_list={this.state.comsumption_list} detail={this.show_detail.bind(this)} />
            </div>
            <div className="col-sm-5">
                <AdminComsumptionPrice type={this.pageType} price={this.state.price}  />
            </div>
            <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="javascript:javascript:self.location=document.referrer;" >Back</a>
            </div>
        </div>
    )
  }
}

function run() {
    const domNode = document.getElementById('admin_comsumption');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminComsumption),
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