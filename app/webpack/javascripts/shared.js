import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {getLoginUserId} from './componentService/util';
import {logout} from './componentService/common/service';
export default class UserLogout extends Component {
    componentDidMount(){
        window.addEventListener("beforeunload", function(event) {
            event.returnValue = "affaa";
            console.log(event);
            return;
            let n = event.screenX - window.screenLeft;
            let b = n > document.documentElement.scrollWidth -20;
            if(b && event.clientY < -40 || event.altKey){
                alert("关闭浏览器");
                this.doOut();
            }else if(event.clientY > -40 && (event.clientY < -30) && event.clientX > 500){
                alert("关闭标签页");
                this.doOut();
            }else{
                alert("刷新页面");
            }
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
