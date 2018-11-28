import React, { Component } from 'react';
import ReactDom from 'react-dom';

export default class AdminBuyerRequestManage extends Component {
    constructor(props) {
        this.state = {
            requestList: [],


        }
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('admin_buyer_request');
    if (domNode !== null) {
        ReactDOM.render(
            React.createElement(AdminBuyerRequestManage),
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