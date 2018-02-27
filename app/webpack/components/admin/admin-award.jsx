import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
export default class AdminAward extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
            </div>
        )
    }
}
function run() {
    const domNode = document.getElementById('Letter of Award');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminAward),
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