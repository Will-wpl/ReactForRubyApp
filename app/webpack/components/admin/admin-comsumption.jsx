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
        detail:[]
    }
    // this.comsumption_list = [
    //     {
    //         name:"Company Name 01",
    //         accounts:"6",
    //         lt_peak:"5431",
    //         lt_off_peak:"5431",
    //         hts_peak:"5431",
    //         hts_off_peak:"5431",
    //         htl_peak:"5431",
    //         htl_off_peak:"5431",
    //         unit:"kWh",
    //         table:[
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
    //         ]
    //     },
    //     {
    //         name:"Company Name 02",
    //         accounts:"5",
    //         lt_peak:"5431",
    //         lt_off_peak:"5431",
    //         hts_peak:"5431",
    //         hts_off_peak:"5431",
    //         htl_peak:"5431",
    //         htl_off_peak:"5431",
    //         unit:"kWh",
    //         table:[
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
    //         ]
    //     },
    //     {
    //         name:"Company Name 03",
    //         accounts:"4",
    //         lt_peak:"5431",
    //         lt_off_peak:"5431",
    //         hts_peak:"5431",
    //         hts_off_peak:"5431",
    //         htl_peak:"5431",
    //         htl_off_peak:"5431",
    //         unit:"kWh",
    //         table:[
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
    //             {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
    //         ]
    //     }
    // ]
}

componentDidMount() {
    getBuyerDetails({id:sessionStorage.auction_id,type:this.datail_type}).then(res=>{
        console.log(res);
        this.setState({
            comsumption_list:res.list,
            price:res.total_info
        })
    },error=>{

    })
}
show_detail(index,consumption_id){
    getBuyerDetailsConsumptions({id:consumption_id}).then(res=>{
        console.log(res);
        this.setState({
            detail:res,
        })
        $("#comsumption_list_table_"+index).slideToggle(300);
    },error=>{

    })
    
}
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
            <div className="col-sm-12 u-mb3">
                <AdminComsumptionList table={this.state.detail} type={this.pageType} comsumption_list={this.state.comsumption_list} detail={this.show_detail.bind(this)} />
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