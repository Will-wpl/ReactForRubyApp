import React, { Component, PropTypes } from 'react'
import moment from 'moment';
import {Modal} from '../../shared/show-modal';
import {deleteAuction,updateStatus,deleteStatus,getUsersDetail} from '../../../javascripts/componentService/admin/service';
import {getAuction} from '../../../javascripts/componentService/common/service';
export class SearchList extends Component {
    constructor(props, context){
        super(props);
        this.state={
            text:"",showDetail:{},
            name:"",params_type:true,
            buyer_type:null
        }
    }
    componentDidMount() {
        if(window.location.href.indexOf("admin")>0){
            if(sessionStorage.auction_id){
                getAuction('admin',sessionStorage.auction_id).then(res => {
                    this.auction = res;
                    this.setState({
                        buyer_type:res.buyer_type
                    })
                    // console.log(this.auction);
                })
            }
        }
    }
    dosearch(index,obj){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let listData = {};
        if(this.props.list_data){
            listData = this.props.list_data;
            listData.page_index = index;
            if(this.props.doSearch && this.props.list_url){
                this.props.doSearch(listData,this.props.list_url);
            }
        }
    }
    gotopage(type,obj){
        if(this.props.list_data){
            let index = this.props.list_data.page_index;
            if(type === 'prev'){
                if(index === 1){
                    return;
                }else{
                    index = index - 1;
                    this.dosearch(index);
                }
            }else{
                if(index === this.props.page_total.length){
                    return;
                }else{
                    index = index + 1;
                    this.dosearch(index);
                }
            }
        }
    }
    clickFunction(id,url,name,type,list_name,auction_id){
        if(type == "auction"){
            if(auction_id){
                sessionStorage.arrangement_id=id;
                sessionStorage.auction_id=auction_id;
            }else{
                sessionStorage.auction_id=id;
            }
        }
        if(type == "show_detail"){
            this.setState({
                params_type:true
            })
            getUsersDetail(id).then(res=>{
                //console.log(res);
                this.setState({
                    showDetail:res,
                })
                this.refs.Modal.showModal();
            },error=>{

            })
            return;
        }
        if(name == "Delete"){
            this.auction_id = id;
            this.showDelete(list_name);
        }else{
            if(auction_id){
                window.location.href=`${url.replace(":id",auction_id)}`;
            }else{
                window.location.href=`${url.replace(":id",id)}`;
            }
        }

    }
    showDelete(auction_name){
        this.refs.Modal.showModal("comfirm");
        this.setState({text:"Are you sure you want to delete?",name:auction_name,params_type:false});
    }
    delete(){
        deleteAuction({ auction: {id:this.auction_id}}).then(res => {
                this.refs.Modal.showModal();
                this.setState({
                    text:this.state.name + " has been successfully deleted."
                });
                this.dosearch(1);
            }, error => {
                this.setState({
                    text:'Request exception,Delete failed!'
                });
                this.refs.Modal.showModal();
            })
    }
    doinvite(type,user_id,select_action){
        // console.log(this.props.table_data)
        let invite_type = this.props.type === 'Select Retailers' ? 'arrangements' : 'consumptions';
        if(this.state.buyer_type == '0' && window.location.href.indexOf("type=2")>0){
            this.props.table_data.bodies.data.map((item)=>{
                if(item.select_action){
                    deleteStatus({
                        id:item.select_action,
                        type:invite_type,
                        data:{
                            action_status:0
                        }
                    }).then(res=>{
                        this.dosearch(this.props.list_data.page_index);
                    })
                }
            })
        }
        if(type === "invite"){
            updateStatus({
                id:0,
                type:invite_type,
                data:{
                    id:0,
                    auction_id:sessionStorage.auction_id,
                    user_id:user_id
                }
            }).then(res=>{
                this.dosearch(this.props.list_data.page_index);
            },error=>{
                this.setState({
                    text:'Request exception failed!'
                });
                this.refs.Modal.showModal();
            })
        }else{
            deleteStatus({
                id:select_action,
                type:invite_type,
                data:{
                    action_status:0
                }
            }).then(res=>{
                this.dosearch(this.props.list_data.page_index);
            },error=>{
                this.setState({
                    text:'Request exception failed!'
                });
                this.refs.Modal.showModal();
            })
        }
    }
    saveId(url){
        sessionStorage.uid = url;
    }
    showDetails(data){
        let json = JSON.parse(data.auction_what);
        let _json=[];
        for(let key in json){
            if(key == "created_at"||key == "updated_at"||key=="actual_begin_time"||key == "actual_end_time"||
                key=="current_time"||key=="actual_bid_time"||key == "bid_time"||key =="start_datetime"){
                let time = `${key} : ${moment(json[key]).format('D MMM YYYY hh:mm A')}`;
                _json.push(time)
            }else{
                let label = `${key} : ${json[key]}`;
                _json.push(label)
            }
        }
        let str = _json.join("<br/>");
        this.setState({
            text:str,
            params_type:false
        },()=>{
            this.refs.Modal.showModal();
        });
    }
    dosort(field_name,sort,table_name){
        $(".lm--table th dfn").removeClass("selected");
        $(".search_list_"+sort+"."+field_name+"").addClass("selected");
        let listData = {};
        if(this.props.list_data){
            listData = this.props.list_data;
            listData.sort_by = [field_name,sort,table_name];
            if(this.props.doSearch && this.props.list_url){
                this.props.doSearch(listData,this.props.list_url);
            }
        }
    }
    goDeleteList(type){
        window.location.href=`/admin/users/${type}`;
    }
    render (){
        if(this.props.table_data){
            return (
                <div>
                <div className="lm--table-container">
                    <table className="lm--table lm--table--responsive">
                        <thead>
                        <tr>
                            {
                                this.props.table_data.headers.map((item,index)=>{
                                    if(item.name){
                                        return <th key={index}>
                                                    {item.name}
                                                    {item.is_sort === undefined?
                                                    <div><dfn className={"search_list_asc "+item.field_name} onClick={this.dosort.bind(this,item.field_name,'asc',item.table_name?item.table_name:'')}></dfn>
                                                    <dfn className={"search_list_desc "+item.field_name} onClick={this.dosort.bind(this,item.field_name,'desc',item.table_name?item.table_name:'')}></dfn></div>:''}
                                                </th>
                                    }

                                })
                            }
                        {this.props.table_data.actions?<th/>:null}
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.table_data.bodies.data.map((item,index)=>{
                                    return <tr key={index}>
                                                {
                                                    this.props.table_data.headers.map((it,i)=>{
                                                        if(it.field_name === 'select_action'){
                                                            // console.log(item[`lock`])
                                                            return <td key={i}>
                                                                    {item[`lock`] === false ?
                                                                        item[`${it.field_name}`] === null
                                                                        ? <span className={'invite'} onClick={this.doinvite.bind(this,'invite',item.user_id)}>Invite</span>
                                                                        :(
                                                                            item[`select_status`] === '2'
                                                                            ? <span className={'cancel_invite'} onClick={this.doinvite.bind(this,'not_invite',item.user_id,item.select_action)}>Cancel Invite</span>
                                                                            : (item[`select_status`] === null ? <span className={'invite'} onClick={this.doinvite.bind(this,'invite',item.user_id)}>Invite</span>  : '')
                                                                        ):''
                                                                    }
                                                                   </td>
                                                        }else if(it.field_name === 'select_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === null ? <div className={'select_ico_0'}></div> : <div className={'select_ico_'+item[`${it.field_name}`]}></div>}
                                                                   </td>
                                                        }else if(it.field_name === 'publish_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? 'Unpublished' : 'Published'}
                                                                   </td>
                                                        }else if(it.field_name === 'participation_status'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? <div className={'participation_status_0'}></div> : <div className={'participation_status_'+item[`${it.field_name}`]}></div>}
                                                                   </td>
                                                        }else if(it.field_name === 'account_housing_type'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === '0' ? 'HDB' : (item[`${it.field_name}`] === '1' ? 'Private High-rise' : 'Landed')}
                                                                   </td>
                                                        }else if(it.field_name === 'accept_status' && it.table_name !== 'consumptions'){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`] === null ? 'Pending' : (item[`${it.field_name}`] === '0' ? 'Rejected' : (item[`${it.field_name}`] === '1'?'Accepted':"In Progress"))}
                                                                   </td>
                                                        }else if( it.field_name === 'log' || it.field_name === 'report' || it.field_name === 'award'){
                                                            if(item.contracts){
                                                                return <td key={i}>
                                                                        {item.contracts.map((e,l)=>{
                                                                            if(e.report != "" || e.log != "" || e.award != ""){
                                                                                return <abbr key={l}>{e[`${it.field_name}`]?<a className={it.field_name} href={e[`${it.field_name}`]?"/"+e[`${it.field_name}`]:"javascript:void(0);"} onClick={this.saveId.bind(this,e[`${it.field_name}`])}>{e.company_name}</a>:<a>&nbsp;</a>}</abbr>
                                                                            }
                                                                        })}
                                                                </td>
                                                            }else{
                                                                if(item.report == "" || item.log == "" || item.award == ""){
                                                                    return <td key={i}></td>
                                                                }else{
                                                                    if(it.field_name === 'award'){
                                                                        return <td key={i}><abbr>{item[`${it.field_name}`]?
                                                                            item[`${it.field_name}`].map((o,m)=>{
                                                                                return <a key={m} className={it.field_name} href={item[`${it.field_name}`]?"/"+o.url:"javascript:void(0);"} onClick={this.saveId.bind(this,item[`${it.field_name}`])}>{o.company_name}</a>
                                                                            }):<a>&nbsp;</a>}</abbr></td>
                                                                    }else{
                                                                        return <td key={i}><abbr>{item[`${it.field_name}`]?<a className={it.field_name} href={item[`${it.field_name}`]?"/"+item[`${it.field_name}`]:"javascript:void(0);"} onClick={this.saveId.bind(this,item[`${it.field_name}`])}></a>:<a>&nbsp;</a>}</abbr></td>
                                                                    }

                                                                }
                                                            }
                                                        } else if(it.field_name === 'acknowledge'){
                                                            if(item.award == ""){
                                                                return <td key={i}></td>
                                                            }else{
                                                                if(item.acknowledge === "1"){
                                                                    return<td key={i}>
                                                                        <div className="participation_status_1"></div>
                                                                    </td>
                                                                }else{
                                                                    return<td key={i}>
                                                                        <div className="participation_status_2"></div>
                                                                    </td>
                                                                }
                                                            }
                                                        } else if(it.field_name === 'actions'){

                                                        }else if(it.field_name==="logged_in_status"){
                                                            return <td key={i}>
                                                                    {item[`${it.field_name}`]==="1" ? "Success":"Fail"}
                                                                   </td>
                                                        }else if(it.field_name === "ws_connected_status" ){
                                                            return <td key={i}>
                                                                {item[`${it.field_name}`]==="1" ? "Success":"Fail"}
                                                            </td>
                                                        }else if(it.field_name === "ws_send_message_status" ){
                                                            return <td key={i}>
                                                                {item[`${it.field_name}`]==="1" ? "Success":"Fail"}
                                                            </td>
                                                        }
                                                        else if(it.field_name ==="auction_what"){
                                                            return <td key={i}>
                                                               <a
                                                                   className="log"
                                                                   onClick={this.showDetails.bind(this,item)}
                                                               ></a>
                                                            </td>
                                                        }
                                                        else{
                                                            return <td key={i}>
                                                                {
                                                                    item.contracts?item.contracts.map((k,s)=>{
                                                                        if(it.field_name === "published_gid" || it.field_name === "start_datetime" || it.field_name === "name"){
                                                                            if(s==0){
                                                                                return <abbr key={s}>{it.field_name === "start_datetime"?moment(item[`${it.field_name}`]).format('D MMM YYYY hh:mm A'):item[`${it.field_name}`]}</abbr>
                                                                            }
                                                                        }else{
                                                                            return <abbr key={s}>
                                                                                {it.field_name === "actual_begin_time" || it.field_name ==="logged_in_last_time" ||it.field_name ==="ws_connected_last_time" ||
                                                                                it.field_name === "ws_send_message_last_time"|| it.field_name === "auction_when"
                                                                                    ? moment(k[`${it.field_name}`]).format('D MMM YYYY hh:mm A')
                                                                                    : k[`${it.field_name}`]}
                                                                            </abbr>
                                                                        }
                                                                    })
                                                                    :<abbr>{(it.field_name === "actual_begin_time" || it.field_name === "start_datetime" || it.field_name ==="logged_in_last_time" ||it.field_name ==="ws_connected_last_time" || it.field_name === "ws_send_message_last_time"|| it.field_name === "auction_when")
                                                                    ? moment(item[`${it.field_name}`]).format('D MMM YYYY hh:mm A'):((it.field_name==="contract_period_start_date")?moment(item[`${it.field_name}`]).format('D MMM YYYY '):(item[`${it.field_name}`]?(item[`${it.field_name}`].indexOf("!")>0?<bdo>{item[`${it.field_name}`].split("!")[0]} <b title="Purchasing Entity Pending" style={{"color":"red"}}>!</b></bdo>:item[`${it.field_name}`]):null))}</abbr>
                                                                }
                                                                </td>
                                                        }

                                                    })
                                                }
                                                {this.props.table_data.actions?
                                                    <td className="search_list_btn">
                                                        {
                                                            this.props.table_data.actions.map((ik,k)=>{
                                                                if(ik.check === "docheck"){
                                                                    if(item["actions"] === k){
                                                                        if(item['auction_status'] === 'In Progress' && ik.name === 'View'){
                                                                        }else{
                                                                            return <a key={k} className={this.props.table_data.actions[item["actions"]].icon}
                                                                                onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,this.props.table_data.actions[item["actions"]].url,this.props.table_data.actions[item["actions"]].name,this.props.table_data.actions[item["actions"]].interface_type ? this.props.table_data.actions[item["actions"]].interface_type : "",item.name ? item.name : '',null)}>
                                                                                {this.props.table_data.actions[item["actions"]].name}</a>
                                                                        }

                                                                    }
                                                                }else{
                                                                    if(item['auction_status'] === 'Upcoming' && ik.name === 'Manage'){
                                                                    }else{
                                                                        let incompleteHtml = <span className={'incomplete_span'}><font>!</font> Starting Price Incomplete</span>;
                                                                        if(item['status'] === 'In Progress' && ik.name === 'Manage'){
                                                                            return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "",item.name ? item.name : '',item.auction_id)}>View{item.incomplete?incompleteHtml:''}</a>
                                                                        }else if(item['status'] === 'Upcoming' && ik.name === 'Manage'){
                                                                            return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "",item.name ? item.name : '',item.auction_id)}>Manage{item.incomplete?incompleteHtml:''}</a>
                                                                        }else if(ik.name === "Retailer Dashboard" && window.location.href.indexOf("admin")<0){
                                                                            if(item.dashdoard_id){
                                                                                return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "",item.name ? item.name : '',item.auction_id)}>{ik.name}</a>
                                                                            }
                                                                        }else{
                                                                            return <a key={k} className={ik.icon} onClick={this.clickFunction.bind(this,item.id ? item.id : item.user_id,ik.url,ik.name,ik.interface_type ? ik.interface_type : "",item.name ? item.name : '',item.auction_id)}>{ik.name}{(ik.name=="Buyer Dashboard" || ik.name=="Buyer List" || ik.name=="Retailer List") && item.all_accept==false?<span title={"There is outstanding Buyer Participation details pending for approval."} className={"font_arial"} style={{"color":"red"}}>!</span>:''}</a>
                                                                        }

                                                                    }

                                                                }
                                                            })
                                                        }
                                                    </td>:null}
                                            </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {this.props.type == "Retailer List"?<button className="lm--button lm--button--primary reset_btn u-mt1 u-mb1" onClick={this.goDeleteList.bind(this,'del_retailers')}>Deleted Retailer List</button>:""}
                    {this.props.type == "Buyer List"?<button className="lm--button lm--button--primary reset_btn u-mt1 u-mb1" onClick={this.goDeleteList.bind(this,'del_buyers')}>Deleted Buyer List</button>:""}
                    <Modal text={this.state.text} listdetail={this.state.params_type ? this.state.showDetail : null} listdetailtype={this.props.type} dodelete={this.delete.bind(this)} ref="Modal" />
                </div>
                <div className="table_page">
                    <ol>
                        <span onClick={this.gotopage.bind(this,'prev')}>{"<"}</span>
                        {
                            this.props.page_total.map((item,index)=>{
                                return <span key={index} className={this.props.list_data.page_index === item ? 'table_page_selected' : ''} onClick={this.dosearch.bind(this,item)} id={"table_page_"+item}>{item}</span>
                            })
                        }
                        <span onClick={this.gotopage.bind(this,'next')}>{">"}</span>
                    </ol>
                </div>
                </div>
            )
        }else{
            return <div className="list_loading">Loading...</div>
        }
    }
}
SearchList.propTypes = {
    onAddClick: ()=>{}
  };