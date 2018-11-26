import React from 'react';
import ReactDOM from 'react-dom';
import {getLetterOfAward,retailerAcknowledge,retailerAllAcknowledge} from "../../javascripts/componentService/retailer/service";
import {Modal} from '../shared/show-modal';
export default class RetailerLetterOfAward extends React.Component{
    constructor(props){
        super(props);
        this.state={
            letterOfAward:[],
            text:'',
            currentData:null,
            currentIndex:null,
            acknowledgeAllBtn:true
        };
    }

    componentDidMount(){
        let id = window.location.href.split("retailer/")[1].split("auctions/")[1].split('/')[0];
        let duration=window.location.href.indexOf("duration")>0?window.location.href.split("duration=")[1]:'';
        //console.log(id);
        getLetterOfAward(id,duration).then(resp=>{
           // console.log(resp);
            resp.map((e,i)=>{
                e.acknowledge==1 ? e.disabled=true:e.disabled=false
            });
            //console.log(resp);
            this.setState({letterOfAward:resp});
            let btnDisabled = true;
            for(let i in resp){
                if(resp[i].acknowledge != 1){
                    btnDisabled=false;
                    break;
                }
            }
            this.setState({acknowledgeAllBtn:btnDisabled});
            this.forceUpdate()
        })
    }

    acknowledged(data,index){
        this.setState({
            text:'Are you sure you want to acknowledge?',
            currentData:data,
            currentIndex:index},()=>{
            this.refs.Modal.showModal('comfirm');
        });

    }

    acknowledgeAll(){
        this.setState({
            text:'Are you sure you want to acknowledge?',
            currentData:null,
            currentIndex:null},()=>{
            this.refs.Modal.showModal('comfirm');
        });
        this.forceUpdate()
    }

    acknowledgeRetailer(){
      // console.log(this.state.currentData);
       let id = this.state.currentData.id;
       retailerAcknowledge(id).then(resp => {
           this.state.letterOfAward[this.state.currentIndex].disabled = true;
           this.state.letterOfAward[this.state.currentIndex].acknowledge = 1;
           let btnDisabled = true;
           for (let i in this.state.letterOfAward){
                   if(this.state.letterOfAward[i].acknowledge != 1){
                       btnDisabled = false
                   }
               }
           this.setState({acknowledgeAllBtn:btnDisabled});
           this.forceUpdate()
       })
    }

    acknowledgeAllRetailer(){
        let list = [];
        this.state.letterOfAward.map((e,i)=>{
            list.push(e.id);
        });
        retailerAllAcknowledge({ids: list}).then(resp=>{
           this.setState({acknowledgeAllBtn:true});
            this.state.letterOfAward.map((e,i)=>{
                 e.disabled = true
            });
            this.forceUpdate()
        },error=>{
            console.log(error)
        })
    }
    download(data,id){
        if(id){
            let duration=window.location.href.indexOf("duration")>0?window.location.href.split("duration=")[1]:'';
            window.open(`/api/retailer/auctions/letter_of_award_pdf?auction_id=${data.auction_id}&user_id=${data.user_id}&entity_id=${id}&contract_duration=${duration}`);
        }else{
            window.open(`/api/retailer/auctions/letter_of_award_pdf?auction_id=${data.auction_id}&user_id=${data.user_id}`);
        }

    }

    renderAwardList(data){
        return(
            data.map((e,i)=>{
                return(
                    <li key={i} className="u-grid center ">
                        <span className="col-sm-6 white">{e.name}</span>
                        <span className="col-sm-6 line15">
                            {e.entities?e.entities.map((it,k)=>{
                                return <div key={k} className="downLoadIcon downLoadIconL" onClick={this.download.bind(this,e,it.company_buyer_entity_id)}>{it.company_name}</div>
                            }):<div className="downLoadIcon" onClick={this.download.bind(this,e,null)}>{e.name}</div>}
                        </span>
                        {/* <span className="col-sm-4 ">
                            <button style={{"color":"#fff"}}
                                disabled={e.disabled}
                                className="lm--button lm--button--primary"
                                onClick={this.acknowledged.bind(this,e,i)}
                            >
                                Acknowledge
                            </button>
                        </span> */}
                    </li>
                )
            })
        )
    }

    render(){
        return(
            <div>
                <div className= "bidderStatus">
                    <ul className="bidders_list " >
                        {this.renderAwardList(this.state.letterOfAward)}
                    </ul>
                </div>
                {/* <div className="all">
                    <button
                        disabled={this.state.acknowledgeAllBtn}
                        className="lm--button lm--button--primary"
                        onClick={this.acknowledgeAll.bind(this)}
                    >
                        Acknowledge All
                    </button>
                </div> */}
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/retailer/auction_results">Back</a>
                </div>
                <Modal
                    text={this.state.text}
                    ref="Modal"
                    acceptFunction={this.state.currentData?this.acknowledgeRetailer.bind(this):this.acknowledgeAllRetailer.bind(this)}
                />
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('Retailer Letter of Award');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerLetterOfAward),
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