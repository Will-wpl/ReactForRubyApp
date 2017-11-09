import React, {Component} from 'react';

export default class ChartRealtimeHoc extends Component {
    constructor(props) {
        super(props);
        this.ids = [];
        this.list = [];
        this.state = {data: []};

    }

    componentWillReceiveProps(next) {
        if (this.list.length === 0) {
            this.list = this.list.concat(next.dataStore);
        } else {
            next.dataStore.forEach(newData => {
                let result = this.list.find(oldData => {
                    return oldData.id === newData.id;
                })
                if (result) {
                    result.data = result.data.concat(newData.data);
                }
            })
        }
    }

    updateIndentifications(ids) {
        this.filterData(ids ? ids : []);
    }

    filterData(ids) {
        let results = [];
        if (ids.length > 0) {
            ids.forEach(idColor => {
                let result = this.list.find(element => {
                    return element.id === idColor.id;
                });
                if (result) {
                    console.log(result)
                    result.color = idColor.color
                    results.push(result);
                }
            }, this);
        }
        this.setState({data: results});
    }

    render() {
        return (
            <div>
                {
                    React.Children.map(this.props.children,
                        (child) => React.cloneElement(child, {data: this.state.data}))
                }
            </div>
        )
    }
}

ChartRealtimeHoc.defaultProps = {
    dataStore:[]
}

