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
                }else if(this.props.current.current.current_status === "rejected"){
                    res = '';
                }else{
                    res = 'pending';
                }
                return res
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
    render(){
        return(
            <div>
                <TimeCuntDown auction={this.props.auction} countDownOver={() => {this.setState({disabled:true,editdisabled:true})}} timehidden="countdown_seconds" />
                <div className="u-grid mg0 workflowtab u-mt3">
                    <table>
                        <tbody>
                            <tr>
                                <td width="16.8%">
                                    <div className={"step1"}><span className={this.stepSelect(1)}></span></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step2"}><span className={this.stepSelect(2)}></span></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step3"}><span className={this.stepSelect(3)}></span></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step4"}><span className={this.stepSelect(4)}></span></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step5"}><span className={this.stepSelect(5)}></span></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}