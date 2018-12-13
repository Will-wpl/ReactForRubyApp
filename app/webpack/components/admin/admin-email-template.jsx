import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Modal } from '../shared/show-modal';
import { getEmailList, getEmailListItem, getEmailItemUpdate, getEmailFile, getTemplate } from '../../javascripts/componentService/admin/service';
import { UploadFile } from '../shared/upload';
import TemplatesList from './admin_shared/template-list';
import loadingPic from '../../images/loading.gif'

export default class EmailTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "", size: '',
            email_list: [], template_type: '', template_id: '',
            listdetail: {},
            la_list: [],
            advisory_list: [],
            currentTab: "",
            uploadUrl: '/api/admin/user_attachments?file_type=',
            fileData: {
                "LETTER_OF_AUTHORISATION": [
                    { buttonName: "none", files: [] }
                ]
            },
            fileDataBuyer: {
                "LETTER_OF_AUTHORISATION_BUYER": [
                    { buttonName: "none", files: [] }
                ]
            },
            fileDataRetailer: {
                "LETTER_OF_AUTHORISATION_RETAILER": [
                    { buttonName: "none", files: [] }
                ]
            }
        }
    }

    componentWillMount() {
        let tab = "advisory";
        if (window.location.href.indexOf("currentTab") > -1) {
            tab = window.location.href.split("=")[1];
        }
        this.setState({
            currentTab: tab
        })
    }

    componentDidMount() {
        let ad = [], la = [];
        getTemplate().then(res => {
            if (res) {
                res.map(item => {
                    let entity = {
                        name: item.name,
                        id: item.type,
                        updated_at: item.updated_at
                    }
                    if (item.type === 3) {
                        ad.push(entity)
                    }
                    else {
                        la.push(entity)
                    }
                })
            }
            this.setState({
                la_list: la,
                advisory_list: ad
            })
            this.setDefaultTab(this.state.currentTab);

        })

        getEmailList().then(res => {
            this.setState({ email_list: res });

        }, error => {

        })
        getEmailFile('LETTER_OF_AUTHORISATION_BUYER').then(res => {
            let file = this.state.fileDataBuyer;
            file.LETTER_OF_AUTHORISATION_BUYER[0].files = res;
            this.setState({
                fileDataBuyer: file
            })
        })
        getEmailFile('LETTER_OF_AUTHORISATION_RETAILER').then(res => {
            let file = this.state.fileDataRetailer;
            file.LETTER_OF_AUTHORISATION_RETAILER[0].files = res;
            this.setState({
                fileDataRetailer: file
            })
        })
    }

    setDefaultTab(type) {
        $("#template_advisory").show();
        switch (type) {
            case "advisory":
                this.tab("advisory");
                $("#template_advisory").show();
                break;
            case "email":
                this.tab("email");
                $("#template_email").show();
                break;
            case "la":
                this.tab("la");
                $("#template_la").show();
                break;
            case "registration":
                this.tab("registration");
                $("#tab_registration").show();
                break;
            default:
                this.tab(advisory);
                $("#template_advisory").show();
                break;
        }
    }
    showEmail(id, type) {
        getEmailListItem(id, type).then(res => {
            this.setState({ listdetail: res, text: '', template_type: type, template_id: id, size: 'big' });
            this.refs.Modal.showModal('comfirm', res, type == 'la' || type == 'advisory' ? 'email_template_la' : 'email_template');
        })
    }
    changeEmail(obj) {
        getEmailItemUpdate(obj, this.state.template_type, this.state.template_id).then(res => {
            this.setState({ text: "Update Successful!", size: 'small' });
            this.refs.Modal.showModal();
            setTimeout(() => {
                window.location.href = "/admin/templates?currentTab=" + this.state.currentTab
                // window.location.reload();
            }, 1000)
        }, error => {

        })
    }
    tab(type) {
        $(".buyer_tab a").removeClass("selected");
        $("#tab_" + type).addClass("selected");
        $(".buyer_list").hide();
        $("#template_" + type).fadeIn(500);
        this.setState({
            currentTab: type
        })
    }

    refresh(type) {
        if (type === "buyer") {
            let total = this.state.fileDataBuyer.LETTER_OF_AUTHORISATION_BUYER[0].files.length;
            if (total === 2) {
                let attachment = {
                    id: this.state.fileDataBuyer.LETTER_OF_AUTHORISATION_BUYER[0].files[1].id,
                    file_name: this.state.fileDataBuyer.LETTER_OF_AUTHORISATION_BUYER[0].files[1].file_name,
                    file_path: this.state.fileDataBuyer.LETTER_OF_AUTHORISATION_BUYER[0].files[1].file_path
                }
                let fileObj = this.state.fileDataBuyer;
                fileObj['LETTER_OF_AUTHORISATION_BUYER'][0].files = [];
                fileObj['LETTER_OF_AUTHORISATION_BUYER'][0].files.push(attachment)
                this.setState({
                    fileDataBuyer: fileObj
                })
            }
        }
        else {
            let total = this.state.fileDataRetailer.LETTER_OF_AUTHORISATION_RETAILER[0].files.length;
            if (total === 2) {
                let attachment = {
                    id: this.state.fileDataRetailer.LETTER_OF_AUTHORISATION_RETAILER[0].files[1].id,
                    file_name: this.state.fileDataRetailer.LETTER_OF_AUTHORISATION_RETAILER[0].files[1].file_name,
                    file_path: this.state.fileDataRetailer.LETTER_OF_AUTHORISATION_RETAILER[0].files[1].file_path
                }
                let fileObj = this.state.fileDataRetailer;
                fileObj['LETTER_OF_AUTHORISATION_RETAILER'][0].files = [];
                fileObj['LETTER_OF_AUTHORISATION_RETAILER'][0].files.push(attachment)
                this.setState({
                    fileDataRetailer: fileObj
                })
            }
        }

    }

    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="retailrank_main-new col-sm-12 col-md-10 push-md-1 ">
                    <div className="admin_buyer_list col-sm-12 col-md-12">
                        <div className="col-sm-12 buyer_tab">
                            <a className="col-sm-4 col-md-2 selected" onClick={this.tab.bind(this, 'advisory')} id="tab_advisory">Advisory Templates</a>
                            <a className="col-sm-4 col-md-2" onClick={this.tab.bind(this, 'email')} id="tab_email">Email Templates</a>
                            <a className="col-sm-4 col-md-3" onClick={this.tab.bind(this, 'la')} id="tab_la">Letter of Award Templates</a>
                            <a className="col-sm-4 col-md-2" onClick={this.tab.bind(this, 'registration')} id="tab_registration">Registration Templates</a>
                        </div>
                        <div className="col-sm-12 buyer_list" id="template_advisory">
                            <TemplatesList type={"advisory"} email_list={this.state.advisory_list} showEmail={this.showEmail.bind(this)} />
                        </div>
                        <div className="col-sm-12 buyer_list" id="template_email">
                            <TemplatesList type={"email"} email_list={this.state.email_list} showEmail={this.showEmail.bind(this)} />
                        </div>
                        <div className="col-sm-12 buyer_list" id="template_la">
                            <TemplatesList type={"la"} email_list={this.state.la_list} showEmail={this.showEmail.bind(this)} />
                        </div>
                        <div className="col-sm-12 buyer_list" id="template_registration">
                            {/* <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                                <label className="lm--formItem-left lm--formItem-label string required" >
                                    <abbr title="required">*</abbr> Letter Of Authorisation :
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    <UploadFile loading="true" type="LETTER_OF_AUTHORISATION" required="required" deleteType="userAttach" showList="1" col_width="8" showWay="1" fileData={this.state.fileData.LETTER_OF_AUTHORISATION} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                </div>
                            </div> */}
                            <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                                <label className="lm--formItem-left lm--formItem-label string required" >
                                    <abbr title="required">*</abbr> Duly signed Declaration Form(Buyer) :
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    <UploadFile loading="true" type="LETTER_OF_AUTHORISATION_BUYER" calbackFn={this.refresh.bind(this, "buyer")} required="required" showList="1" col_width="8" showWay="0" fileData={this.state.fileDataBuyer.LETTER_OF_AUTHORISATION_BUYER} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                </div>
                            </div>
                            <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                                <label className="lm--formItem-left lm--formItem-label string required" >
                                    <abbr title="required">*</abbr> Duly signed Declaration Form(Retailer) :
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    <UploadFile loading="true" type="LETTER_OF_AUTHORISATION_RETAILER" calbackFn={this.refresh.bind(this, 'retailer')} required="required" showList="1" col_width="8" showWay="0" fileData={this.state.fileDataRetailer.LETTER_OF_AUTHORISATION_RETAILER} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal formSize={this.state.size} modalSize={this.state.size} text={this.state.text} acceptFunction={this.changeEmail.bind(this)} listdetail={this.state.listdetail} listdetailtype="Email Template" ref="Modal" />
                <div id="bg"></div>
                <div id="show">
                    <img src={loadingPic} id="isLoading" />
                </div>

            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('admin_email_template');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(EmailTemplates),
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