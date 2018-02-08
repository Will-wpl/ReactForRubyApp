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
            auction:{},text:'',disabled:false,
            selected:[],current:{},page:0,tender_status:false,tab_page:0
        }
        this.submittender = false;
        this.hiddentimeCount = true;
        this.getPageindex();
    }
    componentDidMount() {
        getAuction('retailer',sessionStorage.auction_id).then(res=>{
            this.setState({auction:res});
            console.log(res);
        },error=>{

        })
    }
    getPageindex(params){
        if(params === 'false'){
            this.setState({
                tender_status:false
            })
        }
        getTendersCurrent('retailer',sessionStorage.arrangement_id).then(res=>{
            console.log(res);
            this.setState({current:res,tab_page:res.current.current_node?res.current.current_node:1,page:res.current.current_node?res.current.current_node:1,selected:res.flows});
        },error=>{

        })
    }
    showpage(index){
        let pageDom='';
        switch(index){
            case 0 : pageDom = <div></div>
            break
            case 1 : pageDom = <Signconfidentialityundertaking propsdisabled={this.state.disabled} page={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction}/>
            break
            case 2 : pageDom = <Tenderdocuments propsdisabled={this.state.disabled} page={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} />
            break
            case 3 : pageDom = <Proposedeviations propsdisabled={this.state.disabled} page={this.getPageindex.bind(this)} current={this.state.current} tenderFn={()=>{this.setState({tender_status:true})}} auction={this.state.auction} tender={this.state.tender_status} />
            break
            case 4 : pageDom = <Submittender propsdisabled={this.state.disabled} page={this.getPageindex.bind(this)} tenderFn={()=>{this.setState({tender_status:true})}} tender={this.state.tender_status} current={this.state.current} auction={this.state.auction} submit={this.submittender}/>
            break
            case 5 : pageDom = <RetailerManage propsdisabled={this.state.disabled} page={this.getPageindex.bind(this)} current={this.state.current} auction={this.state.auction} hiddentimeCount={this.hiddentimeCount} node={true}/>
            break
        }
        return pageDom;
    }
    changePage(index){
        let selectedObj = $(".step"+index).find("span").attr("class");
        if(selectedObj === "selected"){
            this.setState({page:index,disabled:true});
        }else if(selectedObj === "pending"){
            this.setState({page:index,disabled:false,tender_status:false});
        }else{
            if(this.state.tab_page == index){
                this.setState({page:index,disabled:false,tender_status:false});
            }else{
                this.setState({disabled:false});
            }
        }
    }
    render(){
        return(
            <div>
                <Workflowtab auction={this.state.auction} page={this.changePage.bind(this)} current={this.state.current} selected={this.state.selected} />
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