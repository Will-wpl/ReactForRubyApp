import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import RetailerRanking from './admin_shared/ranking';
import WinnerPrice from './admin_shared/winner';
export class AdminDashboard extends Component {
    constructor(props, context){
        super(props);
    }
    render () {
        return (
            <div>
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-7">
                        
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <WinnerPrice showOrhide="show" statusColor="green" showStatus="Awarded" />
                        <RetailerRanking />
                    </div>
                </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('AdminDashboard');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminDashboard),
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
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}