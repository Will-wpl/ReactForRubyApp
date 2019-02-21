import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuction,getTendersCurrent} from '../../javascripts/componentService/common/service';
import {getRetailerList} from '../../javascripts/componentService/admin/service';
import {Adminretailerdashboard} from '../admin/workflow/retailer-dashboard';
import {Keppelproposedeviations} from '../admin/workflow/keppel-propose-deviations';
import {Keppelformtender} from '../admin/workflow/keppel-form-tender';
import moment from 'moment';

export class Adminworkflow extends Component {
    constructor(props, context){
        super(props);
        this.state={
            auction:{},
            disabled:false,current:{},page:1,
            allbtnStatus:true,retailer_list:[],readOnly:true,
            step_counts:[],role_name:""
        }
        getRetailerList(sessionStorage.auction_id).then(res=>{
            //console.log(res);
            this.setState({retailer_list:res.tenders,step_counts:res.step_counts,readOnly:res.user_info.readonly});
        })
    }
    getPageindex(arrangement_id,name,type,index){
        getTendersCurrent('admin',arrangement_id).then(res=>{
            //console.log(res);
            res.name=name;
            if(index==3||index==4){
                this.setState({current:res,page:index,readOnly:true,role_name:res.user_info.name});//!type
            }else{
                this.setState({current:res,page:res.current.current_node,readOnly:true,role_name:res.user_info.name});//!type
            }
            getRetailerList(sessionStorage.auction_id).then(re=>{
                this.setState({readOnly:true});//re.user_info.readonly
            })
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
            case 1 : pageDom = <Adminretailerdashboard step_counts={this.state.step_counts} retailer_list={this.state.retailer_list} page={this.getPageindex.bind(this)} title="Retailer Dashboard" />
            break
            case 3 : pageDom = <Keppelproposedeviations current={this.state.current} role_name={this.state.role_name} readOnly={this.state.readOnly} page={this.getPageindex.bind(this)} title="keppel Propose Deviations" />
            break
            // case 4 : pageDom = <Keppelformtender current={this.state.current} readOnly={this.state.readOnly} page={this.getPageindex.bind(this)}/>
            // break
        }
        return pageDom;
    }
    componentWillMount(){
        getAuction('admin',sessionStorage.auction_id).then(res => {
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
                    <a className="lm--button lm--button--primary u-mt3" href={window.location.href.indexOf("past")>0?"/admin/auction_results":"/admin/auctions/published"} >Back</a>
                </div>
            </div>
        )}
    }

    function run() {
        const domNode = document.getElementById('admin_workflow');
        if(domNode !== null){
            ReactDOM.render(
                React.createElement(Adminworkflow),
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