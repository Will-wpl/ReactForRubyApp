import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UploadFile } from '../shared/upload';
import { Modal } from '../shared/show-modal';
import moment from 'moment';


export class BuyerNewRequestManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "0",
            name: "",
            start_datetime: "",
            startDate: "",
            endDate: "",
            duration: "",
            single_multiple: "0",
            allow_deviation: "1",
            contract_duration_6: false,
            contract_duration_12: false,
            contract_duration_24: false,
            contract_6: '0',
            contract_12: '0',
            contract_24: '0',
            single_truely: false,
            published_date_time: '',
            text: "",
        }
        this.auction = {};
        this.hours = [];
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
        for (let i = 1; i < 121; i++) {
            this.hours.push(i);
        }
    }

    componentDidMount() {


    }

    checkSuccess() {

    }

    doValue(e) {
        let value = e.target.value;
        this.setState({
            name: value
        })
    }

    noPermitInput(event) {
        event.preventDefault();
    }

    single_multiple(type, e) {
        // let val = e.target.value;
        // type == "single_multiple" ? this.setState({ single_multiple: val }) : this.setState({ allow_deviation: val })
    }

    render() {
        return (
            <div>
                <div className="createRaMain u-grid">
                    <div className="col-sm-12 col-md-8 push-md-2">
                        <h2>Request New RA</h2>
                        <br />
                        <form action="" ref="CreatRaForm" method="post" id="CreatRaForm" onSubmit={this.checkSuccess.bind(this)}>
                            <dl className="vw-block vw-block-cols creatRa">
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Name of Reverse Auction :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <input type="test" value={this.state.name} onChange={this.doValue.bind(this)} ref="name" name="name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Single / Multiple Buyer(s) :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <select ref="single_multiple" id="single_multiple" onChange={this.single_multiple.bind(this, 'single_multiple')} value={this.state.single_multiple} disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)}>
                                            <option value="0">Single</option>
                                            <option value="1">Multiple</option>
                                        </select>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Contract Start Date :</span>
                                    <label className="col">
                                        {
                                            this.state.start_datetime === '' ? <DatePicker minDate={moment()} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.starttimeChange} />
                                                : <DatePicker disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} minDate={this.state.start_datetime} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.starttimeChange} />
                                        }
                                    </label>

                                </dd>
                               
                            </dl>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
BuyerNewRequestManage.propTypes = {
    onSubmitjest: () => { }
};


function runs() {
    const domNode = document.getElementById('buyer_new_request');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerNewRequestManage),
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
