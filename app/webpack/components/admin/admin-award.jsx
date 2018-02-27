import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {getLetterOfAward} from '../../javascripts/componentService/admin/service';
export default class AdminAward extends Component{
    constructor(props){
        super(props);
        this.state={
            awardList:[]
        }
    }

    componentDidMount(){
        let thisId = window.location.href.split("auctions/")[1].split("/award")[0];
        getLetterOfAward(thisId).then(resp=>{
            console.log(resp)
            this.setState({awardList:resp})
        },error=>{

        })
    }

    renderAwardList(data){
        return(
            data.map((e,i)=>{
                let status = e.acknowledge == 1 ? 1 : 2;
                return(
                    <li key={i} className="u-grid center ">
                        <span className="col-sm-4 white">{e.name}</span>
                        <span className="col-sm-4"><abbr className={'color'+status}></abbr></span>
                        <span className="col-sm-4 ">
                            <div className="downLoadIcon">
                            </div>
                        </span>
                    </li>
                )
            })
        )
    }

    render(){
        //console.log(this.state.awardList);
        return(
            <div className="u-grid bidderStatus" >
                <ul className="bidders_list " style={{display:'flex'}}>
                    {this.renderAwardList(this.state.awardList)}
                </ul>
                <div className="color_show">
                    <label><span className="green"></span><dfn>Acknowledge</dfn></label>
                    <label><span className="yellow"></span><dfn>Pending</dfn></label>
                </div>
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