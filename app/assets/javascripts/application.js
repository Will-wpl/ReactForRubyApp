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
    show_registration:(type)=>{
        $(".registration").hide();
        $("#"+type).fadeIn(500);
    },
    choose_buy_type:()=>{
        $("#buy_registration_choose").hide();
        $("#buyer_registration").fadeIn(500)
        let val = $("#buyer_type").val();
        $(".buyer_type").val(val);
        $("#buyer_registration_type option[value="+val+"]").attr("selected","selected");
        if(val == "company"){
            $("#buyer_registration_company").show();
        }else{
            $("#buyer_registration_Individual").show();
        }
    },
    change_buyer_type:(obj)=>{
        let val = $(obj).val();
        $(".buyer_type").val(val);
        if(val == "company"){
            $("#buyer_registration_Individual").hide();
            $("#buyer_registration_company").fadeIn(500)
        }else{
            $("#buyer_registration_company").hide();
            $("#buyer_registration_Individual").fadeIn(500)
        }
    }
}
