import "atlas/src/index.js";

import "./javascripts/shared.js";
import "./styles/admin.scss";
import "components/create-NewRa";

console.log("Admin Webpacker");


$(function() {
    $.ajax({
        type: "POST",
        url: '/admin/auctions/2/publish',
        data: {
            hello: {
                a: "hello",
                b: "world"
            }
        },
        success: (data) => {
            console.log(data);
        },
        dataType: 'json',
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        //     //jquery 
        // },
        beforeSend: $.rails.CSRFProtection
        //jquery ujs
    });
    
    $.ajax({
        url: '/admin/auctions/obtain',
        success: (data) => {
            console.log(data);
        },
        dataType: 'json'
    });
});
