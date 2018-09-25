import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Modal } from '../shared/show-modal';
import { getEmailList, getEmailListItem, getEmailItemUpdate, getEmailFile } from '../../javascripts/componentService/admin/service';
import { UploadFile } from '../shared/upload';
import TemplatesList from './admin_shared/template-list';
export default class EmailTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "", size: '',
            email_list: [], template_type: '', template_id: '',
            listdetail: {}, la_list: [{ subject: "Parent LA template", id: 1 }, { subject: "Nominated LA template", id: 2 }], advisory_list: [{ subject: "Buyer market insights", id: 3 }],
            uploadUrl: '/api/admin/user_attachments?file_type=',
            fileData: {
                "LETTER_OF_AUTHORISATION": [
                    { buttonName: "none", files: [] }
                ]
            }
        }
    }
    componentDidMount() {
        
        getEmailList().then(res => {
            this.setState({ email_list: res });
        }, error => {

        })
        getEmailFile('LETTER_OF_AUTHORISATION').then(res => {
            let file = this.state.fileData;
            file.LETTER_OF_AUTHORISATION[0].files = res;
            this.setState({
                fileData: file
            })
        })
        $("#template_advisory").show();
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
                window.location.reload();
            }, 2000)
        }, error => {

        })
    }
    tab(type) {
        console.log(type)
        $(".buyer_tab a").removeClass("selected");
        $("#tab_" + type).addClass("selected");
        $(".buyer_list").hide();
        $("#template_" + type).fadeIn(500);
    }
    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="retailrank_main-new  col-md-8 col-sm-10 ">
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
                            <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                                <label className="lm--formItem-left lm--formItem-label string required" >
                                    <abbr title="required">*</abbr> Letter Of Authorisation :
                                </label>
                                <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                                    <UploadFile type="LETTER_OF_AUTHORISATION" required="required" deleteType="userAttach" showList="1" col_width="8" showWay="1" fileData={this.state.fileData.LETTER_OF_AUTHORISATION} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal formSize={this.state.size} modalSize={this.state.size} text={this.state.text} acceptFunction={this.changeEmail.bind(this)} listdetail={this.state.listdetail} listdetailtype="Email Template" ref="Modal" />
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