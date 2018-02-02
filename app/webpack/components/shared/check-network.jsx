import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from './show-modal';
import {checknetwork} from '../../javascripts/componentService/common/service';
import {getLoginUserId} from '../../javascripts/componentService/util'
import {createWS} from '../../javascripts/http';

export class CheckNetwork extends React.Component{
    constructor(props){
        super(props);
        this.state={
            networkStatus:true,
            text:''
        }
    }
    componentDidMount() {
        const userId = getLoginUserId();
        let wsHandler = createWS({
            channel: 'HealthChannel',
            user_id: userId,
            success: () => {
                require('public-ip').v4().then(ip => {
                    // console.log('connected......send  ', ip, userId)
                    wsHandler.perform('heartbeat', {user_id: userId, public_ip4: ip});
                }).catch(err => {
                    wsHandler.perform('heartbeat', {user_id: userId, public_ip4: 'unknown'});
                });
            },
            fail: () => {
                // console.log('disconnected......')
            },
            feedback: (data) => {

            }
        })
        checknetwork().then(res => {
            this.setState({
                networkStatus:true
            })
        },error => {
            this.setState({
                networkStatus:false,
                text:window.location.href.indexOf('admin') > 0 
                ? 'Error: Network connection failed.' 
                : 'Error: Network connection failed. Please contact your administrator at revv@spgroup.com.sg for assistance.'
            })
            this.refs.Modal.showModal();
        })
    }
    render(){
        return(
            <div>
                {this.state.networkStatus ? '' : <Modal text={this.state.text} ref="Modal" />}
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('checkNetwork');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(CheckNetwork),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}