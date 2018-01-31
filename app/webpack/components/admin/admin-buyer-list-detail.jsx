import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import AdminComsumptionList from './admin_shared/admin-comsumption-list';
import AdminComsumptionPrice from './admin_shared/admin-comsumption-price';
import {getSearchType} from '../../javascripts/componentService/util';
import {getAdminBuyerListDetails} from '../../javascripts/componentService/admin/service';
export default class AdminBuyerListDetail extends Component {
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
    this.type = sessionStorage.getItem('comsumptiontype');
    if (this.type === 'company') {
        this.type = 'View Company Consumption Details'
    }
}

componentDidMount() {
    getAdminBuyerListDetails(window.location.href.split("consumptions/")[1]).then(res=>{
        console.log(res);
        this.setState({
            comsumption_list:[res],
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
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
            <div className="col-sm-12 u-mb3">
                <AdminComsumptionList visible="visible" comsumption_list={this.state.comsumption_list} detail={this.show_detail.bind(this)} type={this.type} />
            </div>
            <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="javascript:javascript:self.location=document.referrer;" >Back</a>
            </div>
        </div>
    )
  }
}

function run() {
    const domNode = document.getElementById('admin_buyer_list_detail');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminBuyerListDetail),
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