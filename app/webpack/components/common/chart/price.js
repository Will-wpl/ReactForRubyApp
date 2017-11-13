import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {option: getTemplate(this.props)};
    }

    getChartOption() {
        let option = getTemplate(this.props);
        console.log('this.props.data', this.props.data)
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
                // console.log('timePrice.is_bidder', timePrice.is_bidder)
                let d = timePrice.is_bidder && timePrice.flag !== null ? {
                    symbol: 'triangle',
                    symbolSize: 15,
                    showSymbol: true,
                    value: []
                } : {
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: true,
                    value: []
                };
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
                style={{minHeight: '280px', width: '100%'}}
                className='react_for_echarts'/>

        );
    }
}

Price.defaultProps = {
    data: []
}

function getTemplate(props) {
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
            top: '5%',
            left: '10%',
            right: '7%',
            bottom: '3%',
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
                console.log('~~~~~~~~~~~')
                return [xPosition, yPosition];
                // return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
            },
            formatter: (params) => {
                let content = `<div>${params.value[1]}</div>`;
                if (props && params.seriesIndex < props.data.length) {
                    let template;
                    let serObj = props.data[params.seriesIndex];
                    if (serObj && serObj.data) {
                        let d = serObj.data[params.dataIndex];
                        if (d && d.template_price) {
                            template = `<strong>${d.template_price.company_price}</strong>
                                    <div>${d.template_price.lt}</div>
                                    <div>${d.template_price.hts}</div>
                                    <div>${d.template_price.htl}</div>`;
                        }
                    }
                    if (template) {
                        content = template;
                    }
                }
                let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    ${content}
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
            // max: function (value) {
            //     return 1;
            // },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            }
        },
        series: []
    }
}