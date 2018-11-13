import React from 'react';
import ReactDOM from 'react-dom';
import {getHistoriesLast,auctionConfirm} from '../../javascripts/componentService/admin/service';
import {createWebsocket, getAuction} from '../../javascripts/componentService/common/service';
import {getArrangements, getHistories} from '../../javascripts/componentService/admin/service';
import {findUpLimit, getRandomColor, getStandardNumBref, isEmptyJsonObj} from '../../javascripts/componentService/util';
import {Modal} from '../shared/show-modal';
export default class ChooseAlternativeWinner extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            winnerData: [],
            currentRetailerData: [],
            selectedWinner: null,
            justification: '',
            winner: null,
            disabled: false,
            auction: {}, livetype: '6',
            live_auction_contracts: [],
            userid: '', fnStatus: 'win',
            resultarray:[],voidStatus:false
        }
    }
    componentDidMount(){
        let thisId = window.location.href.split("auctions/")[1].split("/choose_winner")[0];
        //console.log(thisId);
        getAuction('admin',thisId).then(resp=>{
            this.setState({auction:resp,userid:thisId});
            if(resp.live_auction_contracts){
                this.setState({
                    live_auction_contracts:resp.live_auction_contracts,
                    livetype:resp.live_auction_contracts[0].contract_duration
                });
            }
            this.refresh();
        })
    }
    refresh(){
        document.getElementById('badge').style.display = 'none'
        getHistoriesLast({ auction_id: this.state.auction.id}).then(resp=>{
            let data ,arr=[];
            if(resp.duration_6 || resp.duration_12 || resp.duration_24){
                resp.duration_6?arr.push(resp.duration_6):'';
                resp.duration_12?arr.push(resp.duration_12):'';
                resp.duration_24?arr.push(resp.duration_24):'';
                this.setState({resultarray:arr});
                this.goToresult();
                switch (this.state.livetype){
                    case '6' : data = resp.duration_6;
                        break;
                    case '12' : data = resp.duration_12;
                        break;
                    case '24' : data = resp.duration_24;
                        break;
                }
            }else{
                data=resp;
            }
            if(data.result){
                this.setState({disabled:true,justification:data.result.justification});
            }else{
                this.setState({disabled:false,voidStatus:false});
            }
            data.histories.map((item,index)=>{
                if(index==0){
                    item.disabled=true;

                }else{
                    item.disabled=false
                }
            })
            let e={
                data:{
                    user_id:data.histories.length>0?data.histories[0].user_id:null,
                    status:'win'
                },
                id:data.auction.id,
                index:0
            };
            //console.log(e);
            this.setState({winnerData:data.histories,selectedWinner:e,userid:data.histories.length>0?data.histories[0].user_id:null})
        })
    }
    liveTab(index){
        this.setState({livetype:index,justification:'',voidStatus:false});
        this.refresh();
    }
    showRetailer(data){
        this.refs.Modal.showModal();
        this.setState({currentRetailerData:data,text:''})
    }

    selectWinner(data,index){
       if(index==0){
           this.setState({justification:''},()=>{
               document.getElementById('badge').style.display = 'none'
           })
       }else{
           document.getElementById('badge').style.display = ''
       }
        let e={
            data:{
                user_id:data.user_id,
                status:'win'
            },
            id:data.auction_id,
            index:index
        };
        let winner = {
            name:data.company_name,
            ranking:data.ranking
        }
        this.setState({selectedWinner:e, winner,userid:data.user_id});
        this.state.winnerData.map((e,i)=>{
            e.disabled=false;
            if(i==index){
                e.disabled = true
            }
        });

    }

    getJustification(e){
        this.setState({justification:e.target.value})
    }

    submit(type){
        if(this.state.justification == "" && type != "win"){
            this.setState({
                text:'Please provide justification for voiding of auction.'},()=>{
                this.refs.Modal.showModal();
            })
            return;
        }
        let text = type==="win"?"Are you sure you want to confirm the winner?":"Are you sure you want to void this Reverse Auction exercise?";
        let data = this.state.selectedWinner;
        if(data.index != 0){
            if(this.state.justification == ''){
                this.setState({
                    currentRetailerData:[],
                    text:'Please provide justification for selection of alternate winner.'},()=>{
                    this.refs.Modal.showModal();
                })
            }else{
                this.setState({
                    currentRetailerData:[],
                    fnStatus:type,
                   text:text
                },()=>{
                    this.refs.Modal.showModal('comfirm');
                });
            }
        }else{
            this.setState({
                currentRetailerData:[],
                fnStatus:type,
                text:text
            },()=>{
                this.refs.Modal.showModal('comfirm');
            });
        }
    }
    void_auction(){
        auctionConfirm(
            {data: { user_id: this.state.userid , status:'void',contract_duration:this.state.livetype,justification:this.state.justification}, id:this.state.auction.id}).then(res=>{
            this.refs.Modal.showModal();
            this.setState({
                text:"You have voided this Reverse Auction exercise.",
                disabled:true,
                voidStatus:true
            });
            setTimeout(()=>{
                this.refresh();
            },3000)
        },error=>{

        })
    }
    acceptWinner(){
        //console.log('sure');
        let timeFn;
        let data = this.state.selectedWinner;
        data.data.justification = this.state.justification;
        data.data.contract_duration = this.state.livetype;
        delete data.index;
        auctionConfirm(data).then(resp=>{
            clearTimeout(timeFn);
            this.refs.Modal.showModal();
            this.setState({
                text:'Congratulations! Reverse Auction winner has been confirmed.',
                disabled:true
            });
            timeFn = setTimeout(()=> {
                this.refresh();
            },2000)
        })
    }
    goToresult(){
        let thisId = window.location.href.split("auctions/")[1].split("/choose_winner")[0];
        // console.log(this.state.resultarray);
        let turly = this.state.resultarray.find(item=>{
            return item.result == null;
        })
        if(!turly){
            window.location.href = `/admin/auctions_results`;///admin/auctions/${thisId}/result
        }
    }
    renderWinner(){
        if(this.state.winnerData.length != 0){
            if(this.state.winner == null){
                return(
                    <p>Default Winner: {this.state.winnerData[0].company_name}</p>
                )
            }else{
                if(this.state.winner.ranking == 1){
                    return(
                        <p>Default Winner: {this.state.winner.name}</p>
                    )
                }else{
                    return(
                        <p>Alternate Winner: {this.state.winner.name}</p>
                    )
                }
            }
        }
    }

    render(){
        let winnerData = this.state.winnerData;
        let thisId = window.location.href.split("auctions/")[1].split("/choose_winner")[0];
        let href = `/admin/auctions/${thisId}/confirm`;
        return(
            <div>
                {this.state.live_auction_contracts.length>0?
                    <div className="u-grid u-mt2 u-mb2 mouth_tab">
                        {
                            this.state.live_auction_contracts.map((item,index)=>{
                                return <div key={index} className={"col-sm-12 col-md-3 u-cell"}>
                                    <a className={this.state.livetype===item.contract_duration?"col-sm-12 lm--button lm--button--primary selected"
                                        :"col-sm-12 lm--button lm--button--primary"}
                                       onClick={this.liveTab.bind(this,item.contract_duration)} >{item.contract_duration} Months</a>
                                </div>
                            })
                        }
                    </div>:''}
                <div className='lm--card alternative-winner'>
                    <h2>Retailer Ranking</h2>
                    <div style={{marginBottom:'10px',marginTop:'-10px',fontSize:'16px'}}>{this.renderWinner()}</div>
                    {winnerData.length>0?<table className="retailer_fill w_100">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Retailer</th>
                            <th>Price</th>
                            <th> </th>
                        </tr>
                        </thead>
                        <tbody>
                        {winnerData.map((e,i)=>{
                            return(
                                <tr key={i}>
                                    <td>{e.ranking}</td>
                                    <td>{e.company_name}</td>
                                    <td onClick={this.showRetailer.bind(this,e)} style={{cursor:'pointer'}}>
                                        $ {parseFloat(e.average_price).toFixed(4)}/kWh
                                    </td>
                                    <td>
                                        <button
                                            disabled={this.state.disabled?true:e.disabled}
                                            className="lm--button lm--button--primary"
                                            onClick={this.selectWinner.bind(this,e,i)} >Select
                                        </button>
                                    </td>
                                </tr>
                            )})
                        }
                        </tbody>
                    </table>:<div>No Data</div>}


                    <div className="retailor_justification">
                        <h2><abbr id='badge'>*</abbr>Justification</h2>
                        <textarea disabled={this.state.disabled?true:(this.state.voidStatus?true:false)}
                            value={this.state.justification }
                            onChange={this.getJustification.bind(this)}
                        />
                        <button disabled={this.state.disabled}
                            onClick={this.submit.bind(this,'void')}
                            className="lm--button lm--button--primary u-mt2"
                        >Void Reverse Auction</button>
                        {winnerData.length>0?<button disabled={this.state.disabled}
                                                     onClick={this.submit.bind(this,'win')}
                                                     className="lm--button lm--button--primary u-mt2">Confirm Winner</button>:''}
                    </div>
                    <Modal
                        text={this.state.text}
                        listdetail={this.state.currentRetailerData}
                        acceptFunction={this.state.fnStatus==='win'?this.acceptWinner.bind(this):this.void_auction.bind(this)}
                        listdetailtype='Alternative Winner'
                        ref="Modal"
                    />
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href={href} >Back</a>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('Choose winner page');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(ChooseAlternativeWinner),
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