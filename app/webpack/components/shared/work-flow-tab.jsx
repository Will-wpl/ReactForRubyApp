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
        if(this.props.selected.length>0){
            if(this.props.current_page === index){
                return res;
            }
            let val = this.props.selected.some(item=>{
                return item === index
            })
            if(val){
                res = 'selected'
            }
            return res
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
                                    <div className={"step1 "+this.stepSelect(1)}></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step2 "+this.stepSelect(2)}></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step3 "+this.stepSelect(3)}></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step4 "+this.stepSelect(4)}></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className={"step5 "+this.stepSelect(5)}></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}