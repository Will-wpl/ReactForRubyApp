import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { UploadFile } from '../shared/upload';
import { changeValidate } from './../../javascripts/componentService/util';
import { approveBuyerRequest } from './../../javascripts/componentService/common/service';

export default class AdminBuyerRequestManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: []
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        alert(11);
    }


    render() {
        return (
            <div>

            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('divManageRequest');
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