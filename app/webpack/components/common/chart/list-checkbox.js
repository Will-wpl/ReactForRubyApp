import React, {Component} from 'react';
import CheckboxListItem from './list-checkbox-item';

export default class CheckboxList extends Component {

    constructor(props) {
        super(props);
        this.filters = [];
        this.state={
            list : []
        }
    }

    setList(list,type) {
        this.list = list;
        this.type = type;
        this.setState({list:list})
        // console.log(list);
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
    getSelectUid(){
        let uidArray = [],colorArray=[],uidObj={};
        this.list.map((item,index)=>{
            if(item.status){
                uidArray.push(item.user_id);
                colorArray.push(item.color.split("#")[1]);
            }
        })
        uidObj.uid = uidArray;
        uidObj.color = colorArray;
        return uidObj;
    }
    render() {
        let checkItems;
        if (this.list) {
            checkItems = this.list.map((obj, index) => {
                return (
                    <CheckboxListItem ref="listitem" type={this.type} index={index} list={this.state.list[index]} key={obj.user_id} id={obj.user_id} display={obj.company_name}
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