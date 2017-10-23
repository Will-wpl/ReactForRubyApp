import React from 'react';
import ReactDOM from 'react-dom';
const html = <h1>Hello, world!</h1>;

function run() {
    ReactDOM.render(
        html,
        document.getElementById('root')
    );
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}