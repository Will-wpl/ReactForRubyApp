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
            allbtnStatus:true,retailer_list:[]
        }
        this.linklist = [
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflal.js",file_path:"#"},
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflalagag.pdf",file_path:"#"},
            {file_name:"appjafajfajhfohhnjnalflal.pdf",file_path:"#"},
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflaldhahhhahhhhahafaaw.xlcs",file_path:"#"}
        ]
        getRetailerList(sessionStorage.auction_id).then(res=>{
            console.log(res);
            this.setState({retailer_list:res});
        })
    }
    getPageindex(arrangement_id,name){
        getTendersCurrent('admin',arrangement_id).then(res=>{
            console.log(res);
            res.name=name;
            this.setState({current:res,page:res.current.current_node});
        })
    }
    showpage(index){
        let pageDom='';
        switch(index){
            case 0 : pageDom = <div></div>
            break
            case 1 : pageDom = <Adminretailerdashboard retailer_list={this.state.retailer_list} page={this.getPageindex.bind(this)} title="Retailer Dashboard" />
            break
            case 3 : pageDom = <Keppelproposedeviations current={this.state.current} page={this.getPageindex.bind(this)} title="keppel Propose Deviations" />
            break
            case 4 : pageDom = <Keppelformtender current={this.state.current} page={this.getPageindex.bind(this)}/>
            break
        }
        return pageDom;
    }
    componentWillMount(){
        getAuction('admin',sessionStorage.auction_id).then(res => {//sessionStorage.auction_id
            this.setState({auction:res})
        }, error => {
            //console.log(error);
        })
    }
    render (){
        return (
            <div className="col-sm-12">
                <TimeCuntDown auction={this.state.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}} timehidden="countdown_seconds" />
                {this.showpage(this.state.page)}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/auctions/published" >Back to List</a>
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