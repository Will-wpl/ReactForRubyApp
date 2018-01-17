import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Workflowtab} from '../shared/work-flow-tab'
import {Signconfidentialityundertaking} from './workflow/sign-confidentiality-undertaking';
import {Tenderdocuments} from './workflow/tender-documents';
import {Proposedeviations} from './workflow/propose-deviations';
import {Submittender} from './workflow/submit-tender';
import {RetailerManage} from '../retailer/retailer-manage-coming'
import {getAuction,getTendersCurrent} from '../../javascripts/componentService/common/service';

export class Retailerworkflow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            auction:{},text:'',
            selected:0,current:{},
            page:1
        }
        this.linklist = [
            {file_name:"app.js",file_path:"#"},
            {file_name:"app.js",file_path:"#"},
            {file_name:"app.js",file_path:"#"},
            {file_name:"app.js",file_path:"#"}
        ]
        this.deviations = false;
        this.submittender = false;
        this.hiddentimeCount = true;
    }
    componentDidMount() {
        getAuction('retailer',sessionStorage.auction_id).then(res=>{
            this.setState({auction:res});
        },error=>{

        })
        getTendersCurrent('retailer',sessionStorage.arrangement_id).then(res=>{
            console.log(res);
            this.setState({current:res});
        },error=>{

        })
    }
    getPageindex(index){
        this.setState({page:index});
    }
    showpage(index){
        let pageDom='';
        switch(index){
            case 1 : pageDom = <Signconfidentialityundertaking index={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction}/>
            break
            case 2 : pageDom = <Tenderdocuments index={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} linklist={this.linklist} />
            break
            case 3 : pageDom = <Proposedeviations index={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} tender={this.deviations} />
            break
            case 4 : pageDom = <Submittender index={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} submit={this.submittender}/>
            break
            case 5 : pageDom = <RetailerManage index={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} hiddentimeCount={this.hiddentimeCount}/>
            break
        }
        return pageDom;
    }
    render(){
        return(
            <div>
                <Workflowtab auction={this.state.auction} selected={this.state.selected} />
                {this.showpage(this.state.page)}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('Retailerworkflow');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(Retailerworkflow),
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