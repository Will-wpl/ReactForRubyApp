import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

export class BuyerRequestEntityListManage extends Component {


    constructor(props) {
        super(props)
        this.state={
            entity_list:[]
        }
    }

    componentDidMount() {


    }
    dosort(field_name, sort) {
        $(".lm--table th dfn").removeClass("selected");
        $(".search_list_" + sort + "." + field_name + "").addClass("selected");
        this.goSearch([field_name, sort]);
    }
    goSearch(sort) {

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
                            <button onClick={this.goCreate.bind(this)} style={{marginBottom:"10px"}} className="lm--button lm--button--primary create_btn u-pull-right">Create</button>
                        </dl>

                    </div>
                    <div className={"padLR24"}>
                        <div className={"lm--table-container"}>
                            <table className="lm--table lm--table--responsive" cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>Purchasing Entity
                            <div><dfn className={"search_list_asc company_name"} onClick={this.dosort.bind(this, 'company_name', 'asc')}></dfn>
                                                <dfn className={"search_list_desc company_name"} onClick={this.dosort.bind(this, 'company_name', 'desc')}></dfn></div>
                                        </th>
                                        <th> Existing Retailer
                            <div><dfn className={"search_list_asc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'asc')}></dfn>
                                                <dfn className={"search_list_desc entity_name"} onClick={this.dosort.bind(this, 'entity_name', 'desc')}></dfn></div>
                                        </th>
                                        <th>Contract Expiry
                            <div><dfn className={"search_list_asc contract_expiry"} onClick={this.dosort.bind(this, 'contract_expiry', 'asc')}></dfn>
                                                <dfn className={"search_list_desc contract_expiry"} onClick={this.dosort.bind(this, 'contract_expiry', 'desc')}></dfn></div>
                                        </th>
                                    </tr></thead>
                                <tbody>
                                {this.state.entity_list.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item.company_name}</td>
                                        <td>{item.entity_name}</td>
                                        <td>{item.contract_expiry}</td>
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