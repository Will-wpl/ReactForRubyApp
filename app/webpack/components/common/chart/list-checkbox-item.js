import React, { Component } from 'react';
import selected from '../../../images/selected.png';
import unselected from '../../../images/unselected.png';

export default class CheckboxListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { status: true }
    }
    componentWillReceiveProps(next) {
        this.setState({status: next.status});
    }
    onItemClick(id, status, color) {
        this.setState({ status: status });
        this.props.onCheck(id, status, color);
    }
    render() {
        return (
            <li className="checkitem" onClick={this.onItemClick.bind(this, this.props.id, !this.state.status, this.props.color)} style={{ color:this.props.color,cursor: 'pointer' }}>
                {/* <input type="checkbox" onChange={this.onItemChecked.bind(this, this.props.id)} /> */}
                <img src={this.state.status ? selected : unselected} alt="selectstatus" />
                <span>{this.props.display}</span>
            </li>
        );
    }
}