import React, { Component } from 'react';
export class Showhistory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide",
            props_data:[],
            textVal:'',
            showWindow:false
        }
    }
    componentWillReceiveProps(next) {
        this.setState({textVal:''});
        if(next.detail){
            if(next.textdisabled && next.status){
                if(next.status[1] == "0"){
                    this.setState({textVal:"Rejected : "+decodeURI(next.detail)});
                }else{
                    this.setState({textVal:"Accepted : "+decodeURI(next.detail)});
                }                
            }else{
                this.setState({textVal:decodeURI(next.detail)});
            }           
        }
    }
    changeVal(e){
        let val=e.target.value;
        this.setState({textVal:val});
    }
    showModal(data){
        //console.log(data);
        this.setState({
            modalshowhide:"modal_show",
            props_data:data?data.details:[]
        })
    }
    closeModal(){
        //$(".detail_show").val("");
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    callbackVal(){
        this.props.editDetail(encodeURI($(".detail_show").val()));
        this.closeModal();
    }
    showWindow(){
        this.setState({
            showWindow:!this.state.showWindow
        })
    }
    render(){
        return(
            <div id="modal_history" className={this.state.modalshowhide}>
            {this.props.type === "history"?
                <div className="history_box">
                    <h4><span>History</span><a onClick={this.closeModal.bind(this)}>X</a></h4>
                    <div className="history_nr">
                    {this.state.props_data.map((item,index)=>{
                        return <dl key={index}>
                                    {item.propose_deviation && item.retailer_response ?
                                    <dd>
                                        <dfn><abbr></abbr>Retailer</dfn>
                                        <span>
                                            Proposed Deviation : {item.propose_deviation?decodeURI(item.propose_deviation):""}<br/>
                                            Response : {item.retailer_response?decodeURI(item.retailer_response):""}
                                        </span>
                                    </dd>:''}
                                    {item.sp_response?
                                    <dt>
                                        <dfn><abbr></abbr>SP</dfn>
                                        <span>{item.response_status == "0"?
                                        (item.sp_response?"Rejected : "+decodeURI(item.sp_response):""):
                                        (item.sp_response?"Accepted : "+decodeURI(item.sp_response):"")}</span>
                                    </dt>:''}
                                </dl>
                    })}
                    </div>
                </div>:<div className={this.state.showWindow?"history_box showbig":"history_box"}>
                        <h4><span>{this.props.title}</span><a onClick={this.closeModal.bind(this)}>X</a><a onClick={this.showWindow.bind(this)}>口</a></h4>
                        <textarea disabled={this.props.textdisabled} className="detail_show" value={this.state.textVal} onChange={this.changeVal.bind(this)}></textarea>
                        {this.props.textdisabled?"":<a className="detail_show_btn" onClick={this.callbackVal.bind(this)}>Save</a>}
                      </div>}
                
            </div>
        )
    }
}