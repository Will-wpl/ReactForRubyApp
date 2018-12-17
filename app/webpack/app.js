/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/webpack and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "atlas/src/index.js";
//import "./javascripts/shared.js";
import "./styles/app.scss";
import "components/retailer/retailer-manage-coming";
// import "components/retailer/retailer-live";
import "components/retailer/retailer-live-container";
import "components/retailer/retailer-finish";
import "components/shared/check-network";
import "components/search/home-list";
import "components/retailer/letter-of-award";
import "components/buyer/buyer-fill-consumption";
import "components/retailer/retailer-workflow";
import "components/retailer/retailer-register";
import "components/buyer/buyer-register-entity";
import "components/admin/admin-comsumption";
import "components/buyer/buyer-tc-upload-approve";
import "components/retailer/retailer-tc-upload-approve";
import "components/buyer/buyer-request-entity-list";
import "components/buyer/buyer-request-list"
import "components/buyer/buyer-request-new"
import "components/buyer/buyer-consumption-detail"
import "components/buyer/buyer-workflow"

// ActionCable = require('actioncable')

// const cable = ActionCable.createConsumer()
// const entry = ActionCable.createConsumer().subscriptions.create({
//     channel: 'EntryChannel',
//     auction_id: '1',
//     user_id: '2'
// }, {
//     connected () {
//         console.log('-----message client connected ------------')
//         // auction.checkIn({user_id: 2});
//         // auction.setBid({lt_peak:'0.020', lt_off_peak: '0.1000' , hts_peak:'0.1000',hts_off_peak:'0.0893',htl_peak:'0.1000',htl_off_peak:'0.1000'});
//         // auction.extendTime({extend_time : '5'});
//
//     },
//     disconnected () {
//         console.log('-----message client disconnected ------------')
//         entry.logout();
//     },
//     received (data) {
//         console.log(data)
//     },
//     logout (params) {
//         return this.perform('log_out', params);
//     }
//     ,
//     setBid (params){
//         return this.perform('set_bid', params);
//     },
//     extendTime(params){
//         return this.perform('extend_time', params);
//     }
//     // normal channel code goes here...
// });


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
// if (loadedStates.indexOf(document.readyState) && document.body) {
//     run();
// } else {
//     window.addEventListener('DOMContentLoaded', run, false);
// }