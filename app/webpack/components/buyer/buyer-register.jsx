import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {UploadFile} from '../shared/upload';
import {Modal} from '../shared/show-modal';
export class BuyerRegister extends Component {
    constructor(props){
        super(props);
        this.state={
            id:"",
            text:"",
            type:"",live_modal:"",live_modal_do:"",
            btn_status:false,
            disabled:false,
            havedata:false,
            allbtnStatus:true,
            main_name:"",
            buyer_email:"",
            buyer_password:"",
            buyer_password_confirm:"",
            main_mobile_number:"",
            main_office_number:"",
            alternative_name:"",
            alternative_email_address:"",
            alternative_mobile_number:"",
            alternative_office_number:"",
            files:[],
            fileData:{
                "RETAILER_DOCUMENTS":[
                    {buttonName:"none",files:[]}
                ]
            }
        }
        this.auctionData = {};
    }
    componentWillMount(){

    }
    componentDidMount() {

    }
    checkSuccess(){

    }
    Change(type,e){
        let itemValue = e.target.value;
        if(type==='buyer_email')
        {this.setState({buyer_email:itemValue})}
    }
    showView(){
        this.setState({text:"This is upload Documents"});
        this.refs.Modal.showModal();
    }
    render () {
        let btn_html = <div>
            <button id="save_form" className="lm--button lm--button--primary" >Save</button>
            <button id="submit_form" className="lm--button lm--button--primary" >Sign Up</button>
        </div>;
        return (
            <div className="retailer_manage_coming">
            <div id="buyer_form" >
            <form onSubmit={this.checkSuccess.bind(this)}>
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    <h3 className="u-mt3 u-mb1">Buyer Register Page</h3>
                    <h4 className="u-mt1 u-mb1">Account Info</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="buyer_email" value={this.state.buyer_email} onChange={this.Change.bind(this,'buyer_email')} disabled={this.state.disabled} ref="buyer_email" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" placeholder="Email address should be in the format name@example.com." />
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Password:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="password" name="buyer_password" value={this.state.buyer_password} onChange={this.Change.bind(this,'buyer_password')} disabled={this.state.disabled} ref="buyer_password" maxLength="10" required aria-required="true" />
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> Password Confirm:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="password" name="main_password" value={this.state.buyer_password_confirm} onChange={this.Change.bind(this,'buyer_password_confirm')} disabled={this.state.disabled} ref="buyer_password_confirm" maxLength="10" required aria-required="true" />
                        </div>
                    </div>
                    {/*<h4 className="u-mt1 u-mb1">Company Info</h4>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                        {/*<abbr title="required">*</abbr> Company Name:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_company_name" value={this.state.buyer_company_name} onChange={this.Change.bind(this,'buyer_company_name')} disabled={this.state.disabled} ref="buyer_company_name" maxLength="50" required aria-required="true" ></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Unique Entity Number (UEN):*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="main_ven" value={this.state.buyer_uen} onChange={this.Change.bind(this,'buyer_uen')} disabled={this.state.disabled} ref="buyer_uen" maxLength="50" required aria-required="true" ></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                        {/*<abbr title="required">*</abbr> Company Address:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_company_address" value={this.state.buyer_company_address} onChange={this.Change.bind(this,'buyer_company_address')} disabled={this.state.disabled} ref="buyer_company_address" maxLength="50" required aria-required="true" ></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Billing Address:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_billing_address" value={this.state.buyer_billing_address} onChange={this.Change.bind(this,'buyer_billing_address')} disabled={this.state.disabled} ref="buyer_billing_address" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<h4 className="u-mt1 u-mb1">Contact Information</h4>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Address:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="main_address" value={this.state.main_address} onChange={this.Change.bind(this,'main_address')} disabled={this.state.disabled} ref="main_address" maxLength="50" required aria-required="true" ></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Upload Documents:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control u-grid mg0">*/}
                            {/*<UploadFile type="RETAILER_DOCUMENTS" required="required" showlist={false} fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={false} />*/}
                            {/*<div className="col-sm-12 col-md-2 u-cell">*/}
                                {/*<button className="lm--button lm--button--primary" title="this is retailer upload documents" onClick={this.showView.bind(this)} >?</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<h4 className="lm--formItem lm--formItem--inline string">Contact Info:</h4>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Contact Name:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this,'contact_name')} disabled={this.state.disabled} ref="contact_name" maxLength="150" title="The length must not be longer than 150 characters."></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                        {/*Mobile Number: (+65)*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="contact_mobile_number" value={this.state.contact_mobile_number} onChange={this.Change.bind(this,'contact_mobile_number')} disabled={this.state.disabled} ref="contact_mobile_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                        {/*Office Number: (+65)*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="contact_office_number" value={this.state.contact_office_number} onChange={this.Change.bind(this,'contact_office_number')} disabled={this.state.disabled} ref="contact_office_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<h4 className="lm--formItem lm--formItem--inline string">Add Individial Info:</h4>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*<abbr title="required">*</abbr> Upload Documents:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control u-grid mg0">*/}
                            {/*<UploadFile type="RETAILER_DOCUMENTS" required="required" showlist={false} fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={false} />*/}
                            {/*<div className="col-sm-12 col-md-2 u-cell">*/}
                                {/*<button className="lm--button lm--button--primary" title="this is retailer upload documents" onClick={this.showView.bind(this)} >?</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<h5 className="lm--formItem lm--formItem--inline string">Electricity Puchese information:</h5>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Puchese Entity:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_entity" value={this.state.buyer_entity} onChange={this.Change.bind(this,'buyer_entity')} disabled={this.state.disabled} ref="buyer_entity" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Company Name:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_compant_name" value={this.state.buyer_compant_name} onChange={this.Change.bind(this,'buyer_compant_name')} disabled={this.state.disabled} ref="buyer_compant_name" maxLength="50" aria-required="true"></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Company Address:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_compant_address" value={this.state.buyer_compant_address} onChange={this.Change.bind(this,'buyer_compant_address')} disabled={this.state.disabled} ref="buyer_compant_address" maxLength="50" aria-required="true"></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Billing Name:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_billing_name" value={this.state.buyer_billing_name} onChange={this.Change.bind(this,'buyer_billing_name')} disabled={this.state.disabled} ref="buyer_billing_name" maxLength="50" aria-required="true"></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Attention To:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<input type="text" name="buyer_attention" value={this.state.buyer_attention} onChange={this.Change.bind(this,'buyer_attention')} disabled={this.state.disabled} ref="buyer_attention" maxLength="50" aria-required="true"></input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="lm--formItem lm--formItem--inline string">*/}
                        {/*<label className="lm--formItem-left lm--formItem-label string required">*/}
                            {/*Tenent Management Sences Required:*/}
                        {/*</label>*/}
                        {/*<div className="lm--formItem-right lm--formItem-control">*/}
                            {/*<select name="buyer_management" onChange={this.Change.bind(this,'buyer_management')} defaultValue={this.state.buyer_management} disabled={this.state.disabled} ref="buyer_management" aria-required="true">*/}
                                {/*<option value="1">Yes</option>*/}
                                {/*<option value="0">No</option>*/}
                            {/*</select>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_buyer_tc"}/> I agree to Seller - Buyer T&C</h4>
                    <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_revv_tc"}/> I agree to Seller - Revv T&C</h4>
                    <div className="retailer_btn">
                        {btn_html}
                    </div>
                </div>
            </div>
            </form>
            <Modal text={this.state.text} ref="Modal" />
            </div>
            </div>
        )
    }
}

BuyerRegister.propTypes = {
    onSubmitjest: ()=>{}
};

function runs() {
    const domNode = document.getElementById('buyer_register');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(BuyerRegister),
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
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}