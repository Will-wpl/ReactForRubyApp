import React from 'react';
import ReactDOM from 'react-dom';
import {getHistoriesLast,auctionConfirm} from '../../javascripts/componentService/admin/service';
import {createWebsocket, getAuction} from '../../javascripts/componentService/common/service';
import {getArrangements, getHistories} from '../../javascripts/componentService/admin/service';
import {findUpLimit, getRandomColor, getStandardNumBref, isEmptyJsonObj} from '../../javascripts/componentService/util';
import {Modal} from '../shared/show-modal';
export default class ChooseAlternativeWinner extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            winnerData:[],
            currentRetailerData:[],
            selectedWinner:null,
            justification:'',
            winner:null,
            disabled:false,
        }
    }

    componentDidMount(){
        let thisId = window.location.href.split("auctions/")[1].split("/choose_winner")[0];
        //console.log(thisId);
        document.getElementById('badge').style.display = 'none'
        getAuction('admin',thisId).then(resp=>{
            //console.log(resp);
            let actionId = resp.id;
            getHistoriesLast({ auction_id: actionId}).then(resp=>{
                let data = resp.histories;
                data.map((item,index)=>{
                    if(index==0){
                        item.disabled=true;

                    }else{
                        item.disabled=false
                    }
                })
                let e={
                    data:{
                        user_id:data[0].user_id,
                        status:'win'
                    },
                    id:data[0].auction_id,
                    index:0
                };
                //console.log(e);
                this.setState({winnerData:data,selectedWinner:e})
            })
        })
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
        this.setState({selectedWinner:e, winner,disabled:true});
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

    submit(){
        let timeFn;
        let data = this.state.selectedWinner;
        if(data.index != 0){
            if(this.state.justification == ''){
                this.setState({
                    currentRetailerData:[],
                    text:'Please fill out this field.'},()=>{
                    this.refs.Modal.showModal();
                })
            }else{
                this.setState({
                    currentRetailerData:[],
                   text:'Are you sure you want to confirm the winner?'
                },()=>{
                    this.refs.Modal.showModal('comfirm');
                });
            }
        }else{
            this.setState({
                currentRetailerData:[],
                text:' Are you sure you want to confirm the winner?'
            },()=>{
                this.refs.Modal.showModal('comfirm');
            });
        }
    }

    acceptWinner(){
        //console.log('sure');
        let thisId = window.location.href.split("auctions/")[1].split("/choose_winner")[0];
        let timeFn;
        let data = this.state.selectedWinner;
        data.data.justification = this.state.justification;
        delete data.index;
        auctionConfirm(data).then(resp=>{
            clearTimeout(timeFn);
            this.refs.Modal.showModal();
            this.setState({
                text:'Congratulations! Reverse Auction winner has been confirmed.'
            });
            timeFn = setTimeout(()=> {
                window.location.href = `/admin/auctions/${thisId}/result`;
            },2000)
        })
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
                <div className='lm--card alternative-winner'>
                    <h2>Retailer Ranking</h2>
                    <div style={{marginBottom:'10px',marginTop:'-10px',fontSize:'16px'}}>{this.renderWinner()}</div>
                    <table className="retailer_fill w_100">
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
                                            disabled={e.disabled}
                                            className="lm--button lm--button--primary"
                                            onClick={this.selectWinner.bind(this,e,i)} >Select
                                        </button>
                                    </td>
                                </tr>
                            )})
                        }
                        </tbody>
                    </table>

                    <div className="retailor_justification">
                        <h2><abbr id='badge'>*</abbr>Justification</h2>
                        <textarea
                            value={this.state.justification }
                            onChange={this.getJustification.bind(this)}
                        />
                        <button
                            onClick={this.submit.bind(this)}
                            className="lm--button lm--button--primary submit"
                        >Confirm Winner</button>
                    </div>
                    <Modal
                        text={this.state.text}
                        listdetail={this.state.currentRetailerData}
                        acceptFunction={this.acceptWinner.bind(this)}
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