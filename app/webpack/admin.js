import "atlas/src/index.js";

import "./javascripts/shared.js";
import "./styles/admin.scss";

console.log("Admin Webpacker");

$.ajax({
    type: "POST",
    url: '/admin/auctions/2/publish',
    data: {
        hello:{
            a : "hello",
            b : "world"
        }
    },
    success: (data) => {
        console.log(data);
    },
    dataType: 'json'
    // beforeSend(xhr) {
    //     xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
    // }
  });


