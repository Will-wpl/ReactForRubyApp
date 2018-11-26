import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { saveBuyerAttachmentModification, getNeedBuyerApproveAttachments } from './../../javascripts/componentService/common/service';
import { setValidationFaild, setValidationPass } from './../../javascripts/componentService/util';

export class BuyerTCUploadApprove extends Component {
    constructor(props) {
        super(props);
        this.state = {
            epaIsExist: false,
            epaUrl: "",
            epaChecked: false,
            bptIsExist: false,
            bptUrl: "",
            bptChecked: false
        }
    }


    componentDidMount() {
        getNeedBuyerApproveAttachments().then(res => {
            if (res.user) {
                if (res.user.agree_seller_buyer === null || res.user.agree_seller_buyer === '0') {
                    this.setState({
                        epaIsExist: true
                    })
                }
                if (res.user.agree_buyer_revv === null || res.user.agree_buyer_revv === '0') {
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
                    if (item.file_type === "BUYER_REVV_TC" && this.state.bptIsExist) {
                        this.setState({
                            bptUrl: item.file_path
                        })
                    }
                })
            }
        })
    }

    Change(type, e) {
        let itemValue = e.target.value;
        switch (type) {
            case 'chkEPA':
                if ($('#chkEPA').is(':checked')) {
                    this.setState({ epaChecked: true })
                    setValidationPass('chkEPA', 1)
                } else {
                    this.setState({ epaChecked: false })
                    setValidationFaild('chkEPA', 1);
                }
                break;
            case 'chkBPT':
                if ($('#chkBPT').is(':checked')) {
                    this.setState({ bptChecked: true })
                    setValidationPass('chkBPT', 1)
                } else {
                    this.setState({ bptChecked: false })
                    setValidationFaild('chkBPT', 1);
                }
                break;
        }
    }
    checkSuccess() {
        if ($('#chkEPA').is(':checked')) {
            setValidationPass('chkEPA', 1);
        } else {
            setValidationFaild('chkEPA', 1);
        }
        if ($('#chkBPT').is(':checked')) {
            setValidationPass('chkBPT', 1);
        } else {
            setValidationFaild('chkBPT', 1);
        }
        let epa = true, bpt = true;
        if (this.state.epaIsExist) {
            epa = this.state.epaChecked ? true : false;
        }
        if (this.state.bptIsExist) {
            bpt = this.state.bptChecked ? true : false;
        }
        return epa && bpt;
    }
    doSubmit() {
        if (this.checkSuccess()) {
            saveBuyerAttachmentModification().then(res => {
                setTimeout(() => {
                    window.location.href = '/buyer/home';
                }, 1000)
            })
        }
    }
    render() {
        return (
            <div>
                <div className="live_modal_approve_attachment">
                    <div className="attachment">
                        <div className="title">The <span className={this.state.epaIsExist ? "displayline" : "isHide"}><a href={this.state.epaUrl} target="_blank">[Electricity Procurement Agreement]</a></span><span className={(this.state.bptIsExist && this.state.epaIsExist) ? "displayline" : "isHide"}>, </span><span className={this.state.bptIsExist ? "displayline" : "isHide"}><a href={this.state.bptUrl} target="_blank">[Buyer Platform Terms of Use]</a></span><span className={(this.state.epaIsExist && this.state.bptIsExist) ? "displayline" : "isHide"}> have</span><span className={(this.state.epaIsExist && this.state.bptIsExist) ? "isHide" : "displayline"}> has</span> been amended. Please confirm:</div>
                        {this.state.epaIsExist ? <div><h4 className="lm--formItem lm--formItem--inline string checkBuyer"><input type="checkbox" id="chkEPA" onChange={this.Change.bind(this, 'chkEPA')} required /><span>Check here to indicate that you have read and agree to the latest Electricity Procurement Agreement. </span></h4>
                            <div id="chkEPA_message" className="isPassValidate" style={{ marginLeft: "33px" }}>Please check this box if you want to proceed.</div>
                        </div> : <div></div>}
                        {this.state.bptIsExist ? <div><h4 className="lm--formItem lm--formItem--inline string checkBuyer"><input type="checkbox" id="chkBPT" onChange={this.Change.bind(this, 'chkBPT')} required /><span>Check here to indicate that you have read and agree to the latest Buyer Platform Terms of Use. </span></h4>
                            <div id="chkBPT_message" className="isPassValidate" style={{ marginLeft: "33px" }}> Please check this box if you want to proceed.</div>
                        </div> : <div></div>}
                        <br/>
                        <h4>The amended terms & conditions will not be applicable to (i) upcoming Reverse Auctions that you have already been invited to participate in, (ii) Reverse Auctions that are in progress, and (iii) Reverse Auctions that had already been completed.</h4>
                            {/*Note: The changes to the terms & conditions will not be applicable  to (I) upcoming auctions that you have already been invited to participate in, (ii) auctions that are in progress, and (iii) auctions that had already been completed.*/}
                        <br/>
                    </div>
                    <div className="col-sm-12 col-md-12 u-grid btnProceed">
                        <div className="col-md-10 u-cell">
                        </div>
                        <div className="col-md-2 u-cell">
                            <button className="lm--button lm--button--primary" onClick={this.doSubmit.bind(this)}>Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BuyerTCUploadApprove.propTypes = { onAddClick: () => { } };

function run() {
    const domNode = document.getElementById('buyer_upload_new_attachment');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerTCUploadApprove),
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