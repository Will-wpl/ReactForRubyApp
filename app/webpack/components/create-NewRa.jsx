import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

export class CreateNewRA extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            ra_name:"",ra_name_error:"",
            ra_data:"",ra_data_error:"",
            ra_time:"",ra_time_error:"",
            ra_time_start:"",ra_time_start_error:"",
            ra_time_end:"",ra_time_end_error:"",
            ra_duration:"",ra_duration_error:"",
            ra_price:"",ra_price_error:""
        };
        this.nameChange = this.nameChange.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
        this.starttimeChange = this.starttimeChange.bind(this);
        this.endtimeChange = this.endtimeChange.bind(this);
        this.durationChange = this.durationChange.bind(this);
        this.priceChange = this.priceChange.bind(this);
        this.doSave = this.doSave.bind(this);
    }
    nameChange(e){
        let name = e.target.value;
        this.setState({ra_name:name})
        if(name != ""){
            this.setState({ra_name_error:""});
        }
    }
    dataChange(e){
        let data = e.target.value;
        this.setState({ra_data:data})
        if(data != ""){
            this.setState({ra_data_error:""});
        }
    }
    timeChange(e){
        let time = e.target.value;
        this.setState({ra_time:time})
        if(time != ""){
            this.setState({ra_time_error:""});
        }
    }
    starttimeChange(e){
        let start = e.target.value;
        this.setState({ra_time_start:start})
        if(start != ""){
            this.setState({ra_time_start_error:""});
        }
    }
    endtimeChange(e){
        let end = e.target.value;
        this.setState({ra_time_end:end})
        if(end != ""){
            this.setState({ra_time_end_error:""});
        }
    }
    durationChange(e){
        let duration = e.target.value;
        this.setState({ra_duration:duration})
        if(duration != ""){
            this.setState({ra_duration_error:""});
        }
    }
    priceChange(e){
        let price = e.target.value;
        this.setState({ra_price:price})
        if(price != ""){
            this.setState({ra_price_error:""});
        }
    }
    doSave(){
        if(this.state.ra_name === ""){
            this.setState({ra_name_error:"you must fill in the name of auction"})
        }
        if(this.state.ra_data === ""){
            this.setState({ra_data_error:"you must fill in the data of auction"})
        }
        if(this.state.ra_time === ""){
            this.setState({ra_time_error:"you must fill in the time of auction"})
        }
        if(this.state.ra_time_start === ""){
            this.setState({ra_time_start_error:"you must fill in the start time of auction"})
        }
        if(this.state.ra_time_end === ""){
            this.setState({ra_time_end_error:"you must fill in the end time of auction"})
        }
        if(this.state.ra_duration === ""){
            this.setState({ra_duration_error:"you must fill in the duration of auction"})
        }
        if(this.state.ra_price === ""){
            this.setState({ra_price_error:"you must fill in the price of auction"})
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
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Name of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_name" name="ra_name" onChange={this.nameChange}></input><abbr className="error-block" ref="ra_name_error">{this.state.ra_name_error}</abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Data of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_data" name="ra_data" onChange={this.dataChange} className="col-sm-12 col-md-6"></input><abbr className="error-block" ref="ra_data_error">{this.state.ra_data_error}</abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Time of Reverse Auction :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_time" name="ra_time" onChange={this.timeChange} className="col-sm-12 col-md-6"></input><abbr className="error-block" ref="ra_time_error">{this.state.ra_time_error}</abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Auction Contract Period :</span><label className="col"><input type="test" className="col" ref="ra_start_time" onChange={this.starttimeChange} name="ra_start_time"></input><abbr className="error-block" onChange={this.endtimeChange} ref="ra_time_start_error">{this.state.ra_time_start_error}</abbr></label><label className="col"><b>to</b></label><label className="col"><input type="test" ref="ra_end_time" name="ra_end_time" className="col"></input><abbr className="error-block" ref="ra_time_end_error">{this.state.ra_time_end_error}</abbr></label></dd>
                    <dd></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Auction Paramters</span></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Duration :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_duration" name="ra_duration" onChange={this.durationChange} ></input><abbr ref="ra_duration_error" className="error-block">{this.state.ra_duration_error}</abbr></label></dd>
                    <dd className="u-grid"><span className="col-sm-12 col-md-6 u-cell">Reverse Price :</span><label className="col-sm-12 col-md-6"><input type="test" ref="ra_price" name="ra_price" onChange={this.priceChange}></input><abbr ref="ra_price_error" className="error-block">{this.state.ra_price_error}</abbr></label></dd>
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