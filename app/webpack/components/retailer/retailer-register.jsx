import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {UploadFile} from '../shared/upload';
import {Modal} from '../shared/show-modal';
export class RetailerRegister extends Component {
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
            main_email_address:"",
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
    Change(){

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
            <div id="retailer_form" >
            <form onSubmit={this.checkSuccess.bind(this)}>
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    <h3 className="u-mt3 u-mb1">Retailer Register Page</h3>
                    <h4 className="u-mt1 u-mb1">Account Info</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_email_address" value={this.state.main_email_address} onChange={this.Change.bind(this,'main_email_address')} disabled={this.state.disabled} ref="main_email_address" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" title="Email address should be in the format name@example.com."/>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Password:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="password" name="main_password" value={this.state.main_password} onChange={this.Change.bind(this,'main_password')} disabled={this.state.disabled} ref="main_password" maxLength="10" required aria-required="true" />
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> Password Confirm:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="password" name="main_password" value={this.state.main_password_confirm} onChange={this.Change.bind(this,'main_password_confirm')} disabled={this.state.disabled} ref="main_password_confirm" maxLength="10" required aria-required="true" />
                        </div>
                    </div>
                    <h4 className="u-mt1 u-mb1">Company Info</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Company Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_company_name" value={this.state.main_company_name} onChange={this.Change.bind(this,'main_company_name')} disabled={this.state.disabled} ref="main_company_name" maxLength="50" required aria-required="true" ></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> Unique Entity Number (UEN):
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_ven" value={this.state.main_uen} onChange={this.Change.bind(this,'main_uen')} disabled={this.state.disabled} ref="main_uen" maxLength="50" required aria-required="true" ></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Licence Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_licence_number" value={this.state.main_licence_number} onChange={this.Change.bind(this,'main_licence_number')} disabled={this.state.disabled} ref="main_licence_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> GST Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_gst_number" value={this.state.main_gst_number} onChange={this.Change.bind(this,'main_gst_number')} disabled={this.state.disabled} ref="main_gst_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_address" value={this.state.main_address} onChange={this.Change.bind(this,'main_address')} disabled={this.state.disabled} ref="main_address" maxLength="50" required aria-required="true" ></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            <abbr title="required">*</abbr> Upload Documents:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <UploadFile type="RETAILER_DOCUMENTS" required="required" showlist={false} fileData={this.state.fileData.RETAILER_DOCUMENTS} propsdisabled={false} />
                            <div className="col-sm-12 col-md-2 u-cell">
                                <button className="lm--button lm--button--primary" title="this is retailer upload documents" onClick={this.showView.bind(this)} >?</button>
                            </div>
                        </div>
                    </div>
                    <h4 className="lm--formItem lm--formItem--inline string">Contact Info:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this,'contact_name')} disabled={this.state.disabled} ref="contact_name" maxLength="150" title="The length must not be longer than 150 characters."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="contact_mobile_number" value={this.state.contact_mobile_number} onChange={this.Change.bind(this,'contact_mobile_number')} disabled={this.state.disabled} ref="contact_mobile_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="contact_office_number" value={this.state.contact_office_number} onChange={this.Change.bind(this,'contact_office_number')} disabled={this.state.disabled} ref="contact_office_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
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

RetailerManage.propTypes = {
    onSubmitjest: ()=>{}
};




function runs() {
    const domNode = document.getElementById('retailer_register');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerRegister),
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