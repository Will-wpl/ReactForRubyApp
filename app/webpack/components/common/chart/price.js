import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {
            option: getTemplate(this.props),
            start_time:"",
            end_time:"",
            start_price:"",
            end_price:""
        };
        this.onyAxisMouseOver = this.onyAxisMouseOver.bind(this);
        this.onDataZoom = this.onDataZoom.bind(this);
        this.onEvents = {
            'dataZoom': this.onDataZoom
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.data.length>0){
            this.setState({
                start_time:nextProps.data[0].data[0].bid_time,
                end_time:nextProps.data[0].data[nextProps.data[0].data.length-1].bid_time,
                start_price:parseFloat(0.0000).toFixed(4),
                end_price:parseFloat(nextProps.data[0].data[0].average_price).toFixed(4)
            })
            this.theStartbidtime = nextProps.data[0].data[0].bid_time;
            this.theEndbidtime = nextProps.data[0].data[nextProps.data[0].data.length-1].bid_time;
        }
    }
    getChartOption() {
        let option = getTemplate(this.props);
        //console.log(this.props.data);
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
                    symbolSize: 6,
                    showSymbol: true,
                    value: []
                };
                // d.value = [].concat(timePrice.time).concat(timePrice.price);
                if (element.data.length === 1) {
                    d.value = [].concat(0)
                        .concat(parseFloat(timePrice.average_price).toFixed(4));
                } else {
                    d.value = [].concat(moment(timePrice.bid_time).format('YYYY-DD-MM HH:mm:ss'))
                        .concat(parseFloat(timePrice.average_price).toFixed(4));
                }
                tmp.data.push(d);
            });
            option.series.push(tmp);
        });
        //console.log(option);
        if (option.hasOwnProperty('dataZoom')) {
            if (!Number.isNaN(this.xStart)) {
                option.dataZoom[0].start = this.xStart;
            }
            if (!Number.isNaN(this.xEnd)) {
                option.dataZoom[0].end = this.xEnd;
            }
            if (!Number.isNaN(this.yStart)) {
                option.dataZoom[1].start = this.yStart;
            }
            if (!Number.isNaN(this.yEnd)) {
                option.dataZoom[1].end = this.yEnd;
            }
        }
        return option;
    }

    onyAxisMouseOver(params) {
        if (params.componentType && params.componentType.toLowerCase() === 'yaxis' && this.charts_instance) {
            let instance = this.charts_instance.getEchartsInstance();
            if (instance) {
                let option = instance.getOption();
                if (option.dataZoom && option.dataZoom.hasOwnProperty(1)) {
                    option.dataZoom[1].show = !option.dataZoom[1].show;
                    instance.setOption(option);
                }
            }
        }
    }

    onDataZoom(params) {
        let instance = this.charts_instance.getEchartsInstance();
        let option = instance.getOption();
        if (params.type === 'datazoom' && params.dataZoomId.length > 0) {
            const lastEle = params.dataZoomId.charAt(params.dataZoomId.length - 1);
            console.log(option);
            if (lastEle === '1') { //y
                this.yStart = params.start;
                this.yEnd = params.end;
                let ps = (option.dataZoom[1].startValue).toFixed(4);
                let pe = (option.dataZoom[1].endValue).toFixed(4);
                this.setState({
                    start_price:ps,
                    end_price:pe
                })
                //console.log(option.dataZoom[1]);
                //console.log("start_price : "+ps);
                //console.log("end_price : " +pe);
            } else if (lastEle === '0') { //x
                this.xStart = params.start;
                this.xEnd = params.end;
                let theStartbidtime = this.theStartbidtime
                let theEndbidtime = this.theEndbidtime
                let diff = moment(theEndbidtime)-moment(theStartbidtime);
                let ts = Math.ceil(diff*(params.start/100))+moment(theStartbidtime);
                let te = Math.ceil(diff*(params.end/100))+moment(theStartbidtime);
                this.setState({
                    start_time:moment(ts).utc().format(),
                    end_time:moment(te).utc().format()
                })
                //console.log("start_time : "+moment(ts).format("YYYY-MM-DD HH:mm:ss"));
                //console.log("end_time : "+moment(te).format("YYYY-MM-DD HH:mm:ss"));
            }
        }
    }
    makeXy(){
        let data = {
            start_time:this.state.start_time,
            end_time:this.state.end_time,
            start_price:this.state.start_price,
            end_price:this.state.end_price
        }
        return data;
    }
    render() {
        let content = <div></div>;
        if (this.props.data) {
            content = <ReactEcharts
                ref={instance => this.charts_instance = instance}
                option={this.getChartOption()}
                notMerge={true}
                style={{minHeight: '310px', width: '100%'}}
                className='react_for_echarts'
                onEvents={this.onEvents}/>
        }
        return (
            content
        );
    }
}

