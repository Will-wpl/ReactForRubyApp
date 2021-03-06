import React, { Component } from 'react';
import { validateNum, validateEmail, validator, setValidationFaild, setValidationPass, changeValidate } from '../../javascripts/componentService/util';
import { Modal } from '../shared/show-modal';
export class UserEntity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            itemList: this.props.entityList['ENTITY_LIST'],
            disabled: this.props.disabled,
            entity_data: {
                "ENTITY_LIST": [
                    { buttonName: "none", entities: [] }
                ]
            },
            deleteIndex: 0
        }
    }
    componentDidMount() {

    }
    Change(type, index, e) {
        let entityObj, entityData;
        entityObj = this.props.entityList['ENTITY_LIST'];
        entityData = this.state.entity_data;
        let itemValue = e.target.value;
        switch (type) {
            case 'company_name':
                entityObj[0].entities[index].company_name = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_company_name_' + index, itemValue);
                break;
            case 'company_uen':
                entityObj[0].entities[index].company_uen = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_company_uen_' + index, itemValue);
                break;
            case 'company_address':
                entityObj[0].entities[index].company_address = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_company_address_' + index, itemValue);
                break;
            case 'billing_address':
                entityObj[0].entities[index].billing_address = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_billing_address_' + index, itemValue);
                break;
            case 'bill_attention_to':
                entityObj[0].entities[index].bill_attention_to = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_bill_attention_to_' + index, itemValue);
                break;
            case 'contact_name':
                entityObj[0].entities[index].contact_name = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                changeValidate('user_contact_name_' + index, itemValue);
                break;
            case 'contact_email':
                entityObj[0].entities[index].contact_email = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                if (!validateEmail(itemValue)) {
                    setValidationFaild('user_contact_email_' + index, 2)
                } else {
                    setValidationPass('user_contact_email_' + index, 2)
                }
                break;
            case 'contact_mobile_no':
                entityObj[0].entities[index].contact_mobile_no = e.target.value;
                this.setState({
                    itemList: entityObj
                });
                if (!validateNum(itemValue)) {
                    setValidationFaild('user_contact_mobile_no_' + index, 2)
                } else {
                    setValidationPass('user_contact_mobile_no_' + index, 2)
                }
                break;
            case 'contact_office_no':
                entityObj[0].entities[index].contact_office_no = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                if (!validateNum(itemValue)) {
                    setValidationFaild('user_contact_office_no_' + index, 2)
                } else {
                    setValidationPass('user_contact_office_no_' + index, 2)
                }
                break;
        }
    }
    removeEntity(index, main_id) {

        if (this.props.usedEntity.indexOf(main_id) > -1) {
            this.setState({ text: "The entity have available auction can't be deleted!" });
            this.refs.Modal.showModal();
        }
        else {
            this.setState({
                deleteIndex: index
            })
            this.refs.Modal.showModal("comfirm");
            this.setState({ text: "Are you sure you want to delete?" });
        }

    }
    doAccept() {
        let entityObj, entityData;
        entityObj = this.state.itemList;
        entityData = this.state.entity_data;
        entityObj[0].entities.splice(this.state.deleteIndex, 1);
        entityData['ENTITY_LIST'][0].entities = entityObj[0].entities
        this.setState({
            itemList: entityData['ENTITY_LIST']
        })
        $('.validate_message').find('div').each(function () {
            let className = $(this).attr('class');
            if (className === 'errormessage') {
                let divid = $(this).attr("id");
                $("#" + divid).removeClass("errormessage").addClass("isPassValidate");
            }
        })
    }
    buildFrom() {
        let entityHtml = '';
        entityHtml = <div name="entitySub" className="entitySub">
            {
                (this.props.entityList['ENTITY_LIST'][0].entities.length > 0) ?
                    this.props.entityList['ENTITY_LIST'][0].entities.map((it, i) =>
                        <div key={i} style={{ marginTop: '20px', marginBottom: '20px', }} id={i}>
                            <div className="lm--formItem lm--formItem--inline string">
                                &nbsp;
                                <div className="lm--formItem-right lm--formItem-control errormessage" >
                                    &nbsp;  <span className={this.props.entityStatus === "manage" && it.approval_status === "2" ? "isDisplay" : "isHide"}> Waiting for administrator's approval.</span>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>  Purchase Entity/Company Name :
                                         </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"company_name_" + (i)} id={"company_name_" + (i)} value={it.company_name} onChange={this.Change.bind(this, 'company_name', i)} readOnly={this.props.disabled} ref="company_name" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_company_name_" + (i) + "_message"} >This field is required!</div>
                                    <div className='isPassValidate' id={"user_company_name_" + (i) + "_repeat"} >Company name has already been taken!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>  Company UEN :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"company_uen_" + i} id={"company_uen_" + i} value={it.company_uen} onChange={this.Change.bind(this, 'company_uen', i)} readOnly={this.props.disabled} ref="company_uen" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_company_uen_" + (i) + "_message"} >This field is required!</div>
                                    <div className='isPassValidate' id={"user_company_uen_" + (i) + "_repeat"} >Company UEN has already been taken!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr> Company Address :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"company_address_" + i} id={"company_address_" + i} value={it.company_address} onChange={this.Change.bind(this, 'company_address', i)} readOnly={this.props.disabled} ref="company_address" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_company_address_" + (i) + "_message"} >This field is required!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>    Billing Address :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"billing_address_" + i} id={"billing_address_" + i} value={it.billing_address} onChange={this.Change.bind(this, 'billing_address', i)} readOnly={this.props.disabled} ref="billing_address" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_billing_address_" + (i) + "_message"} >This field is required!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>    Bill Attention To :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"bill_attention_to_" + i} id={"bill_attention_to_" + i} value={it.bill_attention_to} onChange={this.Change.bind(this, 'bill_attention_to', i)} readOnly={this.props.disabled} ref="bill_attention_to" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_bill_attention_to_" + (i) + "_message"} >This field is required!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>     Contact Name :
                                             </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"contact_name_" + i} id={"contact_name_" + i} value={it.contact_name} onChange={this.Change.bind(this, 'contact_name', i)} readOnly={this.props.disabled} ref="contact_name" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_contact_name_" + (i) + "_message"} >This field is required!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>    Contact Email :
                                             </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"contact_email_" + i} value={it.contact_email} onChange={this.Change.bind(this, 'contact_email', i)} readOnly={this.props.disabled} ref="contact_email" aria-required="true" title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_contact_email_" + (i) + "_message"} >This field is required!</div>
                                    <div className='isPassValidate' id={"user_contact_email_" + (i) + "_format"} >Incorrect mail format.!</div>
                                    <div className='isPassValidate' id={"user_contact_email_" + (i) + "_repeat"} >Contact email has already been taken!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>    Contact Mobile No. :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"contact_mobile_no_" + i} id={"contact_mobile_no_" + i} value={it.contact_mobile_no} onChange={this.Change.bind(this, 'contact_mobile_no', i)} readOnly={this.props.disabled} ref="contact_mobile_no" aria-required="true" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_contact_mobile_no_" + (i) + "_message"} >This field is required!</div>
                                    <div className='isPassValidate' id={"user_contact_mobile_no_" + (i) + "_format"} >Number should contain 8 integers!</div>
                                </div>
                            </div>
                            <div className="lm--formItem lm--formItem--inline string">
                                <label className="lm--formItem-left lm--formItem-label string required">
                                    <abbr title="required">*</abbr>    Contact Office No. :
                                            </label>
                                <div className="lm--formItem-right lm--formItem-control">
                                    <input type="text" name={"contact_office_no_" + i} id={"contact_office_no_" + i} value={it.contact_office_no} onChange={this.Change.bind(this, 'contact_office_no', i)} readOnly={this.props.disabled} ref="contact_office_no" aria-required="true" maxLength="8" placeholder="Number should contain 8 integers." title="Please fill out this field"></input>
                                    <div className='isPassValidate' id={"user_contact_office_no_" + (i) + "_message"} >This field is required!</div>
                                    <div className='isPassValidate' id={"user_contact_office_no_" + (i) + "_format"} >Number should contain 8 integers!</div>
                                    <div className="delEntity" className={this.props.disabled ? "isHide" : "delEntity"}>
                                        <a onClick={this.removeEntity.bind(this, i, it.main_id)}> &nbsp; Delete</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                    <div >
                    </div>

            }
            <Modal text={this.state.text} acceptFunction={this.doAccept.bind(this)} ref="Modal" />
        </div>
        return entityHtml;
    }

    render() {
        return (
            <div className="col-sm-12 col-md-12" >
                {
                    this.buildFrom(this)
                }
            </div>
        )
    }
}