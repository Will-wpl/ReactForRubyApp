import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

export class CreateNewRA extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            messages: []
        };
        this.doSave = this.doSave.bind(this);
    }
    doSave(){
        let flg = true;
        if(this.refs.ra_name.value == ""){
            this.refs.ra_name_error.innerHTML = "you must fill in the name of auction"
            flg = false;
        }
        if(this.refs.ra_data.value == ""){
            this.refs.ra_data_error.innerHTML = "you must fill in the data of auction"
            flg = false;
        }
        if(this.refs.ra_time.value == ""){
            this.refs.ra_time_error.innerHTML = "you must fill in the time of auction"
            flg = false;
        }
        if(this.refs.ra_price.value == ""){
            this.refs.ra_price_error.innerHTML = "you must fill in the price of auction"
            flg = false;
        }
        if(this.refs.ra_duration.value == ""){
            this.refs.ra_duration_error.innerHTML = "you must fill in the duration of auction"
            flg = false;
        }

        // this.refs.CreatRaForm.submit()
    }
    render () {
        return (
            <div className="createRaMain">
            <div className="createRa">
                <h2>Creat New Reverse Auction</h2>
                {/* <form action="" type="post" ref="CreatRaForm"> */}
                <dl className="vw-block vw-block-cols">
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Name of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_name" name="ra_name"></input><abbr className="error-block" ref="ra_name_error"></abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Data of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_data" name="ra_data" className="col-sm-12 col-md-6"></input><abbr className="error-block" ref="ra_data_error"></abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Time of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_time" name="ra_time" className="col-sm-12 col-md-6"></input><abbr className="error-block" ref="ra_time_error"></abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Auction Contract Period :</span><label className="col"><input type="test" className="col" ref="ra_start_time" name="ra_start_time"></input></label><label className="col"><b>to</b></label><label className="col"><input type="test" ref="ra_end_time" name="ra_end_time" className="col"></input></label></dd>
                    <dd></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Auction Paramters</span></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Duration :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_duration" name="ra_duration" ></input><abbr ref="ra_duration_error" className="error-block"></abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Price :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_price" name="ra_price" ></input><abbr ref="ra_price_error" className="error-block"></abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Extension :</span><label className="col-sm-12 col-md-6"><b className="textLeft">Manual</b></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Average price :</span><label className="col-sm-12 col-md-6"><b className="textLeft">Weighted Average</b></label></dd>
                </dl>
                <div className="createRa_btn">
                    <button className="lm--button lm--button--primary" onClick={this.doSave}>Save</button>
                    <button className="lm--button lm--button--primary" onClick={this.doDelete}>Delete</button>
                    <button className="lm--button lm--button--primary" onClick={this.doPublish}>Publish</button>
                </div>
                {/* </form> */}
            </div>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('createNewRA');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(CreateNewRA),
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