Price.defaultProps = {
    data: [],
    isLtVisible: true,
    isHtsVisible: true,
    isHtlVisible: true,
    isEhtVisible: true
}

function getTemplate(props) {
    if (props.data.every(element => {
            return element.data.length === 1;
        })) {
        return {
            calculable: true,
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
                    let content = `<div>${params.value[1]}</div>`;
                    if (props && params.seriesIndex < props.data.length) {
                        let template;
                        let serObj = props.data[params.seriesIndex];
                        if (serObj && serObj.data) {
                            let d = serObj.data[params.dataIndex];
                            if (d && d.template_price) { //<div>${d.template_price.hts}</div>
                                template = `<strong>${d.template_price.company_price}</strong>
                                    <div style="${props.isLtVisible ? '' : 'display:none'}">${d.template_price.lt}</div>
                                    <div style="${props.isHtsVisible ? '' : 'display:none'}">${d.template_price.hts}</div>
                                    <div style="${props.isHtlVisible ? '' : 'display:none'}">${d.template_price.htl}</div>
                                    <div style="${props.isEhtVisible ? '' : 'display:none'}">${d.template_price.eht}</div>`;
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
                name: '$/kWh',
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 89.99999999,
                axisTick: {
                    show: false
                },
                // max: function (value) {
                //     return 1;
                // },
                // min: yAxisMin,
                axisLine: {
                    lineStyle: {
                        color: 'white'
                    }
                }
            },
            series: []
        }
    }

    let yAxisMin = 0;
    // if (props.data.length > 0) {
    //     let tmp = 1;
    //     props.data.forEach(element => {
    //         let result =  Math.min.apply(null, element.data.map(el => {
    //             return Number(el.average_price);
    //         }));
    //         if (result < tmp) {
    //             tmp = result;
    //         }
    //     })
    //     if (tmp < 1) {
    //         if (tmp > 0.2) {
    //             yAxisMin = parseFloat(tmp - 0.1).toFixed(1);
    //         }
    //     }
    // }
    return {
        calculable: true,
        dataZoom: [{
            type:'slider',
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false,
            bottom: '10%',
            fillerColor: 'rgba(6, 178 ,180 , 0.1)',
            borderColor: '#06b2b3',
            handleColor: '#06b2b3',
            xAxisIndex: 0
        },{
            type:'slider',
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false,
            fillerColor: 'rgba(6, 178 ,180 , 0.1)',
            borderColor: '#06b2b3',
            handleColor: '#06b2b3',
            left: '5%',
            yAxisIndex: 0
        }],
        grid: {
            top: '5%',
            left: '15%',
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
                let content = `<div>${params.value[1]}</div>`;
                if (props && params.seriesIndex < props.data.length) {
                    let template;
                    let serObj = props.data[params.seriesIndex];
                    if (serObj && serObj.data) {
                        let d = serObj.data[params.dataIndex];
                        if (d && d.template_price) { //<div>${d.template_price.hts}</div>
                            template = `<strong>${d.template_price.company_price}</strong>
                                    <div style="${props.isLtVisible ? '' : 'display:none'}">${d.template_price.lt}</div>
                                    <div style="${props.isHtsVisible ? '' : 'display:none'}">${d.template_price.hts}</div>
                                    <div style="${props.isHtlVisible ? '' : 'display:none'}">${d.template_price.htl}</div>
                                    <div style="${props.isEhtVisible ? '' : 'display:none'}">${d.template_price.eht}</div>`;
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
            name: '$/kWh',
            nameLocation: 'middle',
            nameGap: 70,
            nameRotate: 89.99999999,
            axisTick: {
                show: false
            },
            // max: function (value) {
            //     return 1;
            // },
            // min: yAxisMin,
            axisLabel: {
                formatter: (value, index) => {
                    if (typeof value === 'number') {
                        return parseFloat(value).toFixed(4);
                    }
                    return value;
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            triggerEvent: true
        },
        series: []
    }
}