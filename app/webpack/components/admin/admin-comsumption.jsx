import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import AdminComsumptionList from './admin_shared/admin-comsumption-list';
import AdminComsumptionPrice from './admin_shared/admin-comsumption-price';
import {getSearchType} from '../../javascripts/componentService/util';
export default class AdminComsumption extends Component {
  constructor(props){
    super(props);
    this.state={
        
    }
    this.pageType = getSearchType();
    this.comsumption_list = [
        {
            name:"Company Name 01",
            accounts:"6",
            lt_peak:"5431",
            lt_off_peak:"5431",
            hts_peak:"5431",
            hts_off_peak:"5431",
            htl_peak:"5431",
            htl_off_peak:"5431",
            unit:"kWh",
            table:[
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
            ]
        },
        {
            name:"Company Name 02",
            accounts:"5",
            lt_peak:"5431",
            lt_off_peak:"5431",
            hts_peak:"5431",
            hts_off_peak:"5431",
            htl_peak:"5431",
            htl_off_peak:"5431",
            unit:"kWh",
            table:[
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
            ]
        },
        {
            name:"Company Name 03",
            accounts:"4",
            lt_peak:"5431",
            lt_off_peak:"5431",
            hts_peak:"5431",
            hts_off_peak:"5431",
            htl_peak:"5431",
            htl_off_peak:"5431",
            unit:"kWh",
            table:[
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
            ]
        }
    ]
    if(this.pageType == "Views Company Comsumption Details"){
        this.price = {
            title:"Company",number:"4",accounts:"16"
        }
    }else{
        this.price = {
            title:"Individual",number:"3",accounts:"11"
        }
    }
}

componentDidMount() {
    
}
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
            <div className="col-sm-12 u-mb3">
                <AdminComsumptionList comsumption_list={this.comsumption_list} />
            </div>
            <div className="col-sm-5">
                <AdminComsumptionPrice price={this.price}  />
            </div>
            <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
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