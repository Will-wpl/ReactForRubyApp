import React, {Component} from 'react';
import CheckboxListItem from './list-checkbox-item';
// import {findUpLimit, getRandomColor} from '../../../javascripts/componentService/util';

export default class CheckboxList extends Component {

    constructor(props) {
        super(props);
        this.filters = [];
    }

    // componentWillReceiveProps(next) {
    //     if (this.filters.length === 0 && next.list) {
    //         next.list.forEach(element => {
    //             let id = element.user_id;
    //             let color = element.color;
    //             this.filters.push({id, color});
    //         })
    //         if (this.props.onCheckeds) {
    //             this.props.onCheckeds(this.filters);
    //         }
    //     }
    // }

    setList(list) {
        this.list = list;
    }

    selectAll() {
        this.filters = [];
        if (this.list) {
            this.list.forEach(element => {
                let id = element.user_id;
                let color = element.color;
                element.status = true;
                this.filters.push({id, color});
            })
            this.forceUpdate();
            if (this.props.onCheckeds) {
                this.props.onCheckeds(this.filters);
            }
        }
    }

    disSelectAll() {
        this.filters = [];
        if (this.list) {
            this.list.forEach(element => {
                element.status = false;
            })
            this.forceUpdate();
            if (this.props.onCheckeds) {
                this.props.onCheckeds(this.filters);
            }
        }
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
        let result = this.list.find(element => {
            return element.user_id === id
        })
        if (result) {
            result.status = status
        }
    }

    render() {
        let checkItems;
        if (this.list) {
            checkItems = this.list.map((obj, index) => {
                return (
                    <CheckboxListItem key={obj.user_id} id={obj.user_id} display={obj.company_name}
                                      color={obj.color} status={obj.status} onCheck={this.makeCheckeds.bind(this)}/>
                );
            })
        }
        return (
            <ul className="charList">
                {checkItems}
            </ul>

        );
    }
}