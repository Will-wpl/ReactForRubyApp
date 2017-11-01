import React, { Component } from 'react';
import CheckboxListItem from './list-checkbox-item';

export default class CheckboxList extends Component {

    constructor(props) {
        super(props);
        this.filters = [];
    }

    makeCheckeds(id, status) {
        this.filters = this.filters.filter(element => {
            return element !== id;
        });
        if (status) {
            this.filters.push(id);
        }
        if (this.props.onCheckeds) {
            this.props.onCheckeds(this.filters);
        }
    }

    render() {
        let checkItems = this.props.list.map((obj, index) => {
            return (
                <CheckboxListItem key={obj.id} id={obj.id} display={obj.name} onCheck={this.makeCheckeds.bind(this)} />
            );
        })
        return (
            <ul>
                {checkItems}
            </ul>

        );
    }
}