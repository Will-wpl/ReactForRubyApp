/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/webpack and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "atlas/src/index.js";
import "./javascripts/shared.js";
import "./styles/app.scss";
import "components/retailer/retailer-manage-coming";
import "components/retailer/retailer-live";

ActionCable = require('actioncable')

const cable = ActionCable.createConsumer('ws://localhost:3000/cable')

const chat = cable.subscriptions.create({
    channel: 'ChatChannel',
    room: 'a'
}, {
    connected: function () {
        console.log('-----message client connected ------------')
        chat.buy('hello 1024');
    },
    disconnected: function () {
        console.log('-----message client disconnected ------------')
    },
    received: function (data) {
        console.log("received : " + data.message)
    },
    buy: function (msg) {
        return this.perform('buy', {message: msg});
    }
    // normal channel code goes here...
});


// import ChatRoom from "components/chat-channel";
// function run() {
//     ReactDOM.render(
//         React.createElement(ChatRoom),
//         document.getElementById('chat_room')
//     );
// }
//
// const loadedStates = [
//     'complete',
//     'loaded',
//     'interactive'
// ];
// if (loadedStates.includes(document.readyState) && document.body) {
//     run();
// } else {
//     window.addEventListener('DOMContentLoaded', run, false);
// }