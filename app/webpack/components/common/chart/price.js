import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {option: getTemplate()};
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
            element.data.forEach((timePrice) => {
                let d = timePrice.is_bidder ? {
                    symbol: 'triangle',
                    symbolSize: 15,
                    showSymbol: true,
                    value: []
                } : {value: []};
                // d.value = [].concat(timePrice.time).concat(timePrice.price);
                d.value = [].concat(moment(timePrice.bid_time).format('YYYY-MM-DD HH:mm:ss'))
                    .concat(parseFloat(timePrice.average_price).toFixed(4));
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
                style={{height: '280px', width: '100%'}}
                className='react_for_echarts'/>

        );
    }
}

Price.defaultProps = {
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
            right: '6%',
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
            splitLine: {show: false},
            show: true,
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                // formatter: (value, index) => {
                //     return moment(value).format('HH:mm:ss');
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
            splitLine: {show: false},
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