import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
//import {DuringCountDown} from '../shared/during-countdown';

export class RetailerManage extends Component {
    constructor(props){
        super(props);
    }
    render () {
        return (
            <div>
            <TimeCuntDown />
            {/* <DuringCountDown /> */}
            <form method="post" action="">
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    <h3 className="u-mt3 u-mb1">Section A:Information on Reverse Auction</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Specifications:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Briefing Pack:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div>
                    <h3 className="u-mt3 u-mb1">Section B:Contact Person Details for Actual Day of Reverse Auction</h3>
                    <h4 className="lm--formItem lm--formItem--inline string">Main Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_name" maxLength="150" required aria-required="true" title="The length must not be longer than 150 characters and must not contain numbers"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_email" maxLength="50" required aria-required="true" pattern="^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$" title="Email must have @."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_mobile" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_Office" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <h4 className="lm--formItem lm--formItem--inline string">Alternative Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_name_n" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_email_n" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_mobile_n" maxLength="50"></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="retailer_Office_n" maxLength="50"></input>
                        </div>
                    </div>
                    <h3 className="u-mt3 u-mb1"><abbr title="required">*</abbr>Section C:Starting Bid Price</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                            <thead>
                                <tr><th></th><th>LT</th><th>HT(Small)</th><th>HT(Large)</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Peak</td>
                                    <td>$ 0.<input type="tel" className="col" name="peak_lt" required aria-required="true" pattern="^(\d{4})$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="peak_ht_small" required aria-required="true" pattern="^(\d{4})$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="peak_ht_large" required aria-required="true" pattern="^(\d{4})$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Off-Peak</td>
                                    <td>$ 0.<input type="tel" name="offpeak_lt"></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="offpeak_ht_small" required aria-required="true" pattern="^(\d{4})$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" name="offpeak_ht_large" required aria-required="true" pattern="^(\d{4})$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="retailer_btn">
                        {/* <button className="lm--button lm--button--primary">Reject Participation</button> */}
                        <button className="lm--button lm--button--primary">Submit</button>
                    </div>
                </div>
            </div>
            </form>
            </div>
        )
    }
}






function runs() {
    const domNode = document.getElementById('retailerManage');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerManage),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}