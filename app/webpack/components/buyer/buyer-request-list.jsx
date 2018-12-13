

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

export class BuyerRequestListManage extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {


    }
    goCreate() {
        window.location.href = "/buyer/request_auctions/0";
    }
    render() {
        return (
            <div className="admin_expiry" >
                <div className="col-sm-12 col-md-12">
                     
                    <div className={"padLR24"}>
                    ddd
                    </div>
                </div>
            </div>
        )
    }

}
BuyerRequestListManage.propTypes = {
    onSubmitjest: () => { }
};


function runs() {
    const domNode = document.getElementById('divBuyerRequestListPage');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(BuyerRequestListManage),
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