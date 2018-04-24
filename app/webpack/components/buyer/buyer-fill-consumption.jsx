import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../shared/show-modal';
import {DoFillConsumption} from './fill-consumption'
import moment from 'moment';
import {getBuyerParticipate, setBuyerParticipate} from '../../javascripts/componentService/common/service';
export class FillConsumption extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"",
            submit_type:"",
            site_list:[],
            disabled:'',
            checked:false,
            name:"",
            time:"",link:"",
        }
        this.consumptions_id = (window.location.href.split("consumptions/")[1]).split("/edit")[0];
    }
    componentDidMount(){
        this.BuyerParticipateList();
    }
    BuyerParticipateList(){
        getBuyerParticipate('/api/buyer/consumption_details?consumption_id='+this.consumptions_id).then((res) => {
            this.site_list = res.consumption_details;
            this.status = res.consumption.participation_status === '1'?"Confirmed":
                          (res.consumption.participation_status === '2'?"Pending":"Rejected")
            this.setState({
                name:res.auction.name,
                time:res.auction.actual_begin_time,
                link:res.tc_attachment,
            })
            console.log(this.site_list);
            if(res.consumption.participation_status === '1' || res.auction.publish_status === "1"){
                $("input[type='checkbox']").attr("checked",true);
                this.setState({
                    disabled:'disabled',
                    checked:true,
                })
            }
            if(res.consumption_details.length>0){
                this.site_list.map((item, index) => {
                    this.site_list[index].intake_level_selected = item.intake_level;
                    this.site_list[index].intake_level = ['Low Tension (LT)','High Tension Small (HTS)','High Tension Large (HTL)','Extra High Tension (EHT)'];
                    this.site_list[index].cid = index;
                })
                this.setState({site_list:this.site_list})
            }else{
                this.site_list = [
                    {
                        account_number:'',
                        premise_address:'',
                        intake_level:['Low Tension (LT)','High Tension Small (HTS)','High Tension Large (HTL)','Extra High Tension (EHT)'],
                        intake_level_selected:'LT',
                        contracted_capacity:null,
                        peak:'',
                        off_peak:'',
                        cid:1,
                        id:0
                    }
                ]
                this.setState({site_list:this.site_list})
            }
        }, (error) => {
            this.refs.Modal.showModal();
            this.setState({text:"Interface failed"});
        })
    }
    changeSiteList(val,index){
        console.log(val);
        let list = this.state.site_list;
        this.site_list[index].intake_level_selected = val;
        this.setState({site_list:list})
    }
    add_site(){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        let list = {},
        site_listObj = this.state.site_list;
        console.log(site_listObj);
        list = {
            account_number:'',
            premise_address:'',
            intake_level:['Low Tension (LT)','High Tension Small (HTS)','High Tension Large (HTL)','Extra High Tension (EHT)'],
            intake_level_selected:'LT',
            contracted_capacity:null,
            peak:'',
            off_peak:'',
            id:0,
            cid:Math.floor((Math.random()*10000)+1)
        }
        site_listObj.push(list)
        this.setState({site_list:site_listObj})
    }
    remove_site(index){
        if(this.props.onAddClick){
            this.props.onAddClick();
        }
        this.deleteNum = index;
        this.refs.Modal.showModal("comfirm");
        this.setState({text:"Are you sure you want to delete ?",submit_type:"delete"});
    }
    nameRepeat(arr){
        let hash = {};
        for(let i in arr) {
            if(hash[arr[i].account_number])
            return true;
            hash[arr[i].account_number] = true;
        }
        return false;
    }
    doSave(type){
        let makeData = {},
        buyerlist = [];
        this.state.site_list.map((item, index) => {
            if($("#intake_level"+(index+1)).val() != "LT"){
                buyerlist += '{"account_number":"'+$("#account_number"+(index+1)).val()+'","id":"'+item.id+'","premise_address":"'+$("#address"+(index+1)).val()+'","intake_level":"'+$("#intake_level"+(index+1)).val()+'","contracted_capacity":"'+$("#capacity"+(index+1)).val()+'","peak":"'+$("#peak"+(index+1)).val()+'","off_peak":"'+$("#off_peak"+(index+1)).val()+'","consumption_id":"'+this.consumptions_id+'"},';
            }else{
                buyerlist += '{"account_number":"'+$("#account_number"+(index+1)).val()+'","id":"'+item.id+'","premise_address":"'+$("#address"+(index+1)).val()+'","intake_level":"'+$("#intake_level"+(index+1)).val()+'","peak":"'+$("#peak"+(index+1)).val()+'","off_peak":"'+$("#off_peak"+(index+1)).val()+'","consumption_id":"'+this.consumptions_id+'"},';
            }
            
        })
        buyerlist = buyerlist.substr(0, buyerlist.length-1);
        buyerlist = '['+buyerlist+']';
        let checkpeak = JSON.parse(buyerlist).find(element=>{
            return element.peak == '0' && element.off_peak == '0';
        })
        makeData = {
            consumption_id:this.consumptions_id,
            details:buyerlist
        }
        if(type != "delete"){
            if(checkpeak){
                setTimeout(()=>{
                    this.refs.Modal.showModal();
                    this.setState({text:"You cannot enter 0 kWh for both peak and off-peak volume"});
                },200)
                return false;
            }
            if(this.nameRepeat(JSON.parse(buyerlist))){
                setTimeout(()=>{
                    this.refs.Modal.showModal();
                    this.setState({text:"Account number has already been entered!"});
                },200)
                return false;
            }
        }
        
        console.log(makeData.consumption_id);
        setBuyerParticipate(makeData, '/api/buyer/consumption_details/save').then((res) => {
            if(type != "participate"){
                if(type == "delete"){
                    this.setState({text:"Delete successful!"});
                }else{
                    this.setState({text:"Save successful!"});
                }
                this.refs.Modal.showModal();
            }else{
                setBuyerParticipate({consumption_id:this.consumptions_id}, '/api/buyer/consumption_details/participate').then((res) => {
                    this.setState({
                        disabled:'disabled',
                        checked:true,
                    })
                    this.refs.Modal.showModal();
                    this.setState({text:"Congratulations, your participation in this auction has been confirmed."});
                    setTimeout(()=>{
                        window.location.href="/buyer/auctions";
                    },3000)
                }, (error) => {
                    this.refs.Modal.showModal();
                    this.setState({text:"Interface failed"});
                })
            }
        }, (error) => {
            this.refs.Modal.showModal();
            this.setState({text:"Interface failed"});
        })
    }
    doAccept(){
        if(this.state.submit_type === "Reject"){ //do Reject
            setBuyerParticipate({consumption_id:this.consumptions_id}, '/api/buyer/consumption_details/reject').then((res) => {
                this.refs.Modal.showModal();
                this.setState({text:"Thank you for the confirmation. You have rejected this auction."});
                setTimeout(()=>{
                    window.location.href="/buyer/auctions";
                },3000)
            }, (error) => {
                this.refs.Modal.showModal();
                this.setState({text:"Interface failed"});
            })
        }else if(this.state.submit_type === "Participate"){ //do Participate
            this.doSave('participate');
        }else if(this.state.submit_type === "delete"){
            const site_listObj = this.state.site_list;
            site_listObj.splice(this.deleteNum, 1);
            this.setState({site_list:site_listObj});
            setTimeout(()=>{
                this.doSave('delete');
            },500); 
        }
    }
    doSubmit(type){
        if(type === "return"){
            return false;
        }
        this.setState({submit_type:type});
        if(type === "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({text:"Are you sure you want to reject this auction?"});
        }
    }
    checkSuccess(event, obj){
        event.preventDefault();
        if(this.state.submit_type === "Participate"){
            this.refs.Modal.showModal("comfirm");
            this.setState({text:"Are you sure you want to participate in this auction?"});
        }else if(this.state.submit_type === "save"){
            this.doSave();
        }
    }
    render () {
        return (
            <div>
                <h1>Participate in upcoming {this.state.name} exercise on {moment(this.state.time).format('D MMM YYYY hh:mm a')}</h1>
                <form name="buyer_form" method="post" onSubmit={this.checkSuccess.bind(this)}>
                <div className="u-grid buyer mg0">
                <h4 className="col-sm-12 u-mb2"><input name="agree_auction" type="checkbox" disabled={this.state.disabled} required /> I agree to the {this.state.link?<a className="cursor" download={this.state.link.file_name} href={`/${this.state.link.file_path}`}>terms and conditions.</a>:'terms and conditions.'}</h4>
                <h4 className="col-sm-12 u-mb2">Last Status of Participation : {this.status}</h4>
                    <div className="col-sm-12 col-md-8">
                    <DoFillConsumption changeSiteList={this.changeSiteList.bind(this)} site_list={this.state.site_list} checked={this.state.checked} remove={this.remove_site.bind(this)} />
                        {this.state.checked ? '' : <div className="addSite"><a onClick={this.add_site.bind(this)}>Add Account</a></div>}
                        <div className="buyer_btn">
                            <button className={"lm--button lm--button--primary "+this.state.disabled} disabled={this.state.disabled} onClick={this.doSubmit.bind(this,'save')}>Save</button>
                            <a className={"lm--button lm--button--primary "+this.state.disabled} onClick={this.state.disabled === "disabled" ? this.doSubmit.bind(this, 'return') : this.doSubmit.bind(this, 'Reject')}>Reject</a>
                            <button className={"lm--button lm--button--primary "+this.state.disabled} disabled={this.state.disabled} onClick={this.doSubmit.bind(this, 'Participate')}>Participate</button>
                        </div>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/buyer/auctions" >Back</a>
                </div>
                <Modal text={this.state.text} acceptFunction={this.doAccept.bind(this)} ref="Modal" />
                </form>
            </div>
        )
    }
}

FillConsumption.propTypes = {onAddClick: () => {}};

function run() {
    const domNode = document.getElementById('buyer_fill_consumption');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(FillConsumption),
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