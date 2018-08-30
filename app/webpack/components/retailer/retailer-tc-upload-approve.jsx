import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { saveRetailerAttachmentModification, getNeedRetailerApproveAttachments } from './../../javascripts/componentService/retailer/service';
export class RetailerTCUploadApprove extends Component {
    constructor(props) {
        super(props);
        this.state = {
            epaIsExist: false,
            epaUrl: "",
            bptIsExist: false,
            bptUrl: ""
        }
    }

    componentDidMount() {
        getNeedRetailerApproveAttachments().then(res => {
            if (res.user) {
                if (res.user.agree_seller_buyer === null || res.user.agree_seller_buyer === '0') {
                    this.setState({
                        epaIsExist: true
                    })
                }
                if (res.user.agree_seller_revv === null || res.user.agree_seller_revv === '0') {
                    this.setState({
                        bptIsExist: true
                    })
                }
            }
            if (res.attachments) {
                res.attachments.map((item) => {
                    if (item.file_type === "SELLER_BUYER_TC" && this.state.epaIsExist) {
                        this.setState({
                            epaUrl: item.file_path
                        })
                    }
                    if (item.file_type === "SELLER_REVV_TC" && this.state.bptIsExist) {
                        this.setState({
                            bptUrl: item.file_path
                        })
                    }
                })
            }
        })
    }

    Change(type) {

    }
    checkSuccess() {
        saveRetailerAttachmentModification().then(res => {
            window.location.href = `/retailer/home`;
        })
    }
    doSubmit() {
    }
    render() {
        return (
            <form name="retailer_form" method="get" onSubmit={this.checkSuccess.bind(this)}>
                <div className="live_modal_approve_attachment">
                <div className="attachment">
                    <div className="title">The <span className={this.state.epaIsExist ? "displayline" : "isHide"}><a href={this.state.epaUrl} target="_blank">[Electricity Procurement Agreement]</a></span><span className={(this.state.bptIsExist && this.state.epaIsExist) ? "displayline" : "isHide"}>, </span><span className={this.state.bptIsExist ? "displayline" : "isHide"}><a href={this.state.bptUrl} target="_blank">[Seller Platform Terms of Use]</a></span> have changed. Please confirm:</div>
                        {this.state.epaIsExist ? <div><h4 className="lm--formItem lm--formItem--inline string checkBuyer"><input type="checkbox" id="chkEPA" name="epa" onChange={this.Change.bind(this, 'chkRevv')} required /><span>Check here to indicate that you have read and agree to the ELectrictiy Procurement Agreement. </span></h4></div> : <div></div>}
                        {this.state.bptIsExist ? <div><h4 className="lm--formItem lm--formItem--inline string checkBuyer"><input type="checkbox" id="chkBPT" name="bpt" onChange={this.Change.bind(this, 'chkBuyer')} required /><span>Check here to indicate that you have read and agree to the Seller Platform Terms of Use. </span></h4></div> : <div></div>}
                    </div>
                    <div className="col-sm-12 col-md-12 u-grid  btnProceed">
                        <div className="col-md-10 u-cell">
                        </div>
                        <div className="col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this)}>Proceed</button>
                        </div>
                    </div>
                </div>
            </form >
        )
    }
}

RetailerTCUploadApprove.propTypes = { onAddClick: () => { } };

function run() {
    const domNode = document.getElementById('retailer_upload_new_attachment');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(RetailerTCUploadApprove),
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