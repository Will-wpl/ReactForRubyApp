import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { createRa, raPublish, checkBuyerType, deleteSelectedBuyer } from '../../javascripts/componentService/admin/service';
import { getAuction } from '../../javascripts/componentService/common/service';
import { Modal } from '../shared/show-modal';
import { findUpLimitZero } from '../../javascripts/componentService/util';

export class CreateNewRA extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            name: "",
            start_datetime: "",
            startDate: "",
            endDate: "",
            duration: "",
            reserve_price: "", starting_price: "",
            left_name: this.props.left_name,
            btn_type: "", text: "", id: "0",
            edit_btn: "lm--button lm--button--primary show",
            edit_change: "lm--button lm--button--primary hide", contractArray: [], contract_end_list: [],
            disabled: false, live_modal: "", live_modal_do: "", holdOrend: "", checkArray: [],
            contract_duration_6: false, contract_duration_12: false, contract_duration_24: false,
            required: false, check_required: true, single_multiple: "1", allow_deviation: "1",
            contract_6: '0', contract_12: '0', contract_24: '0', single_truely: false, published_date_time: '',
            reverse_auction_end: '',
            live_auction_contracts: null, submit_btn: true
        }

        this.auction = {};
        this.newarray = [];
        this.auction_data = null;
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
        if (this.props.left_name) {//eidt
            if (this.props.disabled) {
                this.setState({
                    disabled: this.props.disabled
                })
            } else {
                this.setState({
                    disabled: true
                })
            }
            this.setState({
                editdisabled: this.props.editdisabled,
                live_modal: "live_hide"
            })
            this.doGetData();
        } else {//create
            this.doGetData("create")
        }
    }
    doGetData(type) {
        if (sessionStorage.auction_id == "new") {
            return;
        }
        getAuction('admin', sessionStorage.auction_id).then(res => {
            this.auction = res;
            if (type == "create") {
                if (this.auction.publish_status == 1) {
                    this.setState({
                        disabled: true,
                    })
                } else {
                    this.setState({
                        disabled: false,
                    })
                }
            } else {
                if (moment(this.auction.actual_begin_time) < moment() || this.auction.publish_status == 1) {
                    this.setState({
                        disabled: true
                    })
                }
            }
            if (res.name == null) {
                this.setState({
                    id: res.id,
                    single_multiple: res.buyer_type,
                    startDate: res.contract_period_start_date == null ? '' : moment(res.contract_period_start_date)
                })
            } else {
                this.setState({
                    id: res.id,
                    name: res.name == null ? '' : res.name,
                    start_datetime: res.start_datetime == null ? '' : moment(res.start_datetime),
                    startDate: res.contract_period_start_date == null ? '' : moment(res.contract_period_start_date),
                    endDate: res.contract_period_end_date == null ? '' : moment(res.contract_period_end_date),
                    duration: res.duration == null ? '' : res.duration,
                    reserve_price: res.reserve_price == null ? '' : this.padZero(res.reserve_price, '4'),
                    starting_price: res.starting_price == null ? '' : this.padZero(res.starting_price, '4'),
                    allow_deviation: res.allow_deviation,
                    single_multiple: res.buyer_type,
                    published_date_time: res.published_date_time,
                    reverse_auction_end: res.contract_period_start_date == null ? '' : moment(res.contract_period_start_date)
                });
                // this.setState({
                //     reverse_auction_end:moment(data)
                // })
                // let arr = res.live_auction_contracts.length>0 && res.publish_status == '1'?
                //     res.live_auction_contracts.map((item) => {return item.contract_duration;})
                //     :res.auction_contracts.map((item) => {return item.contract_duration;})
                let arr = res.auction_contracts.map((item) => { return item.contract_duration; })
                this.setState({ checkArray: arr.sort(this.sortNumber), contractArray: res.contract, contract_end_list: res.contract_end_list });

                this.setState({ live_auction_contracts: res.live_auction_contracts });
                res.auction_contracts.map((item) => {
                    let index = item.contract_duration;
                    switch (index) {
                        case "6": this.setState({ contract_duration_6: true, contract_6: item.id });
                            break
                        case "12": this.setState({ contract_duration_12: true, contract_12: item.id });
                            break
                        case "24": this.setState({ contract_duration_24: true, contract_24: item.id });
                            break
                    }
                    $("#starting_price_lt_peak_" + index).val(findUpLimitZero(item.starting_price_lt_peak));
                    $("#reserve_price_lt_peak_" + index).val(findUpLimitZero(item.reserve_price_lt_peak));
                    $("#starting_price_hts_peak_" + index).val(findUpLimitZero(item.starting_price_hts_peak));
                    $("#reserve_price_hts_peak_" + index).val(findUpLimitZero(item.reserve_price_hts_peak));
                    $("#starting_price_htl_peak_" + index).val(findUpLimitZero(item.starting_price_htl_peak));
                    $("#reserve_price_htl_peak_" + index).val(findUpLimitZero(item.reserve_price_htl_peak));
                    $("#starting_price_eht_peak_" + index).val(findUpLimitZero(item.starting_price_eht_peak));
                    $("#reserve_price_eht_peak_" + index).val(findUpLimitZero(item.reserve_price_eht_peak));
                    $("#starting_price_lt_off_peak_" + index).val(findUpLimitZero(item.starting_price_lt_off_peak));
                    $("#reserve_price_lt_off_peak_" + index).val(findUpLimitZero(item.reserve_price_lt_off_peak));
                    $("#starting_price_hts_off_peak_" + index).val(findUpLimitZero(item.starting_price_hts_off_peak));
                    $("#reserve_price_hts_off_peak_" + index).val(findUpLimitZero(item.reserve_price_hts_off_peak));
                    $("#starting_price_htl_off_peak_" + index).val(findUpLimitZero(item.starting_price_htl_off_peak));
                    $("#reserve_price_htl_off_peak_" + index).val(findUpLimitZero(item.reserve_price_htl_off_peak));
                    $("#starting_price_eht_off_peak_" + index).val(findUpLimitZero(item.starting_price_eht_off_peak));
                    $("#reserve_price_eht_off_peak_" + index).val(findUpLimitZero(item.reserve_price_eht_off_peak));
                })
                $("#starting_price_time").val(res.starting_price_time);
            }
            $("#time_extension option[value='" + res.time_extension + "']").attr("selected", true);
            $("#average_price option[value='" + res.average_price + "']").attr("selected", true);
            $("#retailer_mode option[value='" + res.retailer_mode + "']").attr("selected", true);
        })
    }
    padZero(num, n) {
        let len = num.toString().split('.')[1].length;
        while (len < n) {
            num = num + "0";
            len++;
        }
        return num;
    }
    doName(e) {
        let obj = e.target.value;
        this.setState({
            name: obj
        })
    }
    doDuration(e) {
        let obj = e.target.value;
        if (Number(obj) > 1380) {
            return false;
        }
        this.setState({
            duration: obj
        })
    }
    doPrice(e) {
        let obj = e.target.value;
        this.setState({
            reserve_price: obj
        })
    }
    startPrice(e) {
        let obj = e.target.value;
        this.setState({
            starting_price: obj
        })
    }
    starttimeChange(data) {
        if (this.state.endDate != '') {
            let selectDay = new Date(data.format());
            let endDay = new Date(this.state.endDate.format());
            if (selectDay < endDay) {
                this.setState({
                    startDate: data
                })
            } else {
                this.setState({
                    startDate: data,
                    endDate: data
                });
            }

        } else {
            this.setState({
                startDate: data
            })
        }
        this.setState({
            reverse_auction_end: moment(data)
        })

    }
    endtimeChange(data) {
        if (this.state.startDate != '') {
            let selectDay = new Date(data.format());
            let startDay = new Date(this.state.startDate.format());
            if (selectDay > startDay) {
                this.setState({
                    endDate: data
                })
            } else {
                this.setState({
                    startDate: data,
                    endDate: data
                });
            }
        } else {
            this.setState({
                endDate: data
            })

        }
    }
    dateChange(data) {
        this.setState({
            ra_date: data
        })
    }
    timeChange(data) {
        this.setState({
            start_datetime: data
        })
        // if (this.state.startDate != '') {
        //     if ((data - this.state.startDate) >= 0) {
        //         this.setState({
        //             startDate: ''
        //         })
        //     }
        // }
        if (this.state.endDate != '') {
            if ((data - this.state.endDate) >= 0) {
                this.setState({
                    endDate: ''
                })
            }
        }
    }
    auctionCreate(type, e) {
        if (type === "next") {
            this.setState({ required: true });
        } else {
            this.setState({ required: true });
        }
        if (this.state.checkArray.length > 0) {
            this.setState({ check_required: false });
        } else {
            this.setState({ check_required: true });
        }
        this.setState({
            btn_type: type
        })
    }
    edit() {
        this.setState({
            edit_btn: "lm--button lm--button--primary hide",
            edit_change: "lm--button lm--button--primary show",
            disabled: false
        })
    }
    Cancel() {
        this.setState({
            edit_btn: "lm--button lm--button--primary show",
            edit_change: "lm--button lm--button--primary hide",
            disabled: true
        })
        this.doGetData();
    }
    setAuction() {
        this.auction.id = this.state.id;
        //this.auction.contract_period_end_date= this.state.endDate.format().split("T")[0];
        this.auction.contract_period_start_date = this.state.startDate.format().split("T")[0];
        this.auction.duration = this.refs.duration.value;
        this.auction.name = this.refs.name.value;
        //this.auction.reserve_price= this.refs.reserve_price.value;
        this.auction.start_datetime = this.state.start_datetime.format();
        this.auction.actual_begin_time = moment(this.state.start_datetime.toDate()).format();
        this.auction.actual_end_time = moment(this.state.start_datetime.toDate()).add(this.refs.duration.value, 'minutes').format();
        this.auction.time_extension = this.refs.time_extension.value;
        this.auction.average_price = this.refs.average_price.value;
        //this.auction.starting_price= this.refs.starting_price.value;
        this.auction.retailer_mode = this.refs.retailer_mode.value;
        this.auction.auction_contracts = this.somefield();
        this.auction.buyer_type = this.state.single_multiple;
        this.auction.allow_deviation = this.state.allow_deviation;
        this.auction.starting_price_time = this.refs.starting_price_time.value;
        return this.auction;
    }
    somefield() {
        let somefield = [];
        this.state.checkArray.map((item) => {
            let obj = {
                starting_price_lt_peak: $("#starting_price_lt_peak_" + item).val(),
                reserve_price_lt_peak: $("#reserve_price_lt_peak_" + item).val(),
                starting_price_hts_peak: $("#starting_price_hts_peak_" + item).val(),
                reserve_price_hts_peak: $("#reserve_price_hts_peak_" + item).val(),
                starting_price_htl_peak: $("#starting_price_htl_peak_" + item).val(),
                reserve_price_htl_peak: $("#reserve_price_htl_peak_" + item).val(),
                starting_price_eht_peak: $("#starting_price_eht_peak_" + item).val(),
                reserve_price_eht_peak: $("#reserve_price_eht_peak_" + item).val(),
                starting_price_lt_off_peak: $("#starting_price_lt_off_peak_" + item).val(),
                reserve_price_lt_off_peak: $("#reserve_price_lt_off_peak_" + item).val(),
                starting_price_hts_off_peak: $("#starting_price_hts_off_peak_" + item).val(),
                reserve_price_hts_off_peak: $("#reserve_price_hts_off_peak_" + item).val(),
                starting_price_htl_off_peak: $("#starting_price_htl_off_peak_" + item).val(),
                reserve_price_htl_off_peak: $("#reserve_price_htl_off_peak_" + item).val(),
                starting_price_eht_off_peak: $("#starting_price_eht_off_peak_" + item).val(),
                reserve_price_eht_off_peak: $("#reserve_price_eht_off_peak_" + item).val(),
                contract_duration: item,
                id: item === '6' ? this.state.contract_6 : (item === '12' ? this.state.contract_12 : this.state.contract_24)
            }
            somefield.push(obj);
        })
        return JSON.stringify(somefield);
    }
    noPermitInput(event) {
        event.preventDefault();
    }
    clearNoNum(obj) {
        obj.target.value = obj.target.value.replace(/[^\d.]/g, "");
        obj.target.value = obj.target.value.replace(/\.{2,}/g, ".");
        obj.target.value = obj.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (obj.target.value.indexOf(".") < 0 && obj.target.value != "") {
            obj.target.value = parseFloat(obj.target.value);
        }
    }
    blurNoNum(obj) {
        obj.target.value = findUpLimitZero(obj.target.value);
    }

    mouthsHtml(mouth) {
        let months = []
        let flag = false;
        let has_eht = true;
        let has_htl = true;
        let has_hts = true;
        let has_lt = true;

        if (this.state.live_auction_contracts) {
            this.state.live_auction_contracts.map((item) => {
                months.push(item.contract_duration)
                if (mouth == item.contract_duration && this.auction.publish_status == '1') {
                    has_eht = item.has_eht
                    has_htl = item.has_htl
                    has_hts = item.has_hts
                    has_lt = item.has_lt
                }
            })
            if (this.state.live_auction_contracts.length > 0 && this.auction.publish_status == '1' && months.indexOf(mouth) == -1) {
                flag = true
            } else {
                flag = false
            }
        }

        const html = <div key={mouth} className={flag ? 'isHide' : 'isDisplay'}>
            <h3 id="dateMonth" month={mouth} className={"u-mt2 u-mb2"}>{mouth} months</h3>
            <div className="lm--formItem lm--formItem--inline string optional">
                <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th className={has_lt ? '' : 'isHide'}>LT</th>
                            <th className={has_hts ? '' : 'isHide'}>HTS</th>
                            <th className={has_htl ? '' : 'isHide'}>HTL</th>
                            <th className={has_eht ? '' : 'isHide'}>EHT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Peak<br/>(7am-7pm)</td>
                            <td className={has_lt ? '' : 'isHide'} id={'lt_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_lt_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_lt_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_hts ? '' : 'isHide'} id={'hts_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_hts_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_hts_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_htl ? '' : 'isHide'} id={'htl_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_htl_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_htl_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_eht ? '' : 'isHide'} id={'eht_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_eht_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_eht_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                        </tr>
                        <tr>
                            <td>Off Peak<br/>(7pm-7am)</td>
                            <td className={has_lt ? '' : 'isHide'} id={'lt_off_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_lt_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_lt_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_hts ? '' : 'isHide'} id={'hts_off_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_hts_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_hts_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_htl ? '' : 'isHide'} id={'htl_off_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_htl_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_htl_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                            <td className={has_eht ? '' : 'isHide'} id={'eht_off_peak_' + mouth}>
                                Starting:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"starting_price_eht_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} /><br />
                                Reserve:<input type="text" maxLength="6" onBlur={this.blurNoNum.bind(this)} onKeyUp={this.clearNoNum.bind(this)} aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891." id={"reserve_price_eht_off_peak_" + mouth} required={this.state.required} disabled={this.state.disabled} />
                                {/* <div className="peak_error">Reserve price must be smaller than or equal to starting price.</div> */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="peak_correct" id={"errmessage_" + mouth}>Reserve price must be smaller than or equal to starting price.</div>
        </div>
        return html;
    }
    sortNumber(a, b) {
        return a - b;
    }
    contractChange(type) {
        let arr = this.state.checkArray;
        switch (type.target.value) {
            case "6": this.setState({ contract_duration_6: type.target.checked });
                break
            case "12": this.setState({ contract_duration_12: type.target.checked });
                break
            case "24": this.setState({ contract_duration_24: type.target.checked });
                break
        }
        if (type.target.checked) {
            let turly = arr.find(item => {
                return item === type.target.value;
            })
            if (!turly) {
                arr.push(type.target.value);
            }
            arr.sort(this.sortNumber);
            this.setState({ checkArray: arr });
            //this.doGetData("create");
        } else {
            let arr = this.state.checkArray.filter(item => {
                return item != type.target.value
            })
            arr.sort(this.sortNumber);
            this.setState({ checkArray: arr });
        }
    }
    checkSubmitTruly() {
        let data = {};
        if (this.auction_data === null) {
            data = this.setAuction();
        } else {
            if (JSON.stringify(this.setAuction()) === JSON.stringify(this.auction_data)) {
                data = this.auction_data;
            } else {
                data = this.setAuction();
            }
        }
        return data;
    }
    single_multiple(type, e) {
        let val = e.target.value;
        type == "single_multiple" ? this.setState({ single_multiple: val }) : this.setState({ allow_deviation: val })
    }
    checkSuccess(event, obj) {

        event.preventDefault();
        if (!this.state.disabled) {
            let timeBar, k = true, peaktime;
            $("#errmessage_6").removeClass("peak_error").addClass("peak_correct");
            $("#errmessage_12").removeClass("peak_error").addClass("peak_correct");
            $("#errmessage_24").removeClass("peak_error").addClass("peak_correct");

            if (this.state.start_datetime < moment()) {
                $("#start_datetime .required_error").fadeIn(300);
                window.location.href = "#start_datetime";
                clearTimeout(timeBar);
                timeBar = setTimeout(() => {
                    $("#start_datetime .required_error").fadeOut(300);
                }, 5000)
                return false;
            }
            this.state.checkArray.map((item) => {
                if (parseFloat($('#starting_price_lt_peak_' + item).val()) < parseFloat($('#reserve_price_lt_peak_' + item).val())) {
                    $("#lt_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border")
                }
                else {

                    $("#lt_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_hts_peak_' + item).val()) < parseFloat($('#reserve_price_hts_peak_' + item).val())) {

                    $("#hts_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border")
                }
                else {

                    $("#hts_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_htl_peak_' + item).val()) < parseFloat($('#reserve_price_htl_peak_' + item).val())) {

                    $("#htl_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border")
                }
                else {

                    $("#htl_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_eht_peak_' + item).val()) < parseFloat($('#reserve_price_eht_peak_' + item).val())) {

                    $("#eht_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border")
                }
                else {

                    $("#eht_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_lt_off_peak_' + item).val()) < parseFloat($('#reserve_price_lt_off_peak_' + item).val())) {

                    $("#lt_off_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border")
                }
                else {

                    $("#lt_off_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_hts_off_peak_' + item).val()) < parseFloat($('#reserve_price_hts_off_peak_' + item).val())) {

                    $("#hts_off_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border");
                }
                else {

                    $("#hts_off_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_htl_off_peak_' + item).val()) < parseFloat($('#reserve_price_htl_off_peak_' + item).val())) {

                    $("#htl_off_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border");
                }
                else {

                    $("#htl_off_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }

                if (parseFloat($('#starting_price_eht_off_peak_' + item).val()) < parseFloat($('#reserve_price_eht_off_peak_' + item).val())) {

                    $("#eht_off_peak_" + item).find('input').removeClass("peak_correct_border").addClass("peak_error_border");
                }
                else {
                    $("#eht_off_peak_" + item).find('input').removeClass("peak_error_border").addClass("peak_correct_border");
                }
            })

            $(".retailer_fill").find('input').each(function () {
                let className = $(this).attr('class');
                if (className === 'peak_error_border') {
                    let type = $(this).attr("id")
                    let month = type.substr(parseInt(type.lastIndexOf("_")) + 1);
                    $("#errmessage_" + month).removeClass("peak_correct").addClass("peak_error");
                }
            })

            let errLength = $('.peak_error').length;
            if (errLength > 0) {
                return;
            }


            // clearTimeout(peaktime);
            // peaktime = setTimeout(() => {
            //     $(".peak_error").fadeOut(300);
            // }, 5000);
            // if (!k) { return };
            // if(this.state.reserve_price > this.state.starting_price){
            //     $("#reserve_price .required_error").fadeIn(300);
            //     window.location.href="#reserve_price";
            //     clearTimeout(timeBar);
            //     timeBar = setTimeout(()=>{
            //         $("#reserve_price .required_error").fadeOut(300);
            //     },5000);
            //     return false
            // }
        }
        this.setState({ submit_btn: false });
        if (this.state.btn_type == "save") {
            if (!this.auction.buyer_notify) {
                if (this.state.id > 0) {
                    let param = {
                        id: this.state.id,
                        buyer_type: this.state.single_multiple
                    }
                    checkBuyerType(param).then(res => {
                        if (res.count > 0) {
                            this.setState({
                                text: "Please note that by changing the selection for ‘Single/Multiple Buyer(s)’, buyer(s) previously selected for invitation will be refreshed."
                            })
                            // this.setBuyerChange();
                            this.refs.checkSelectedBuyerModal.showModal('chkSelectedBuyers', { action: 'proceed', method: "save" }, '');
                        }
                        else {
                            this.doSave();
                        }
                    })
                }
                else {
                    this.doSave();
                }
            }
            else {
                this.doSave();
            }

        }
        if (this.state.btn_type == "next") {
            sessionStorage.isAuctionId = "yes";
            if (!this.auction.buyer_notify) {
                if (this.state.id > 0) {
                    let param = {
                        id: this.state.id,
                        buyer_type: this.state.single_multiple
                    }
                    checkBuyerType(param).then(res => {
                        if (res.count > 0) {
                            this.setState({
                                text: "Please note that by changing the selection for ‘Single/Multiple Buyer(s)’, buyer(s) previously selected for invitation will be refreshed."
                            })
                            this.refs.checkSelectedBuyerModal.showModal('chkSelectedBuyers', { action: 'proceed', method: "next" }, '');
                        }
                        else {
                            this.doNext();
                        }
                    })
                }
                else {
                    this.doNext();
                }
            }
            else {
                this.doNext();
            }
        }
    }
    // setBuyerChange()
    // {
    //     this.setState({
    //         text: "Please note that by changing the selection for ‘Single/Multiple Buyer(s)’, buyer(s) previously selected for invitation will be refreshed."
    //     })
    // }
    doSave() {
        createRa({ auction: this.checkSubmitTruly() }).then(res => {
            this.setState({ submit_btn: true });
            this.auction_data = res;
            this.auction = res;
            this.refs.Modal.showModal();
            this.setState({ id: res.id })
            sessionStorage.auction_id = res.id;
            if (this.props.left_name) {
                this.setState({
                    text: this.auction.name + " has been successfully updated. "
                });
                this.doGetData();
            } else {
                this.setState({
                    text: this.auction.name + " has been successfully saved. "
                });
                this.doGetData('create');
            }
        }, error => {
            this.setState({
                text: 'Request exception,Save failed!'
            });
            this.refs.Modal.showModal();
        })
        if (this.props.left_name) {
            this.setState({
                edit_btn: "lm--button lm--button--primary show",
                edit_change: "lm--button lm--button--primary hide",
                disabled: true
            })
        }
    }
    doNext() {
        if (this.state.disabled) {
            window.location.href = `/admin/auctions/${this.auction.id}/invitation`;
        } else {
            createRa({ auction: this.checkSubmitTruly() }).then(res => {
                this.setState({ submit_btn: true });
                this.auction = res;
                sessionStorage.auction_id = res.id;
                window.location.href = `/admin/auctions/${res.id}/invitation`;
            }, error => {
                this.setState({
                    text: 'Request exception,Save failed!'
                });
                this.refs.Modal.showModal();
            })
        }
    }
    doRemoveBuyer(obj) {
        let param = {
            id: this.state.id,
            buyer_type: this.state.single_multiple
        }
        if (obj.action !== 'cancel') {
            if (obj.method === "save") {
                if (obj.action === "proceed") {
                    deleteSelectedBuyer(param).then(res => {
                        if (res.status === "1") {
                            this.doSave();
                        }
                    })
                }
                else {
                    this.setState({
                        disabled: false,
                        submit_btn: true
                    })
                }
            }

            if (obj.method === "next") {
                if (obj.action === "proceed") {
                    deleteSelectedBuyer(param).then(res => {

                        if (res.status === "1") {
                            this.doSave();
                            window.location.href = `/admin/auctions/${this.auction.id}/invitation`;
                            //this.doNext();
                        }
                    })
                }
                else {
                    this.setState({
                        disabled: false,
                        submit_btn: true
                    })
                }
            }
        }
        else {
            this.setState({
                disabled: false,
                submit_btn: true
            })
        }


    }
    render() {
        let left_name = "";
        let btn_html = "";
        let sStorage = {};
        let styleType = "";
        let publish = window.location.href.split("/");
        let status = publish[publish.length - 1];// new upcoming
        let url;
        if (status == "new") {
            url = "/admin/auctions/unpublished"
        } else {
            url = "/admin/auctions/published"
        }
        if (this.props.left_name == undefined) {//Create New Ra
            styleType = "col-sm-12 col-md-8 push-md-2";
            left_name = "Create New Reverse Auction";
            btn_html = <div className="createRa_btn">
                {this.state.disabled ? <div className="mask"></div> : ''}
                <button className="lm--button lm--button--primary" disabled={this.state.disabled ? true : (this.state.submit_btn ? false : true)} onClick={this.auctionCreate.bind(this, 'save')}>Save</button>
                <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this, 'next')}>Next</button>
            </div>
        } else {//edit
            styleType = "col-sm-12 col-md-8 push-md-2";
            left_name = this.props.left_name;
            btn_html = <div className="createRa_btn">
                {this.props.disabled ?
                    <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this, 'next')}>Next</button> :
                    <div>
                        <a className={this.state.edit_btn} onClick={this.edit.bind(this)}>Edit</a>
                        <a className={this.state.edit_change} onClick={this.Cancel.bind(this)}>Cancel</a>
                        <button className={this.state.edit_change} disabled={this.state.disabled ? true : (this.state.submit_btn ? false : true)} onClick={this.auctionCreate.bind(this, 'save')}>Save</button>
                        <button className="lm--button lm--button--primary" onClick={this.auctionCreate.bind(this, 'next')}>Next</button>
                    </div>}
            </div>
        }
        return (
            <div>
                <div className={"createRaMain u-grid " + this.state.live_modal_do}>
                    <div className={styleType}>
                        <h2>{left_name}</h2>
                        <br />
                        {this.auction.publish_status == '1' ? <h4>Published on {moment(this.state.published_date_time).format('DD MMM YYYY hh:mm a')}</h4> : ''}
                        <form action="" ref="CreatRaForm" method="post" id="CreatRaForm" onSubmit={this.checkSuccess.bind(this)}>
                            <dl className="vw-block vw-block-cols creatRa">
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Name of Reverse Auction :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <input type="test" value={this.state.name} onChange={this.doName.bind(this)} disabled={this.state.disabled ? true : (this.auction.publish_status == '1' ? true : false)} ref="name" name="name" maxLength="150" className="string optional" title="The length for Name of RA must not be longer than 150 characters." required aria-required="true"></input>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Contract Start Date :</span>
                                    <label className="col">
                                        {
                                            this.state.start_datetime === '' ? <DatePicker disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} minDate={moment()} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.starttimeChange} />
                                                : <DatePicker disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} minDate={this.state.start_datetime} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_start_date" name="contract_period_start_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.starttimeChange} />
                                        }
                                    </label>
                                    {/*<label className="col"><b>to</b></label>*/}
                                    {/*<label className="col">*/}
                                    {/*{*/}
                                    {/*this.state.start_datetime === '' ? <DatePicker disabled={this.state.disabled} minDate={moment()} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>*/}
                                    {/*:<DatePicker disabled={this.state.disabled} minDate={this.state.start_datetime} shouldCloseOnSelect={true} onKeyDown={this.noPermitInput.bind(this)} required aria-required="true" ref="contract_period_end_date" name="contract_period_end_date" className="date_ico" dateFormat="DD-MM-YYYY" selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate}  onChange = {this.endtimeChange}/>*/}
                                    {/*}*/}
                                    {/**/}
                                    {/*</label>*/}
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
                                {this.state.single_multiple == "0" ?
                                    <dd className="lm--formItem lm--formItem--inline string optional">
                                        <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Allow Deviations :</span>
                                        <label className="lm--formItem-right lm--formItem-control">
                                            <select ref="allow_deviation" id="allow_deviation" onChange={this.single_multiple.bind(this, 'allow_deviation')} value={this.state.allow_deviation} disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)}>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </label>
                                    </dd> : ''}
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Contract Duration :</span>
                                    <div className="lm--formItem-right lm--formItem-label lm--formItem-control">
                                        <label className={"checkbox_div"}><input className={"checkbox"} type="checkbox" required={this.state.check_required} ref="contract_duration_6" disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} name="contract_duration" value={"6"} id={"contract_duration_6"} checked={this.state.contract_duration_6} onChange={this.contractChange.bind(this)} /> 6 Months</label>
                                        <label className={"checkbox_div"}><input className={"checkbox"} type="checkbox" required={this.state.check_required} ref="contract_duration_12" disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} name="contract_duration" value={"12"} id={"contract_duration_12"} checked={this.state.contract_duration_12} onChange={this.contractChange.bind(this)} /> 12 Months</label>
                                        <label className={"checkbox_div"}><input className={"checkbox"} type="checkbox" required={this.state.check_required} ref="contract_duration_24" disabled={this.state.disabled ? true : (this.auction.buyer_notify ? true : false)} name="contract_duration" value={"24"} id={"contract_duration_24"} checked={this.state.contract_duration_24} onChange={this.contractChange.bind(this)} /> 24 Months</label>
                                    </div>
                                </dd>
                                {this.state.contract_end_list.length > 0 ?
                                    (<div>
                                        <dd className="lm--formItem lm--formItem--inline string optional">
                                            <span className="lm--formItem-left lm--formItem-label string optional">Contract End Date :</span>
                                            <div className="lm--formItem-right lm--formItem-control">
                                                {this.state.contract_end_list.map((item, index) => {
                                                    return <label key={index} className={'lm--formItem-label lm--formItem-control'}>Buyers on {item.contract_duration} months [ {item.contract_period_end_date} ] count [ {item.count} ] <a href={item.link} className="lm--button lm--button--primary">Details</a></label>
                                                })}
                                            </div>
                                        </dd>
                                        {/*{this.state.contractArray.map((item,index)=>{*/}
                                        {/*return <dd key={index} className="lm--formItem lm--formItem--inline string optional">*/}
                                        {/*<span className="lm--formItem-left lm--formItem-label string optional">Buyer on {item.contract_duration} mouths [{item.contract_period_end_date}]:</span>*/}
                                        {/*<label className="lm--formItem-right lm--formItem-label lm--formItem-control"><abbr>5</abbr><a href="#" className="lm--button lm--button--primary">Details</a></label>*/}
                                        {/*</dd>*/}
                                        {/*})}*/}
                                    </div>) : ''
                                }
                                <h3 className={"middleFont u-mb2"}>Reverse Auction Parameters</h3>
                                {/*<dd className="lm--formItem lm--formItem--inline string optional">*/}
                                    {/*<span className="lm--formItem-left lm--formItem-label string optional middleFont">Reverse Auction Parameters</span>*/}
                                {/*</dd>*/}
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Date/Time of Reverse Auction :</span>
                                    <label className="lm--formItem-right lm--formItem-control" id="start_datetime">
                                        <DatePicker selected={this.state.start_datetime} disabled={this.state.disabled} onKeyDown={this.noPermitInput.bind(this)} ref="start_datetime" shouldCloseOnSelect={true} name="start_datetime" showTimeSelect dateFormat="DD-MM-YYYY HH:mm" timeFormat="HH:mm" timeIntervals={1} className="time_ico" onChange={this.timeChange} minDate={moment()} maxDate={this.state.reverse_auction_end} title="Time must not be in the past." required aria-required="true" />
                                        <abbr ref="ra_duration_error" className="col">(SGT)</abbr>
                                        <div className="required_error">Auction Date/time must bigger than current time</div>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Duration (minutes) :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <input type="test" ref="duration" onChange={this.doDuration.bind(this)} value={this.state.duration} disabled={this.state.disabled} name="duration" maxLength="50" required aria-required="true" pattern="^[0-9]*[1-9][0-9]*$" title="Duration must be an integer."></input>
                                        <abbr ref="ra_duration_error" className="col"></abbr>
                                    </label>
                                </dd>
                                {/*<dd className="lm--formItem lm--formItem--inline string optional">*/}
                                {/*<span className="lm--formItem-left lm--formItem-label string optional">*/}
                                {/*<abbr title="required">*</abbr>Starting Price ($/kWh):</span>*/}
                                {/*<label className="lm--formItem-right lm--formItem-control">*/}
                                {/*<input type="test" ref="starting_price" onChange={this.startPrice.bind(this)} value={this.state.starting_price} disabled={this.state.disabled} name="starting_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Starting Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>*/}
                                {/*<abbr ref="ra_duration_error" className="col"></abbr>*/}
                                {/*</label>*/}
                                {/*</dd>*/}
                                {/*<dd className="lm--formItem lm--formItem--inline string optional">*/}
                                {/*<span className="lm--formItem-left lm--formItem-label string optional"><abbr title="required">*</abbr>Reserve Price ($/kWh):</span>*/}
                                {/*<label className="lm--formItem-right lm--formItem-control" id="reserve_price">*/}
                                {/*<input type="test" ref="reserve_price" onChange={this.doPrice.bind(this)} value={this.state.reserve_price} disabled={this.state.disabled} name="reserve_price" maxLength="50" required aria-required="true" pattern="^\d+(\.\d{4})$" title="Reserve Price must be a number with 4 decimal places, e.g. $0.0891/kWh." ></input>*/}
                                {/*<abbr ref="ra_duration_error" className="col"></abbr>*/}
                                {/*<div className="required_error">Reserve price must be smaller than or equal to starting price.</div>*/}
                                {/*</label>*/}

                                {/*</dd>*/}
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional">
                                        <abbr title="required">*</abbr>Time Extension :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <select ref="time_extension" id="time_extension" disabled={this.state.disabled}>
                                            <option value="0">Manual</option>
                                            <option value="1">Customize</option>
                                        </select>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional">
                                        <abbr title="required">*</abbr>Average Price :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <select ref="average_price" id="average_price" disabled={this.state.disabled}>
                                            <option value="0">Weighted Average</option>
                                        </select>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional">
                                        <abbr title="required">*</abbr>Retailer Mode :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <select ref="retailer_mode" id="retailer_mode" disabled={this.state.disabled}>
                                            <option value="0">Mode 1: Top 2</option>
                                            <option value="1">Mode 2: 1st, 2nd</option>
                                        </select>
                                    </label>
                                </dd>
                                <dd className="lm--formItem lm--formItem--inline string optional">
                                    <span className="lm--formItem-left lm--formItem-label string optional">
                                        <abbr title="required">*</abbr>Time to Display Starting Price :</span>
                                    <label className="lm--formItem-right lm--formItem-control">
                                        <select ref="starting_price_time" id="starting_price_time" disabled={this.state.disabled}>
                                            {this.hours.map((item) => {
                                                return <option key={item} value={item}>{item}</option>
                                            })}
                                        </select>
                                        <div>hours before auction start time</div>
                                    </label>
                                </dd>
                                {this.state.checkArray.map((item) => {
                                    return this.mouthsHtml(item);
                                })}
                            </dl>
                            {btn_html}
                        </form>
                        <Modal text={this.state.text} ref="Modal" />
                        <Modal text={this.state.text} ref="checkSelectedBuyerModal" acceptFunction={this.doRemoveBuyer.bind(this)} />
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href={url}>Back</a>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('createNewRA');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(CreateNewRA),
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