import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { UploadFile } from '../shared/upload';
import { UserEntity } from '../shared/user-entity';
import { Modal } from '../shared/show-modal';
import { getBuyerUserInfo, saveBuyerUserInfo, submitBuyerUserInfo } from '../../javascripts/componentService/common/service';
export class BuyerRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            text: "",
            btn_status: false,
            disabled: false,
            havedata: false,
            allbtnStatus: true,
            email_address: "",
            company_name: "",
            unique_entity_number: "",
            company_address: "",
            billing_address: "",
            contact_name: "",
            mobile_number: "",
            office_number: "",

            user_company_name: "",
            user_company_uen: "",
            user_company_address: "",
            user_billing_address: "",
            user_bill_attention_to: "",
            user_contact_name: "",
            user_contact_email: "",
            user_contact_mobile_no: "",
            user_contact_office_no: "",

            user_entity_data: {
                "ENTITY_LIST": [
                    { buttonName: "none", entities: [] }
                ]
            },

            fileData: {
                "BUYER_DOCUMENTS": [
                    { buttonName: "none", files: [] }
                ]
            },
            uploadUrl: "/api/buyer/user_attachments?file_type="
        };
    }
    componentWillMount() {

    }
    componentDidMount() {
        let fileObj, entityObj;
        fileObj = this.state.fileData;
        entityObj = this.state.user_entity_data;
        getBuyerUserInfo().then(res => {
            console.log(res)
            if (res.user_base_info) {
                let item = res.user_base_info;
                this.setState({
                    id: item.id,
                    email_address: item.email ? item.email : '',
                    company_name: item.company_name ? item.company_name : '',
                    unique_entity_number: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                    company_address: item.company_address ? item.company_address : '',
                    billing_address: item.billing_address ? item.billing_address : '',
                    contact_name: item.name ? item.name : '',
                    mobile_number: item.account_mobile_number ? item.account_mobile_number : '',
                    office_number: item.account_office_number ? item.account_office_number : '',
                    user_company_name: item.company_name ? item.company_name : '',
                    user_company_uen: item.company_unique_entity_number ? item.company_unique_entity_number : '',
                    user_company_address: item.company_address ? item.company_address : ''
                })
            }

            if (res.self_attachment) {
                let attachment = res.self_attachment
                let obj = {
                    file_name: attachment.file_name,
                    file_path: attachment.file_path,
                    file_type: attachment.file_type
                }
                fileObj[attachment.file_type][0].files.push(obj);
                this.setState({
                    fileData: fileObj
                })
            }

            if (res.buyer_entities) {
                let entity = res.buyer_entities;
                let user_entity=[];
                if (entity.length > 0) {
                    this.setState({
                        user_company_name: entity[0].company_name,
                        user_company_uen: entity[0].company_uen,
                        user_company_address: entity[0].company_address,
                        user_billing_address: entity[0].billing_address,
                        user_bill_attention_to: entity[0].bill_attention_to,
                        user_contact_name: entity[0].contact_name,
                        user_contact_email: entity[0].contact_email,
                        user_contact_mobile_no: entity[0].contact_mobile_no,
                        user_contact_office_no: entity[0].contact_office_no
                    })

                    if(entity.length>1)
                    {
                        res.buyer_entities.map((item,index)=>{
                            if(index>0)
                            {
                                user_entity.push(item);
                            }
                        })

                        entityObj['ENTITY_LIST'][0].entities = user_entity;
                        this.setState({
                            user_entity_data: entityObj
                        })      
                    }
                }
            }

            if (res.seller_buyer_tc_attachment) {
                let buyer = res.seller_buyer_tc_attachment;
                this.setState({
                    buyerTCurl: buyer.file_path,
                    buyerTCname: buyer.file_name
                })
            }

            if (res.buyer_revv_tc_attachment) {
                let revv = res.buyer_revv_tc_attachment;
                this.setState({
                    revvTCurl: revv.file_path,
                    revvTCname: revv.file_name
                })
            }
        })
    }
    checkSuccess() {

    }
    setParams() {
        let entity = [
            {
                company_name: this.state.user_company_name,
                company_uen: this.state.user_company_uen,
                company_address: this.state.user_company_address,
                billing_address: this.state.user_billing_address,
                bill_attention_to: this.state.user_bill_attention_to,
                contact_name: this.state.user_contact_name,
                contact_email: this.state.user_contact_email,
                contact_mobile_no: this.state.user_contact_mobile_no,
                contact_office_no: this.state.user_contact_office_no
            }
        ];
        if (this.state.user_entity_data['ENTITY_LIST'][0].entities) {
            let list = this.state.user_entity_data['ENTITY_LIST'][0].entities;
            list.map((item, index) => {
                let paramObj = {
                    company_name: item.user_company_name,
                    company_uen: item.user_company_uen,
                    company_address: item.user_company_address,
                    billing_address: item.user_billing_address,
                    bill_attention_to: item.user_bill_attention_to,
                    contact_name: item.user_contact_name,
                    contact_email: item.user_contact_email,
                    contact_mobile_no: item.user_contact_mobile_no,
                    contact_office_no: item.user_contact_office_no
                }
                entity.push(paramObj);
            })
        }

        let params = {
            user: {
                'id': this.state.id,
                'email': this.state.email_address,
                'company_name': this.state.company_name,
                'company_unique_entity_number': this.state.unique_entity_number,
                'company_address': this.state.company_address,
                'billing_address': this.state.billing_address,
                'name': this.state.contact_name,
                'account_mobile_number': this.state.mobile_number,
                'account_office_number': this.state.office_number
            },
            buyer_entities: JSON.stringify(entity)
        };
        return params;
    }
    save() {
        let buyerParam = this.setParams();
        saveBuyerUserInfo(buyerParam).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: "Your details have been successfully saved. "
            });
        })


    }
    submit() {
        let buyerParam = this.setParams();
        submitBuyerUserInfo(buyerParam).then(res => {
            this.refs.Modal.showModal();
            this.setState({
                text: "Your details have been successfully submitted. "
            });
        })
    }
    addUserEntity() {
        let entityObj;
        entityObj = this.state.user_entity_data;
        let entity = {
            company_name: "",
            company_uen: "",
            company_address: "",
            billing_address: "",
            bill_attention_to: "",
            contact_name: "",
            contact_email: "",
            contact_mobile_no: "",
            contact_office_no: "",
        }
        entityObj['ENTITY_LIST'][0].entities.splice(0, 0, entity);
        this.setState({
            user_entity_data: entityObj,
        })
    }
    Change(type, e) {
        let itemValue = e.target.value;
        switch (type) {
            case 'email_address':
                this.setState({ email_address: itemValue });
                break;
            case 'company_name':
                this.setState({ company_name: itemValue });
                break;
            case 'unique_entity_number':
                this.setState({ unique_entity_number: itemValue });
                break;
            case 'company_address':
                this.setState({ company_address: itemValue });
                break;
            case 'billing_address':
                this.setState({ billing_address: itemValue });
                break;
            case 'contact_name':
                this.setState({ contact_name: itemValue });
                break;
            case 'mobile_number':
                this.setState({ mobile_number: itemValue });
                break;
            case 'office_number':
                this.setState({ office_number: itemValue });
                break;
            case 'user_company_name':
                this.setState({ user_company_name: itemValue });
                break;
            case 'user_company_uen':
                this.setState({ user_company_uen: itemValue });
                break;
            case 'user_company_address':
                this.setState({ user_company_address: itemValue });
                break;
            case 'user_billing_address':
                this.setState({ user_billing_address: itemValue });
                break;
            case 'user_bill_attention_to':
                this.setState({ user_bill_attention_to: itemValue });
                break;
            case 'user_contact_name':
                this.setState({ user_contact_name: itemValue });
                break;
            case 'user_contact_email':
                this.setState({ user_contact_email: itemValue });
                break;
            case 'user_contact_mobile_no':
                this.setState({ user_contact_mobile_no: itemValue });
                break;
            case 'user_contact_office_no':
                this.setState({ user_contact_office_no: itemValue });
                break;

        }
    }
    showView() {
        this.refs.Modal_upload.showModal();
    }
    render() {
        let btn_html = <div>
            <button id="save_form" className="lm--button lm--button--primary" onClick={this.save.bind(this)}>Save</button>
            <button id="submit_form" className="lm--button lm--button--primary" onClick={this.submit.bind(this)}>Complete Sign Up</button>
        </div>;
        return (
            <div className="retailer_manage_coming">
                <div id="buyer_form" >
                    <div>
                        <div className="u-grid admin_invitation">
                            <div className="col-sm-12 col-md-6 push-md-3">
                                <h3 className="u-mt3 u-mb1">Buyer Register Page</h3>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Email:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="email_address" value={this.state.email_address} onChange={this.Change.bind(this, 'email_address')} disabled={this.state.disabled} ref="email_address" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" placeholder="Email" />
                                    </div>
                                </div>
                                <h4 className="u-mt1 u-mb1">Company Info</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_name" value={this.state.company_name} onChange={this.Change.bind(this, 'company_name')} disabled={this.state.disabled} ref="company_name" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Unique Entity Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="unique_entity_number" value={this.state.unique_entity_number} onChange={this.Change.bind(this, 'unique_entity_number')} disabled={this.state.disabled} ref="unique_entity_number" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Address
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="company_address" value={this.state.company_address} onChange={this.Change.bind(this, 'company_address')} disabled={this.state.disabled} ref="company_address" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Billing Address:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="billing_address" value={this.state.billing_address} onChange={this.Change.bind(this, 'billing_address')} disabled={this.state.disabled} ref="billing_address" maxLength="50" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <h4 className="u-mt1 u-mb1">Contact Information</h4>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="contact_name" value={this.state.contact_name} onChange={this.Change.bind(this, 'contact_name')} disabled={this.state.disabled} ref="contact_name" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Mobile Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="mobile_number" value={this.state.mobile_number} onChange={this.Change.bind(this, 'mobile_number')} disabled={this.state.disabled} ref="mobile_number" maxLength="50" pattern="^(\d{8})$" required aria-required="true" ></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Office Number:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="office_number" value={this.state.office_number} onChange={this.Change.bind(this, 'office_number')} disabled={this.state.disabled} ref="office_number" maxLength="50" pattern="^(\d{8})$" required aria-required="true" ></input>
                                    </div>
                                </div>


                                <h3 className="lm--formItem lm--formItem--inline string">Add Individial Info:</h3>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Upload Documents:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                        <UploadFile type="BUYER_DOCUMENTS" required="required" showlist={false} showList="1" col_width="10" showWay="2" fileData={this.state.fileData.BUYER_DOCUMENTS} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                        <div className="col-sm-12 col-md-2 u-cell">
                                            <button className="lm--button lm--button--primary" title="this is retailer upload documents" onClick={this.showView.bind(this)} >?</button>
                                        </div>
                                    </div>
                                </div>
                                <h5 className="lm--formItem lm--formItem--inline string">Electricity Puchese information:</h5>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr>  Puchese Entity/Company Name:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_company_name" style={{ background: '#35404c' }} value={this.state.user_company_name} onChange={this.Change.bind(this, 'user_company_name')} disabled={true} ref="user_company_name" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr>  Company UEN:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_company_uen" style={{ background: '#35404c' }} value={this.state.user_company_uen} onChange={this.Change.bind(this, 'user_company_uen')} disabled={true} ref="user_company_uen" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Company Address:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_company_address" style={{ background: '#35404c' }} value={this.state.user_company_address} onChange={this.Change.bind(this, 'user_company_address')} disabled={true} ref="user_company_address" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Billing Address:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_billing_address" value={this.state.user_billing_address} onChange={this.Change.bind(this, 'user_billing_address')} disabled={this.state.disabled} ref="user_billing_address" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Bill Attention To:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_bill_attention_to" value={this.state.user_bill_attention_to} onChange={this.Change.bind(this, 'user_bill_attention_to')} disabled={this.state.disabled} ref="user_bill_attention_to" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Name:
                               </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_contact_name" value={this.state.user_contact_name} onChange={this.Change.bind(this, 'user_contact_name')} disabled={this.state.disabled} ref="user_contact_name" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr>  Contact Email:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="buyer_attention" value={this.state.user_contact_email} onChange={this.Change.bind(this, 'user_contact_email')} disabled={this.state.disabled} ref="user_contact_email" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Mobile No.:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_contact_mobile_no" value={this.state.user_contact_mobile_no} onChange={this.Change.bind(this, 'user_contact_mobile_no')} disabled={this.state.disabled} ref="user_contact_mobile_no" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Contact Office No.:
                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <input type="text" name="user_contact_office_no" value={this.state.user_contact_office_no} onChange={this.Change.bind(this, 'user_contact_office_no')} disabled={this.state.disabled} ref="user_contact_office_no" maxLength="50" aria-required="true"></input>
                                    </div>
                                </div>
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">

                                    </label>
                                    <div className="lm--formItem-right lm--formItem-control u-grid mg0">

                                        <div className="col-sm-12 col-md-2 u-cell">
                                            <button className="lm--button lm--button--primary" title="this is retailer upload documents" onClick={this.addUserEntity.bind(this)} >+</button>
                                        </div>
                                    </div>
                                </div>
                                <UserEntity disabled={false} entityList={this.state.user_entity_data} ref="userEntity" />
                                <div className="lm--formItem lm--formItem--inline string">
                                    <label className="lm--formItem-left lm--formItem-label string required">
                                        <abbr title="required">*</abbr> Tenent Management Sences Required:
                               </label>
                                    <div className="lm--formItem-right lm--formItem-control">
                                        <select name="buyer_management" onChange={this.Change.bind(this, 'buyer_management')} defaultValue={this.state.buyer_management} disabled={this.state.disabled} ref="buyer_management" aria-required="true">
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_buyer_tc"} /> I agree to Seller - Buyer T&C &nbsp;&nbsp;&nbsp; <a target="_blank" href={this.state.buyerTCurl}>{this.state.buyerTCname}</a></h4>
                                <h4 className="lm--formItem lm--formItem--inline string"><input type="checkbox" name={"seller_revv_tc"} /> I agree to Seller - Revv T&C &nbsp;&nbsp;&nbsp;  <a target="_blank" href={this.state.revvTCurl}>{this.state.revvTCname}</a></h4>
                                <div className="retailer_btn">
                                    {btn_html}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal text={this.state.text} ref="Modal" />
                    <Modal listdetailtype="Buyer Documents Message" ref="Modal_upload" />

                </div>
            </div>
        )
    }
}

BuyerRegister.propTypes = {
    onSubmitjest: () => { }
};

function runs() {
    const domNode = document.getElementById('buyer_register');
    if (domNode !== null) {
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