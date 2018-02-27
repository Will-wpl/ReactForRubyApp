import React from 'react';
import ReactDOM from 'react-dom';
export default class LetterOfAward extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    }
    render(){
        return(
            <div className="bidderStatus">
                <label className=" lm--formItem-control">
                    <ul className="bidders_list" style={{width:'100%'}}>
                        <li className="u-grid">
                            <span className="col-sm-7 white" title="Company Buyer 1">Constimer A</span>
                            <span className="col-sm-3"><abbr className="color1"></abbr></span>
                            <span className="col-sm-2" id="showDetail">Download</span>
                        </li>
                        <li className="u-grid">
                            <span className="col-sm-7 white" title="Company Buyer 2">Constimer A</span>
                            <span className="col-sm-3"><abbr className="color2"></abbr></span>
                            <span className="col-sm-2" id="showDetail">Download</span>
                        </li>
                        <li className="u-grid">
                            <span className="col-sm-7 white" title="Company Buyer 10">Constimer A</span>
                            <span className="col-sm-3"><abbr className="color2"></abbr></span>
                            <span className="col-sm-2" id="showDetail">Download</span>
                        </li>
                    </ul>
                    <div className="color_show">
                        <label><span className="green"></span><dfn>Confirmed</dfn></label>
                        <label><span className="yellow"></span><dfn>Pending</dfn></label>
                        <label><span className="red"></span><dfn>Rejected</dfn></label>
                    </div>
                </label>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('LetterOfAward');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(LetterOfAward),
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