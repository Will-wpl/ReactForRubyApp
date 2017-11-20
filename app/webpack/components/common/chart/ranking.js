import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

export default class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = {option: getTemplate(this.props)};
    }

    getChartOption() {
        let option = getTemplate(this.props);
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
                let d = timeRanking.is_bidder && timeRanking.flag !== null ? {
                    symbol: 'triangle',
                    symbolSize: 15,
                    showSymbol: true,
                    value: []
                } : {
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: true,
                    value: []
                };
                // d.value = [].concat(timeRanking.time).concat(timeRanking.ranking);
                if (element.data.length === 1) {
                    d.value = [].concat(0).concat(timeRanking.ranking);
                } else {
                    d.value = [].concat(moment(timeRanking.bid_time).format('YYYY-DD-MM HH:mm:ss')).concat(timeRanking.ranking);
                }
                tmp.data.push(d);
            });
            option.series.push(tmp);
        });
        return option;
    }

    render() {
        return (
            <ReactEcharts
                option={this.getChartOption()}
                notMerge={true}
                style={{minHeight: '310px', width: '100%'}}
                className='react_for_echarts'/>
        );
    }
}

Ranking.defaultProps = {
    data: [],
    yAxisFormatterRule: {}
}

const getTemplate = (props) => {
    if (props.data.every(element => {
            return element.data.length === 1;
        })) {
        return {
            calculable: true,
            grid: {
                top: '10%',
                left: '5%',
                right: '7%',
                bottom: '20%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove|click',
                backgroundColor: 'transparent',
                position: (point, params, dom, rect, size) => {
                    let xPosition = point[0] - dom.scrollWidth / 2;
                    let yPosition = point[1] - dom.scrollHeight - 16;
                    if (xPosition < 0) {
                        xPosition = point[0] + 5;
                        yPosition = point[1] - (dom.scrollHeight + 16) / 2;
                        let divs = dom.getElementsByTagName('div');
                        if (divs.length > 1) {
                            divs[1].className = '';
                        }
                    }
                    return [xPosition, yPosition];
                    // return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
                },
                formatter: (params) => {
                    let content = `${params.value[1]}`;
                    if (props && params.seriesIndex < props.data.length) {
                        let template;
                        let serObj = props.data[params.seriesIndex];
                        if (serObj && serObj.data) {
                            let d = serObj.data[params.dataIndex];
                            if (d && d.template_ranking) {
                                template = d.template_ranking;
                            }
                        }
                        if (template) {
                            content = template;
                        }
                    }
                    let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    <strong style="white-space: nowrap">${content}</strong>
                                </div>
                            </div>`;
                    return result;
                }
            },
            xAxis: {
                splitLine: {show: false},
                show: true,
                type: 'value',
                boundaryGap: false,
                axisLabel: {
                    formatter: (value, index) => {
                        if (index === 0) {
                            if (props.data.length > 0 && props.data[0].data.length > 0) {
                                return moment(props.data[0].data[0].bid_time).format('HH:mm:ss');
                            }
                        }
                        return '';
                    }
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
                splitLine: {show: false},
                type: 'value',
                name: 'Ranking',
                nameLocation: 'middle',
                nameGap: 70,
                nameRotate: 89.99999999,
                axisTick: {
                    show: false
                },
                max: (value) => {
                    return value.max + 1;
                },
                // min: 1,
                splitNumber: 100,
                axisLabel: {
                    formatter: (value, index) => {
                        return props.yAxisFormatterRule[value] ? props.yAxisFormatterRule[value]
                            : props.yAxisFormatterRule.func ? props.yAxisFormatterRule.func(value) : value;
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'white'
                    }
                },
                minInterval: 1
            },
            series: []
        }
    }
    let yAxisSplitNum = 20;
    return {
        calculable: true,
        dataZoom: {
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false,
            bottom: '10%',
            fillerColor: 'rgba(6, 178 ,180 , 0.1)',
            borderColor: '#06b2b3',
            handleColor: '#06b2b3'
        },
        grid: {
            top: '5%',
            left: '10%',
            right: '7%',
            bottom: '20%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove|click',
            backgroundColor: 'transparent',
            position: (point, params, dom, rect, size) => {
                let xPosition = point[0] - dom.scrollWidth / 2;
                let yPosition = point[1] - dom.scrollHeight - 16;
                if (xPosition < 0) {
                    xPosition = point[0] + 5;
                    yPosition = point[1] - (dom.scrollHeight + 16) / 2;
                    let divs = dom.getElementsByTagName('div');
                    if (divs.length > 1) {
                        divs[1].className = '';
                    }
                }
                return [xPosition, yPosition];
                // return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
            },
            formatter: (params) => {
                let content = `${params.value[1]}`;
                if (props && params.seriesIndex < props.data.length) {
                    let template;
                    let serObj = props.data[params.seriesIndex];
                    if (serObj && serObj.data) {
                        let d = serObj.data[params.dataIndex];
                        if (d && d.template_ranking) {
                            template = d.template_ranking;
                        }
                    }
                    if (template) {
                        content = template;
                    }
                }
                let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    <strong style="white-space: nowrap">${content}</strong>
                                </div>
                            </div>`;
                return result;
            }
        },
        xAxis: {
            splitLine: {show: false},
            show: true,
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (value, index) => {
                    return moment(value).format('HH:mm:ss');
                }
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
            splitLine: {show: false},
            type: 'value',
            name: 'Ranking',
            nameLocation: 'middle',
            nameGap: 50,
            nameRotate: 89.99999999,
            axisTick: {
                show: false
            },
            max: (value) => {
                return value.max + 1;
            },
            // min: 1,
            splitNumber: 100,
            axisLabel: {
                formatter: (value, index) => {
                    return props.yAxisFormatterRule[value] ? props.yAxisFormatterRule[value]
                        : props.yAxisFormatterRule.func ? props.yAxisFormatterRule.func(value) : value;
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            minInterval: 1
        },
        series: []
    }
}