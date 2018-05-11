import React, { Component } from 'react';
export class Showhistory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide",
            props_data:[],
            ratailer_name:'',
            textVal:'',
            showWindow:false
        }
    }
    componentWillReceiveProps(next) {
        this.setState({textVal:''});
        this.checkShowdetail(next);
        if(next.type === "history"){
            setTimeout(()=>{
                $(".history_nr textarea").css("height","auto");
                $(".history_nr textarea").each((e)=>{
                    $(".history_nr textarea").eq(e).height($(".history_nr textarea")[e].scrollHeight-10);
                })
            },200)
        }
    }
    clearTextarea(){
        $(".detail_show").val("");
    }
    checkShowdetail(next){
        if(next.textdisabled && next.status){
            if(next.status[1] == "0"){
                this.setState({textVal:"Rejected : \n"+decodeURI(next.detail)});
            }else if(next.status[1] == "1"){
                this.setState({textVal:"Accepted : \n"+decodeURI(next.detail)});
            }else{
                this.setState({textVal:next.detail!=null?decodeURI(next.detail):''});
            }                
        }else{
            if(next.detail){
                this.setState({textVal:next.detail!=null?decodeURI(next.detail):''});
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
            props_data:data?data.details:[],
            ratailer_name:data?data.retailer_name:''
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
                <div className={this.state.showWindow?"history_box showbig":"history_box"}>
                    <h4><span>History</span><a onClick={this.closeModal.bind(this)}>X</a><a onClick={this.showWindow.bind(this)}>口</a></h4>
                    <div className="history_nr">
                    {this.state.props_data.map((item,index)=>{
                        return <dl key={index}>
                                    {item.propose_deviation ?
                                    <dd>
                                        <dfn><abbr></abbr>{this.state.ratailer_name}</dfn>
                                        <span>
                                            <b>Proposed Deviation : </b><textarea className={"devation_text_"+index} readOnly="readOnly" defaultValue={item.propose_deviation?decodeURI(item.propose_deviation):""}/><br/>
                                            <b>Comments : </b><textarea className={"comments_text_"+index} readOnly="readOnly" defaultValue={item.retailer_response?decodeURI(item.retailer_response):""}/>
                                        </span>
                                    </dd>:''}
                                    {item.sp_response!=null?
                                    <dt>
                                        <dfn><abbr></abbr>SP Group</dfn>
                                        {item.response_status == "0"?
                                        <span className={item.sp_response===""?"short":""}><b>Rejected : </b>{item.sp_response===""?"":<textarea className={"sp_text_"+index} readOnly="readOnly" defaultValue={decodeURI(item.sp_response)} />}</span>:
                                        <span className={item.sp_response===""?"short":""}><b>Accepted : </b>{item.sp_response===""?"":<textarea className={"sp_text_"+index} readOnly="readOnly" defaultValue={decodeURI(item.sp_response)} />}</span>}
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