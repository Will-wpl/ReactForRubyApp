import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuction,getTendersCurrent,getBuyerRetailerList} from '../../javascripts/componentService/common/service';
import {Buyerretailerdashboard} from './workflow/buyer-retailer-dashboard';
import {BuyerKeppelproposedeviations} from './workflow/buyer-keppel-propose-deviations';
import {Keppelformtender} from '../admin/workflow/keppel-form-tender';
import moment from 'moment';

export class Buyerworkflow extends Component {
    constructor(props, context){
        super(props);
        this.state={
            auction:{},
            disabled:false,current:{},page:1,
            allbtnStatus:true,retailer_list:[],readOnly:false,
            step_counts:[],role_name:""
        }
        getBuyerRetailerList(sessionStorage.auction_id).then(res=>{
            //console.log(res);
            this.setState({retailer_list:res.tenders,step_counts:res.step_counts,readOnly:res.user_info.readOnly,role_name:res.user_info.current_user.company_name});
        })
    }
    getPageindex(arrangement_id,name,type,index){
        getTendersCurrent('buyer',arrangement_id).then(res=>{
            //console.log(res);
            res.name=name;
            if(index==3||index==4){
                this.setState({current:res,page:index,readOnly:!type});
            }else{
                this.setState({current:res,page:res.current.current_node,readOnly:!type});
            }
            if(window.location.href.indexOf("past")>0){
                this.setState({readOnly:true});
            }
        })
    }
    showpage(index){
        let pageDom='';
        switch(index){
            case 0 : pageDom = <div></div>
            break
            case 1 : pageDom = <Buyerretailerdashboard step_counts={this.state.step_counts} retailer_list={this.state.retailer_list} page={this.getPageindex.bind(this)} title="Retailer Dashboard" />
            break
            case 3 : pageDom = <BuyerKeppelproposedeviations name={this.state.role_name} current={this.state.current} readOnly={this.state.readOnly} page={this.getPageindex.bind(this)} title="keppel Propose Deviations" />
            break
            // case 4 : pageDom = <Keppelformtender current={this.state.current} readOnly={this.state.readOnly} page={this.getPageindex.bind(this)}/>
            // break
        }
        return pageDom;
    }
    componentWillMount(){
        getAuction('buyer',sessionStorage.auction_id).then(res => {
            this.setState({auction:res})
        }, error => {
        })
    }
    render (){
        return (
            <div className="col-sm-12">
                <TimeCuntDown auction={this.state.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}} timehidden="countdown_seconds" />
                {this.showpage(this.state.page)}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href={window.location.href.indexOf("past")>0?"/buyer/auction_results":"/buyer/auctions/published"} >Back</a>
                </div>
            </div>
        )}
    }

    function run() {
        const domNode = document.getElementById('buyer_workflow');
        if(domNode !== null){
            ReactDOM.render(
                React.createElement(Buyerworkflow),
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