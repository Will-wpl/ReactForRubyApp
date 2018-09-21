import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Modal } from '../shared/show-modal';
import { getEmailFile } from '../../javascripts/componentService/admin/service';
import { UploadFile } from '../shared/upload';
import TemplatesList from './admin_shared/template-list';
export default class CommonTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",size:'',
            uploadUrl: '/api/admin/user_attachments?file_type=',
            fileData: {
                "COMMON": [
                    { buttonName: "none", files: [] }
                ]
            }
        }
    }
    componentDidMount() {
        getEmailFile('COMMON').then(res => {
            let file = this.state.fileData;
            file.COMMON[0].files = res;
            this.setState({
                fileData: file
            })
        })
    }
    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="col-sm-12 buyer_list" id="template_registration">
                    <div className="admin_invitation lm--formItem lm--formItem--inline string u-mt2 u-mb2">
                        <label className="lm--formItem-left lm--formItem-label string required" >
                            <abbr title="required">*</abbr> Common templates :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <UploadFile type="COMMON" required="required" deleteType="userAttach" showList="1" col_width="10" showWay="1" fileData={this.state.fileData.COMMON} propsdisabled={false} uploadUrl={this.state.uploadUrl} />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

function run() {
    const domNode = document.getElementById('admin_common_template');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(CommonTemplates),
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