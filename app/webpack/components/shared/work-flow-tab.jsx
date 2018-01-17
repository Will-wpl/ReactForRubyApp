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
    render(){
        return(
            <div>
                {/* <TimeCuntDown auction={this.props.auction} countDownOver={() => {this.setState({disabled:true,editdisabled:true})}} timehidden="countdown_seconds" /> */}
                <div className="u-grid mg0 workflowtab u-mt3">
                    <table>
                        <tbody>
                            <tr>
                                <td width="16.8%">
                                    <div className="step1"></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className="step2"></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className="step3"></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className="step4"></div>
                                </td>
                                <td width="4%">
                                    <div className="step_icon"></div>
                                </td>
                                <td width="16.8%">
                                    <div className="step5"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}