import React, { Component } from 'react';
// import selected from '../../../selected.png';
// import unselected from '../../../unselected.png';

export default class CheckboxListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { status: false }
    }
    onItemChecked(id, value) {
        this.props.onCheck(id, value);
    }
    onItemClick(id, status) {
        this.setState({ status: status });
        this.props.onCheck(id, status);
    }
    render() {
        return (
            <li onClick={this.onItemClick.bind(this, this.props.id, !this.state.status)} style={{ backgroundColor: 'red', cursor: 'pointer' }}>
                {/*<input type="checkbox" onChange={this.onItemChecked.bind(this, this.props.id)} />*/}
                {/*<img src={this.state.status ? selected : unselected} alt="selectstatus" />*/}
                <span>{this.props.display}  {this.props.id}</span>
            </li>
        );
    }
}