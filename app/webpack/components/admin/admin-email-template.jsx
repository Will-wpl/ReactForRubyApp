import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import {Modal} from '../shared/show-modal';
import {getEmailList,getEmailListItem,getEmailItemUpdate} from '../../javascripts/componentService/admin/service';
export default class EmailTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            email_list:[],
            listdetail:{}
        }
    }
    componentDidMount(){
        getEmailList().then(res=>{
            this.setState({email_list:res});
        },error=>{

        })
    }
    showEmail(id){
        getEmailListItem(id).then(res=>{
            this.setState({listdetail:res,text:''});
            this.refs.Modal.showModal('comfirm',res,'email_template');
        })
    }
    changeEmail(obj){
        getEmailItemUpdate(obj).then(res=>{
            this.setState({text:"Email Update Successful!"})
            setTimeout(()=>{
                this.refs.Modal.showModal();
            },200)
        },error=>{

        })
    }
    render() {
        //console.log('ranking', this.props.ranking)
        return (
            <div>
                <div className="retailrank_main">
                    <h3>List of Templates</h3>
                    <div className="retailrank_box">
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
                                    this.state.email_list.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td width={"70%"}>{item.subject}</td>
                                                <td><a onClick={this.showEmail.bind(this,item.id)} className={"edit"}>edit</a></td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal text={this.state.text} acceptFunction={this.changeEmail.bind(this)} listdetail={this.state.listdetail} listdetailtype="Email Template"  ref="Modal" />
            </div>

        )
    }
}

function run() {
    const domNode = document.getElementById('admin_email_template');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(EmailTemplates),
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