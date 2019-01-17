import React, { Component } from 'react';
import {TimeCuntDown} from '../shared/time-cuntdown';
export class Workflowtab extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount() {

    }
    stepSelect(index){
        let res = '';
        if(this.props.current.current){
            if(this.props.current.current.current_node === index){
                if(this.props.current.current.current_status === "0"){
                    res = '';
                }else if(this.props.current.current.current_status === "closed"){
                    res = 'selected';
                }else if(this.props.current.current.current_status === "reject"){
                    res = '';
                }else{
                    if(this.props.current.current.current_status === null){
                        res = '';
                    }else{
                        res = 'pending';
                    }

                }
                setTimeout(()=>{
                    $(".step"+index).addClass("current");
                },300)
                return res
            }else{
                $(".step"+index).removeClass("current");
            }
            if(this.props.selected.length>0){
                let val = this.props.selected.some(item=>{
                    return item === index
                })
                if(val){
                    res = 'selected'
                }
                return res
            }
        }
    }
    tab(index){
        if(this.props.page){
            this.props.page(index);
        }
    }
    render(){
        return(
            <div>
                <TimeCuntDown auction={this.props.auction} countDownOver={() => {this.setState({disabled:true,editdisabled:true})}} timehidden="countdown_seconds" />
                <div className="u-grid mg0 workflowtab u-mt3">
                    <table className={this.props.single===5?'w_100':(this.props.single===4?'w_80':'w_60')}>
                        <tbody>
                        {this.props.single===5?<tr>
                            <td width="16.8%">
                                <div className={"step1"} current={this.state.current} onClick={this.tab.bind(this,1)}><span className={this.stepSelect(1)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step2"} current={this.state.current} onClick={this.tab.bind(this,2)}><span className={this.stepSelect(2)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step3"} current={this.state.current} onClick={this.tab.bind(this,3)}><span className={this.stepSelect(3)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step4"} onClick={this.tab.bind(this,4)}><span className={this.stepSelect(4)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step5"} onClick={this.tab.bind(this,5)}><span className={this.stepSelect(5)}></span></div>
                            </td>
                        </tr>:(this.props.single===4?<tr>
                            <td width="16.8%">
                                <div className={"step1"} current={this.state.current} onClick={this.tab.bind(this,1)}><span className={this.stepSelect(1)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step2"} current={this.state.current} onClick={this.tab.bind(this,2)}><span className={this.stepSelect(2)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step3"} current={this.state.current} onClick={this.tab.bind(this,3)}><span className={this.stepSelect(3)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step5"} current={this.state.current} onClick={this.tab.bind(this,5)}><span className={this.stepSelect(5)}></span></div>
                            </td>
                        </tr>:<tr>
                            <td width="16.8%">
                                <div className={"step1"} current={this.state.current} onClick={this.tab.bind(this,1)}><span className={this.stepSelect(1)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step2"} current={this.state.current} onClick={this.tab.bind(this,2)}><span className={this.stepSelect(2)}></span></div>
                            </td>
                            <td width="4%">
                                <div className="step_icon"></div>
                            </td>
                            <td width="16.8%">
                                <div className={"step5"} current={this.state.current} onClick={this.tab.bind(this,5)}><span className={this.stepSelect(5)}></span></div>
                            </td>
                        </tr>)}

                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}