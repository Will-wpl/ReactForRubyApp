import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {getBuyerRequestEnttiy} from './../../javascripts/componentService/common/service';
import moment from 'moment';
export class BuyerRequestEntityListManage extends Component {


    constructor(props) {
        super(props)
        this.state={
            entity_list:[]
        }
    }
    // /api/buyer/request_auctions/buyer_entity_contracts
    componentDidMount() {
        this.goSearch();
    }
    dosort(field_name, sort) {
        $(".lm--table th dfn").removeClass("selected");
        $(".search_list_" + sort + "." + field_name + "").addClass("selected");
        this.goSearch([field_name, sort]);
    }
    goSearch(sort) {
        let obj = {
            sort_by: sort instanceof Array ? sort : null
        }
     
        getBuyerRequestEnttiy(obj).then(res => {
            $(".u-contain").css("padding","0px");
            $(".lm--header").css("margin-bottom","0px");
            $(".createRaMain a,.lm--footer div").css("margin-left","24px");
             this.setState({
                entity_list: res.buyer_entity_contracts ? res.buyer_entity_contracts : [],
            })
        })
    }
    goCreate() {
        window.location.href = "/buyer/request_auctions/0";
    }
    render() {
        return (
            <div className="admin_expiry" id={"users_search_list"}>
                <div className="col-sm-12 col-md-12">
                    <div className="search_type padLR24 bgwhite">
                        <dl className="lm--formItem string optional">
                            <button onClick={this.goCreate.bind(this)} style={{marginBottom:"10px"}} className="lm--button lm--button--primary create_btn u-pull-right">Request New RA </button>
                        </dl>

                    </div>
                    <div className={"padLR24"}>
                        <div className={"lm--table-container"}>
                            <table className="lm--table lm--table--responsive" cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>Purchasing Entity
                            <div><dfn className={"search_list_asc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'asc')}></dfn>
                                                <dfn className={"search_list_desc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'desc')}></dfn></div>
                                        </th>
                                        <th> Existing Retailer
                            <div><dfn className={"search_list_asc retailer_name"} onClick={this.dosort.bind(this, 'retailer_name', 'asc')}></dfn>
                                                <dfn className={"search_list_desc retailer_name"} onClick={this.dosort.bind(this, 'retailer_name', 'desc')}></dfn></div>
                                        </th>
                                        <th>Contract Expiry
                            <div><dfn className={"search_list_asc contract_period_end_date"} onClick={this.dosort.bind(this, 'contract_period_end_date', 'asc')}></dfn>
                                                <dfn className={"search_list_desc contract_period_end_date"} onClick={this.dosort.bind(this, 'contract_period_end_date', 'desc')}></dfn></div>
                                        </th>
                                    </tr></thead>
                                <tbody>
                                {this.state.entity_list.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item.entity_name}</td>
                                        <td>{item.retailer_name}</td>
                                        <td>{moment(item.contract_period_end_date).format('D MMM YYYY')}</td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
BuyerRequestEntityListManage.propTypes = {
    onSubmitjest: () => { }
};


function runs() {
    const domNode = document.getElementById('buyer_request_entity_list');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerRequestEntityListManage),
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