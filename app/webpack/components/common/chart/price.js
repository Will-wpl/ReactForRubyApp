import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = { option: getTemplate() };
    }

    filterData(ids) {
        let option = getTemplate();
        if (ids.length > 0) {
            ids.forEach(id => {
                let result = this.props.data.find(element => {
                    return element.id === id;
                });
                if (result) {
                    let tmp = {
                        type: 'line',
                        data: []
                    };
                    result.data.forEach((timePrice) => {
                        let dataArr = [].concat(timePrice.time).concat(timePrice.price);
                        tmp.data.push(dataArr)
                    });
                    option.series.push(tmp);
                }
            }, this);
        }
        this.setState({ option: option });
    }

    componentDidMount() {
        if (this.props.initialData) {
            let option = getTemplate();
            let tmp = {
                type: 'line',
                data: []
            };
            this.props.initialData.forEach((timePrice) => {
                let dataArr = [].concat(timePrice.time).concat(timePrice.ranking);
                tmp.data.push(dataArr)
            });
            option.series.push(tmp);
            this.setState({ option: option });
        }

    }

    render() {
        return (
            <ReactEcharts
                option={this.state.option}
                notMerge={true}
                style={{ height: '350px', width: '100%' }}
                className='react_for_echarts' />

        );
    }
}

function getTemplate() {
    return {
        grid: {
            top: '2%',
            left: '10%',
            right: '1%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove|click',
            backgroundColor: 'transparent',
            position: (point, params, dom, rect, size) => {
                // 固定在顶部
                return [point[0] - 28, point[1] - 50];
            },
            formatter: (params) => {
                let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color}">${params.data[1]}</div>
                            </div>`;
                return result;
            }
        },
        xAxis: {
            splitLine: { show: false },
            show: true,
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (value, index) => {
                    return '';
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            splitLine: { show: false },
            type: 'value',
            name: '$/kwh',
            nameLocation: 'middle',
            nameGap: 50,
            nameRotate: 89.99999999,
            axisTick: {
                show: false
            },
            max: function (value) {
                return 1;
            }
        },
        series: []
    }
}