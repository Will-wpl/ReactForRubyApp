import React from 'react';
import ReactDOM from 'react-dom';


// function Welcome(props) {
//     return <h1>Hello, {props.name}</h1>;
// }

class Welcome extends React.Component {
    componentDidMount() {
        console.log('componentDidMount');
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

const element = <Welcome name="Mark" />;
function run() {
    const domNode = document.getElementById('root');
    if(domNode !== undefined){
        ReactDOM.render(
            element,
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

