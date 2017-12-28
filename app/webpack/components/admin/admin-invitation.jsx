import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
export default class AdminInvitation extends Component {
  constructor(props){
    super(props);
    this.state={
        fileData:{
                "tender_documents_upload":[{buttonName:"add"}],
                "birefing_pack_upload":[{buttonName:"add"}]
            }
    }
    //this.winnerdata=[];
    //this.winnerauction={};
    this.winner = {
        data:{},
        auction:{}
    }
    //this.auction={}
}

componentDidMount() {
    
}
addinputfile(type){
        let fileHtml = '';
        fileHtml = <div>
                        {this.state.fileData[type].map((item,index)=>{
                        return <div className="u-grid mg0" key={index}>
                                    <div className="col u-cell">
                                        <input type="file" size="1" ref={type+index} id={type+index} disabled={this.state.disabled} name="tender_documents_upload"></input>
                                    </div>
                                    <div className="col u-cell">
                                        <a className="lm--button lm--button--primary">Upload</a>
                                    </div>
                                    <div className="col u-cell">
                                        <a onClick={this.fileclick.bind(this,index,type,item.buttonName)} className="lm--button lm--button--primary">{item.buttonName}</a>
                                    </div>
                                </div>
                        })}
                    </div>
        return fileHtml;
    }
    fileclick(index,type,typeName,obj){
        let fileArray = [],allfileObj={};
            allfileObj = this.state.fileData;
            fileArray = this.state.fileData[type];
            if(typeName == "add"){
                fileArray.push({buttonName:"remove"});
                allfileObj[type] = fileArray;
                this.setState({
                    fileData:allfileObj
                })
            }else{
                fileArray.splice(index,1);
                allfileObj[type] = fileArray;
                this.setState({
                    fileData:allfileObj
                })
            }
            console.log(this.state.tender_documents);   

    }
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid admin_invitation">
                <div className="col-sm-12 col-md-8 push-md-2">
                    <h3 className="u-mt3 u-mb1">invitation</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Retailers:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <abbr>You have selected 5 retailers</abbr>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Retailer to Invite:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 col-md-6 u-cell">
                                <a href="/admin/auctions/1/select?type=1" className="lm--button lm--button--primary col-sm-12">Selected Retailers</a>
                            </div>                     
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string u-mt3">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Buyers:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <abbr>You have selected 0 company buyers and 6 individual buyers.</abbr>
                            <abbr>You have selected send to 6 buyers</abbr>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Buyer to Invite:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        <div className="col-sm-12 col-md-6 u-cell"><a href="/admin/auctions/1/select?type=2" className="lm--button lm--button--primary col-sm-12">Selected Company Retailers</a></div>
                        <div className="col-sm-12 col-md-6 u-cell"><a href="/admin/auctions/1/select?type=3" className="lm--button lm--button--primary col-sm-12">Selected Individual Retailers</a></div>
                        <div className="col-sm-12 col-md-12 u-cell"><a className="lm--button lm--button--primary col-sm-12 orange">Send Invitation Email</a></div>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string u-mt3">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Upload files:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Aggregate Consumption:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                            <div className="col-sm-12 u-cell">
                                <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>LT</th>
                                            <th>HT (Small)</th>
                                            <th>HT (Large)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Peak (7am-7pm)</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                            </tr>
                                            <tr>
                                                <td>Off-Peak (7pm-7am)</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                                <td >147878</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href="/admin/auctions/1/comsumption?type=2" className="lm--button lm--button--primary col-sm-12">Company Consumption Details</a></div>
                                <div className="col-sm-12 col-md-6 u-cell"><a href="/admin/auctions/1/comsumption?type=3" className="lm--button lm--button--primary col-sm-12">Individual Consumption Details</a></div>                
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Tender Documents Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("tender_documents_upload")}
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Birefing Pack Upload :
                        </label>
                        <div className="lm--formItem-right lm--formItem-control u-grid mg0">
                        {this.addinputfile("birefing_pack_upload")}
                        </div>
                    </div>
                    <div className="retailer_btn">
                        <a className="lm--button lm--button--primary">Previous</a>
                        <a className="lm--button lm--button--primary">Save</a>
                        <a className="lm--button lm--button--primary">Publish</a>
                    </div>
                </div>
                <div className="createRaMain u-grid">
                    <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
                </div>
            </div>
    )
  }
}

function run() {
    const domNode = document.getElementById('admin_invitation');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(AdminInvitation),
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