import React, {Component} from 'react';
import CheckboxListItem from './list-checkbox-item';
import {findUpLimit, getRandomColor} from '../util';

export default class CheckboxList extends Component {

    constructor(props) {
        super(props);
        this.filters = [];
    }

    makeCheckeds(id, status, color) {
        this.filters = this.filters.filter(element => {
            return element.id !== id;
        });
        if (status) {
            this.filters.push({id, color});
        }
        if (this.props.onCheckeds) {
            this.props.onCheckeds(this.filters);
        }
    }

    render() {
        let checkItems;
        if (this.props.list) {
            let limit = findUpLimit(this.props.list.length);
            checkItems = this.props.list.map((obj, index) => {
                let color = getRandomColor((index + 1) * 1.0 / limit);
                return (
                    <CheckboxListItem key={obj.id} id={obj.id} display={obj.name} color={color} onCheck={this.makeCheckeds.bind(this)}/>
                );
            })
        }
        return (
            <ul>
                {checkItems}
            </ul>

        );
    }
}