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
                editor.customConfig.menus = [
                    'head',
                    'bold',
                    'fontSize',
                    'fontName',
                    'italic',
                    'underline',
                    'strikeThrough',
                    'foreColor',
                    'backColor',
                    'justify',
                    'undo',
                    'redo'
                ];
                editor.customConfig.lang = {
                    '字号': 'font size',
                    '字体': 'font',
                    '文字颜色': 'font color',
                    '背景色': 'background color',
                    '对齐方式': 'alignment',
                    '靠左': 'left',
                    '靠右': 'right',
                    '居中': 'center',
                    '宋体': 'song',
                    '微软雅黑': 'yahei',
                    "设置标题": "Header",
                    "设置列表": "set List",
                    "有序列表": "ordered list",
                    "无序列表": "unordered list",
                    "图片链接": "picture link",
                    "插入": "Insert",
                    "创建": "Create",
                    "行": "Row",
                    "列": "Column",
                    "格式如": "Format like",
                    "链接文字": "Text Link",
                    "的表格": "'s table",
                    "正文": "Content",
                    "删除链接":"Delete Link",
                    "最大宽度":"Maximum Width",
                    "删除图片":"Delete Picture",
                    "增加":"Add ",
                    "删除":"Delete ",
                    "表格":"Table"
                    // 还可自定添加更多
                };
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
        // console.log(val);
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
                                        <dfn><bdo></bdo>{this.state.ratailer_name}</dfn>
                                        <aside>
                                            <b>Proposed Deviation : </b><div className={"devation_text_"+index}>{this.showHtml("devation_text_"+index,item.propose_deviation?item.propose_deviation:"")}</div><br/>
                                            <b>Comments : </b><div className={"comments_text_"+index}>{this.showHtml("devation_text_"+index,item.retailer_response?item.retailer_response:"")}</div>
                                        </aside>
                                    </dd>:''}
                                    {item.sp_response!=null?
                                    <dt>
                                        <dfn><bdo></bdo>SP Group</dfn>
                                        {item.response_status == "0"?
                                            <aside className={item.sp_response===""?"short":""}><b>Rejected : </b>{item.sp_response===""?"":<div className={"sp_text_"+index}>{item.sp_response}</div>}</aside>:
                                            <aside className={item.sp_response===""?"short":""}><b>Accepted : </b>{item.sp_response===""?"":<div className={"sp_text_"+index}>{item.sp_response}</div>}</aside>}
                                    </dt>:''}
                                </dl>
                    })}
                    </div>
                </div>:<div className={this.state.showWindow?"history_box showbig":"history_box"}>
                        <h4 className={"title"}><span>{this.props.title}</span><a onClick={this.closeModal.bind(this)}>X</a><a onClick={this.showWindow.bind(this)}>口</a></h4>
                        {/*<textarea disabled={this.props.textdisabled} className="detail_show" value={this.state.textVal} onChange={this.changeVal.bind(this)}></textarea>*/}
                    {this.props.textdisabled?<div className={"detail_show"}><div className="detail_mask"></div><div id={"deviation_body"} className="detail_show"></div></div>:<div id={"deviation_body"} className="detail_show"></div>}
                        {this.props.textdisabled?"":<a className="detail_show_btn" onClick={this.callbackVal.bind(this)}>Save</a>}
                      </div>}

            </div>
        )
    }
}