import React, { Component, PropTypes } from 'react';
import moment from 'moment';
export default class TemplatesList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                    {/*<h3>List of Templates</h3>*/}
                    <div className="admin_invitation">
                        <div className="table-head">
                            <table className="retailer_fill">
                                <thead>
                                    <tr>
                                    {/* {this.props.type=="email"?"Description":"Report"} */}
                                        <th width={"50%"}>Description</th>
                                        <th width={"30%"}>Last Update</th>
                                        <th width={"20%"}>{this.props.type=="email"?"Email":""}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="table-body">
                            <table className="retailer_fill">
                                <tbody>
                                    {
                                        this.props.email_list?this.props.email_list.map((item, index) => {
                                            return (  
                                                <tr key={index}>
                                                    <td width={"50%"} style={{"textAlign":"left","paddingLeft":"15px"}}>{item.name}</td>
                                                    <td width={"30%"} style={{"textAlign":"center"}}>{(item.updated_at!==null && item.updated_at!=="")?moment(item.updated_at).format('DD-MM-YYYY hh:mm:ss '):""}</td>
                                                    <td width={"20%"}><a onClick={this.props.showEmail.bind(this, item.id,this.props.type)} className={"edit"}>edit</a></td>
                                                </tr>
                                            )
                                        }):<tr style={{display:"none"}}><td></td><td></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>

        )
    }
}