import React, { Component } from 'react';
import E from 'wangeditor'
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
    }
    componentDidUpdate(next){
        if(next.type === "history"){
            this.autoHeight("history_nr textarea");
            this.historyTohtml(this.state.props_data);
        }
    }
    autoHeight(obj){
        $("."+obj).css("height","auto");
        $("."+obj).each((e)=>{
            $("."+obj).eq(e).height($("."+obj)[e].scrollHeight-10);
        })
    }
    historyTohtml(data){
        if(data.length>0){
            data.map((item,index)=>{
                $(".devation_text_"+index).html(item.propose_deviation);
                $(".comments_text_"+index).html(item.retailer_response);
                $(".sp_text_"+index).html(item.sp_response);
            })
        }
    }
    clearTextarea(){
        $(".detail_show").val("");
    }
    checkShowdetail(next){
        if(next.textdisabled && next.status){
            if(next.status[1] == "0"){
                $("#detail_show").html("Rejected : <br/>"+next.detail);
                $(".w-e-text p").html("Rejected : <br/>"+next.detail);
                //this.setState({textVal:"Rejected : \n"+decodeURI(next.detail)});
            }else if(next.status[1] == "1"){
                $("#detail_show").html("Accepted : <br/>"+next.detail);
                $(".w-e-text p").html("Accepted : <br/>"+next.detail);
                //this.setState({textVal:"Accepted : \n"+decodeURI(next.detail)});
            }else{
                $("#detail_show").html(next.detail!=null?(next.detail):'');
                $(".w-e-text p").html(next.detail!=null?(next.detail):'');
                //this.setState({textVal:next.detail!=null?decodeURI(next.detail):''});
            }
        }else{
            if(next.detail){
                $("#detail_show").html(next.detail!=null?(next.detail):'');
                $(".w-e-text p").html(next.detail!=null?(next.detail):'');
                //this.setState({textVal:next.detail!=null?decodeURI(next.detail):''});
            }
        }
    }
    changeVal(e){
        let val=e.target.value;
        this.setState({textVal:val});
    }
    showModal(data,type){
        if(type == "propose"){
            //if ($("#deviation_body").length>0) {
                let editor = new E('#deviation_body');
                setTimeout(() => { editor.create() });
            //}
            setTimeout(() => { $(".w-e-text").html("").html(this.props.detail==""?"<p></p>":this.props.detail) }, 100);
        }else{
            this.setState({props_data:[]});
            this.setState({
                props_data:data?data.details:[],
                ratailer_name:data?data.retailer_name:''
            })
        }
        this.setState({modalshowhide:"modal_show"});

        //console.log(data);

    }
    closeModal(){
        //$(".detail_show").val("");
        $('#deviation_body').html("");
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    callbackVal(){
        this.props.editDetail($(".w-e-text").html());
        this.closeModal();
    }
    showWindow(){
        this.setState({
            showWindow:!this.state.showWindow
        })
    }
    showHtml(className,val){
        console.log(val);
        let html = `<div>${val}</div>`;
        return html
    }
    render(){
        return(
            <div id="modal_history" className={this.state.modalshowhide}>
            {this.props.type === "history"?
                <div className={this.state.showWindow?"history_box showbig":"history_box"}>
                    <h4 className={"title"}><span>History</span><a onClick={this.closeModal.bind(this)}>X</a><a onClick={this.showWindow.bind(this)}>口</a></h4>
                    <div className="history_nr">
                    {this.state.props_data.map((item,index)=>{
                        return <dl key={index}>
                                    {item.propose_deviation ?
                                    <dd>
                                        <dfn><abbr></abbr>{this.state.ratailer_name}</dfn>
                                        <span>
                                            <b>Proposed Deviation : </b><div className={"devation_text_"+index}>{this.showHtml("devation_text_"+index,item.propose_deviation?item.propose_deviation:"")}</div><br/>
                                            <b>Comments : </b><div className={"comments_text_"+index}>{this.showHtml("devation_text_"+index,item.retailer_response?item.retailer_response:"")}</div>
                                        </span>
                                    </dd>:''}
                                    {item.sp_response!=null?
                                    <dt>
                                        <dfn><abbr></abbr>SP Group</dfn>
                                        {item.response_status == "0"?
                                            <span className={item.sp_response===""?"short":""}><b>Rejected : </b>{item.sp_response===""?"":<div className={"sp_text_"+index}>{item.sp_response}</div>}</span>:
                                            <span className={item.sp_response===""?"short":""}><b>Accepted : </b>{item.sp_response===""?"":<div className={"sp_text_"+index}>{item.sp_response}</div>}</span>}
                                    </dt>:''}
                                </dl>
                    })}
                    </div>
                </div>:<div className={this.state.showWindow?"history_box showbig":"history_box"}>
                        <h4><span>{this.props.title}</span><a onClick={this.closeModal.bind(this)}>X</a><a onClick={this.showWindow.bind(this)}>口</a></h4>
                        {/*<textarea disabled={this.props.textdisabled} className="detail_show" value={this.state.textVal} onChange={this.changeVal.bind(this)}></textarea>*/}
                    {this.props.textdisabled?<div className={"detail_show"}><div className="detail_mask"></div><div id={"deviation_body"} className="detail_show"></div></div>:<div id={"deviation_body"} className="detail_show"></div>}
                        {this.props.textdisabled?"":<a className="detail_show_btn" onClick={this.callbackVal.bind(this)}>Save</a>}
                      </div>}

            </div>
        )
    }
}