import React, { Component, PropTypes } from 'react'
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
                                        <th width={"69.7%"}>Name</th>
                                        <th>Email</th>
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
                                                    <td width={"70%"} style={{"textAlign":"left","paddingLeft":"15px"}}>{item.subject}</td>
                                                    <td><a onClick={this.props.showEmail.bind(this, item.id)} className={"edit"}>edit</a></td>
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