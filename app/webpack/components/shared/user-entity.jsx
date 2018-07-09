import React, { Component } from 'react';


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
        }
    }
    componentDidMount() {

    }
    Change(type, index, e) {

        let entityObj, entityData;;
        entityObj = this.state.itemList;
        entityData = this.state.entity_data;
        let itemValue = e.target.value;
        switch (type) {
            case 'company_name':
                entityObj[0].entities[index].company_name = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'company_uen':
                entityObj[0].entities[index].company_uen = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'company_address':
                entityObj[0].entities[index].company_address = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'billing_address':
                entityObj[0].entities[index].billing_address = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'bill_attention_to':
                entityObj[0].entities[index].bill_attention_to = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'contact_name':
                entityObj[0].entities[index].contact_name = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'contact_email':
                entityObj[0].entities[index].contact_email = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'contact_mobile_no':
                entityObj[0].entities[index].contact_mobile_no = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
            case 'contact_office_no':
                entityObj[0].entities[index].contact_office_no = e.target.value;
                this.setState({
                    itemList: entityObj
                })
                break;
        }
    }
    removeEntity(index) {

        let entityObj, entityData;
        entityObj = this.state.itemList;
        entityData = this.state.entity_data;
        let entityList = entityObj[0].entities.splice(index, 1);
        entityData['ENTITY_LIST'][0].entities = entityList;
        this.setState({
            itemList: entityData['ENTITY_LIST']
        })
    }

    buildFrom() {
        let entityHtml = '';
        entityHtml = <div className="">
            {
                this.state.itemList ?
                    this.state.itemList.map((item, index) =>
                        <div key={index}>
                            {
                                item.entities.map((it, i) => {
                                    return <div key={i} style={{ marginTop: '20px', marginBottom: '20px', }}>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>  Puchese Entity/Company Name:
                                         </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="company_name" value={it.company_name} onChange={this.Change.bind(this, 'company_name', i)} disabled={this.state.disabled} ref="company_name" maxLength="50" aria-required="true" title="Contact Number should contain 8 integers."></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>  Company UEN:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="company_uen" value={it.company_uen} onChange={this.Change.bind(this, 'company_uen', i)} disabled={this.state.disabled} ref="company_uen" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr> Company Address:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="company_address" value={it.company_address} onChange={this.Change.bind(this, 'company_address', i)} disabled={this.state.disabled} ref="company_address" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>    Billing Address:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="billing_address" value={it.billing_address} onChange={this.Change.bind(this, 'billing_address', i)} disabled={this.state.disabled} ref="billing_address" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>    Bill Attention To:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="bill_attention_to" value={it.bill_attention_to} onChange={this.Change.bind(this, 'bill_attention_to', i)} disabled={this.state.disabled} ref="bill_attention_to" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>     Contact Name:
                                             </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="contact_name" value={it.contact_name} onChange={this.Change.bind(this, 'contact_name', i)} disabled={this.state.disabled} ref="contact_name" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>    Contact Email:
                                             </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="contact_email" value={it.contact_email} onChange={this.Change.bind(this, 'contact_email', i)} disabled={this.state.disabled} ref="contact_email" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>    Contact Mobile No.:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="contact_mobile_no" value={it.contact_mobile_no} onChange={this.Change.bind(this, 'contact_mobile_no', i)} disabled={this.state.disabled} ref="contact_mobile_no" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">
                                                <abbr title="required">*</abbr>    Contact Office No.:
                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                <input type="text" name="contact_office_no" value={it.contact_office_no} onChange={this.Change.bind(this, 'contact_office_no', i)} disabled={this.state.disabled} ref="contact_office_no" maxLength="50" aria-required="true"></input>
                                            </div>
                                        </div>
                                        <div className="lm--formItem lm--formItem--inline string">
                                            <label className="lm--formItem-left lm--formItem-label string required">

                                            </label>
                                            <div className="lm--formItem-right lm--formItem-control u-grid mg0">

                                                <div className="col-sm-12 col-md-2 u-cell">
                                                    <button className="lm--button lm--button--primary" onClick={this.removeEntity.bind(this, i)}>-</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    ) :
                    <div >

                    </div>

            }
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