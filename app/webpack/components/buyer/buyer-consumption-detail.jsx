import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import AdminComsumptionList from './../admin/admin_shared/admin-comsumption-list';
import AdminComsumptionPrice from './../admin/admin_shared/admin-comsumption-price';
import { getBuyerListDetails } from '../../javascripts/componentService/common/service';

export default class BuyerConsumptionListDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumption_id: "",
            comsumption_list: [],
            purchase_list: [],
            price: {},
            detail: [],
            detail_index: 0,
            text: "",
            comment: "",
            dataVersion: "",
            past: false,
            auctionId: "",
            approvedStatus: "",
            isEntityVisit: false
        }
        this.datail_type = '3';
        this.type = 'View Consumption Details'

    }

    componentDidMount() {
        let id, entity_id;
        id = window.location.href.split("consumptions/")[1].split('&entity_id=')[0];
        entity_id = window.location.href.split("consumptions/")[1].split('&entity_id=')[1];
        let params = {
            id: id,
            entity_id: entity_id
        }
        console.log(params)
        getBuyerListDetails(params).then(res => {
            this.setState({
                consumption_id: id,
                comsumption_list: [res],
                dataVersion: res.consumption.contract_duration ? "1" : "",
                past: (res.consumption.accept_status === "0" || res.consumption.accept_status === "1" || res.auction_published == true) ? true : false,
                comment: res.consumption.comments ? res.consumption.comments : "",
                approvedStatus: setApprovalStatus(res.accept_status, res.approval_date_time)
            })
        }, error => {
        })
    }
    show_detail(index, consumption_id) {
        let obj = $("#comsumption_list_table_" + index);
        if (obj.is(":visible")) {
            obj.prev().removeClass("open");
            obj.slideUp(300);
        } else {
            obj.prev().addClass("open");
            obj.slideDown(300);
        }
    }

    render() {
        return (
            <div className="u-grid mg0 validate_message">
                <h2 className="u-mt2 u-mb2">View Consumption Details</h2>
                <div className="col-sm-12 u-mb3">
                    <AdminComsumptionList visible="visible" dataVersion={this.state.dataVersion} comsumption_list={this.state.comsumption_list} detail={this.show_detail.bind(this)} type={this.type} />
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('buyer_list_detail');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerConsumptionListDetail),
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