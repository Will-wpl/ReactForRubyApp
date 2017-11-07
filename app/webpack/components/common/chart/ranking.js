import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = { option: getTemplate() };
    }

    getChartOption() {
        let option = getTemplate();
        this.props.data.forEach(element => {
            let tmp = {
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        color: element.color,
                        lineStyle: {
                            color: element.color
                        }
                    }
                }
            };
            element.data.forEach((timeRanking) => {
                let d = {
                    symbol: 'triangle',
                    symbolSize: 15,
                    showSymbol: true,
                    value: []
                };
                d.value = [].concat(timeRanking.time).concat(timeRanking.ranking);
                tmp.data.push(d);
            });
            option.series.push(tmp);
        });
        return option;
    }

    componentDidMount() {
        if (this.props.initialData) {
            let option = getTemplate();
            this.props.initialData.forEach((element) => {
                let tmp = {
                    type: 'line',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#e5e816',
                            lineStyle: {
                                color: '#e5e816'
                            }
                        }
                    }
                };
                element.data.forEach((timeRanking) => {
                    let d = {
                        symbol: 'triangle',
                        symbolSize: 15,
                        showSymbol: true,
                        value: []
                    };
                    d.value = [].concat(timeRanking.time).concat(timeRanking.ranking);
                    tmp.data.push(d);
                })
                option.series.push(tmp);
            });
            this.setState({ option: option });
        }

    }

    render() {
        return (
            <ReactEcharts
                option={this.getChartOption()}
                notMerge={true}
                style={{ height: '280px', width: '100%' }}
                className='react_for_echarts' />
        );
    }
}

Ranking.defaultProps = {
    data: []
}

function getTemplate() {
    return {
        calculable: true,
        dataZoom: {
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false
        },
        grid: {
            top: '2%',
            left: '10%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove|click',
            backgroundColor: 'transparent',
            position: (point, params, dom, rect, size) => {
                return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
            },
            formatter: (params) => {
                let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    <strong>asdfasdf</strong>
                                    <div>fdasdfasdfasdfasdfasdffffffdasdfasdfasdfasdfasdfffff</div>
                                    <div>fdasdfasdfasdfasdfasdf</div>
                                    <div>${params.value[1]}</div>
                                </div>
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
                // formatter: (value, index) => {
                //     return '';
                // }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            splitLine: { show: false },
            type: 'value',
            name: 'Ranking',
            nameLocation: 'middle',
            nameGap: 50,
            nameRotate: 89.99999999,
            axisTick: {
                show: false
            },
            max: (value) => {
                return 10;
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            }
        },
        series: []
    }
}