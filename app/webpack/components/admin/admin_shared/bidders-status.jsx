import React, { Component, PropTypes } from 'react'
import {Modal} from '../../shared/show-modal';
import {arrangementDetail,getBidderStatus} from '../../../javascripts/componentService/admin/service';
export class BidderStatus extends Component {
    constructor(props){
        super(props);
        this.state={
            showDetail:{},
            dataList: []
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.auction) {
                getBidderStatus({auction_id:this.props.auction.id}).then(res => {
                    this.setState({
                        dataList:res,
                    })
                }, error => {
                    console.log(error);
                })
            }
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    showDetail(id,obj){
        arrangementDetail(id).then(res=>{
            this.setState({
                showDetail:res,
            })
            this.refs.Modal.showModal();
        },error=>{

        })
    }
    render () {
        return (
            <div className="u-grid bidderStatus">
                <div className="col-sm-12 col-md-12">
                <h3>Bidders Status of Submission</h3>
                <ul className="bidders_list">
                    {
                        this.state.dataList.map((item,index) => {
                        return(
                            <li key={index} className="u-grid">
                                <span className="col-sm-7 col-md-7 white" title={item.company_name}>{item.company_name}</span>
                                <span className="col-sm-3 col-md-3"><abbr className={'color'+item.accept_status}></abbr></span>
                                <span className="col-sm-2 col-md-2" onClick={this.showDetail.bind(this,item.id)}>Details</span>     
                            </li>)
                        })
                    }
                </ul>
                <div className="color_show">
                    <label><span className="green"></span><dfn>Submitted</dfn></label>
                    <label><span className="yellow"></span><dfn>Pending</dfn></label>
                </div>
                </div>
                <Modal showdetail={this.state.showDetail} ref="Modal" />
            </div>
        )
    }
}