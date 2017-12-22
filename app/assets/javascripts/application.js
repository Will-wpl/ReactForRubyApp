// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require local-time
//= require_tree .
//alert($(".buy"));
var registration = {
    change_buyer_type:(obj)=>{
        let val = $(obj).val();
        if(val == "2"){
            window.location.href="/users/sign_up?type=2"
        }else{
            window.location.href="/users/sign_up?type=3"
        }
    }
}
