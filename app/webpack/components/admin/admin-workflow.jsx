import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getAuction} from '../../javascripts/componentService/common/service';
import {Adminretailerdashboard} from '../admin/workflow/retailer-dashboard';
import {Keppelproposedeviations} from '../admin/workflow/keppel-propose-deviations';
import {Keppelformtender} from '../admin/workflow/keppel-form-tender';
import moment from 'moment';

export class Adminworkflow extends Component {
    constructor(props, context){
        super(props);
        this.state={
            auction:{},
            disabled:false,
            allbtnStatus:true
        }
        this.linklist = [
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflal.js",file_path:"#"},
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflalagag.pdf",file_path:"#"},
            {file_name:"appjafajfajhfohhnjnalflal.pdf",file_path:"#"},
            {file_name:"appjafajfajfahsfhafiuahfohhnjnalflaldhahhhahhhhahafaaw.xlcs",file_path:"#"}
        ]
    }
    componentDidMount(){
        
    }
    
    componentWillMount(){
        getAuction('admin',1).then(res => {//sessionStorage.auction_id
            this.setState({auction:res})
        }, error => {
            //console.log(error);
        })
    }
    render (){
        return (
            <div className="col-sm-12">
                <TimeCuntDown auction={this.state.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}} timehidden="countdown_seconds" />
                <Adminretailerdashboard title="Retailer Dashboard" />
                <Keppelproposedeviations title="keppel Propose Deviations" />
                <Keppelformtender title="keppel - Form of Tender" linklist={this.linklist}/>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
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