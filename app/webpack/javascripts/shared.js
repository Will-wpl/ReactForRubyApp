import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {getLoginUserId} from './componentService/util';
import {logout} from './componentService/common/service';
export default class UserLogout extends Component {
    componentDidMount(){
        $(window).bind('beforeunload',function(){
            return '您输入的内容尚未保存，确定离开此页面吗？';
        });      
    }
    doOut(){
        let user_id = getLoginUserId();
        logout(user_id).then(res=>{
                    console.log(res);
                },error =>{

                })
    }
    render() {
        return <div onClick={this.doOut.bind(this)}>logout</div>
    }
}
function run() {
    const domNode = document.getElementById('UserLogout');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(UserLogout),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}
