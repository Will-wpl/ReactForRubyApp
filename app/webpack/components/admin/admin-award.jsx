import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {getLetterOfAward} from '../../javascripts/componentService/admin/service';
export default class AdminAward extends Component{
    constructor(props){
        super(props);
        this.state={
            awardList:[],
            contract_duration:6
        }
    }

    componentDidMount(){
        let thisId = window.location.href.split("auctions/")[1].split("/award")[0];
        this.setState({contract_duration:window.location.href.indexOf('contract_duration')>0?window.location.href.split('contract_duration=')[1]:null})
        getLetterOfAward(thisId,window.location.href.indexOf('contract_duration')>0?window.location.href.split('contract_duration=')[1]:null).then(resp=>{
            //console.log(resp)
            this.setState({awardList:resp})
        },error=>{

        })
    }

    downLoad(data,entity_id){
        //console.log(data);
        if(entity_id){
            window.open(`/api/admin/auctions/letter_of_award_pdf?auction_id=${data.auction_id}&user_id=${data.user_id}&contract_duration=${this.state.contract_duration}&entity_id=${entity_id}`);
        }else{
            window.open(`/api/admin/auctions/letter_of_award_pdf?auction_id=${data.auction_id}&user_id=${data.user_id}`);
        }

    }

    renderAwardList(data){
        return(
            data.map((e,i)=>{
                let status = e.acknowledge == 1 ? 1 : 2;
                return(
                    <li key={i} className="u-grid center ">
                        <span className="col-sm-4 white">{e.name}</span>
                        <span className="col-sm-4"><abbr className={'color'+status}></abbr></span>
                        <span className="col-sm-4 line15">
                            {e.entities?e.entities.map((it,k)=>{
                                return <div key={k} className="downLoadIcon" title={it.company_name} onClick={this.downLoad.bind(this,e,it.company_buyer_entity_id)}></div>
                            }):<div className="downLoadIcon" onClick={this.downLoad.bind(this,e,null)}></div>}

                        </span>
                    </li>
                )
            })
        )
    }

    render(){
        return(
            <div className="u-grid bidderStatus " >
                <ul className="bidders_list " style={{width:'45%'}}>
                    {this.renderAwardList(this.state.awardList)}
                </ul>
                <div className="color_show">
                    <label><dfn>Retailer: </dfn></label>
                    <label><span className="green"></span><dfn>Acknowledged</dfn></label>
                    <label><span className="yellow"></span><dfn>Pending</dfn></label>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/auction_results">Back </a>
                </div>
            </div>
        )
    }
}
function run() {
    const domNode = document.getElementById('Letter of Award');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminAward),
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