$(function () {

    // auctionObtain();
    // auctionCreate();
    // auctionUpdate();
    // auctionPublish();
    // arrangementList();
    // arrangementDetail();
    arrangementUpdate();
    function auctionObtain() {
        $.ajax({
            type: "GET",
            url: '/api/auctions/obtain',
            success: (data) => {
                console.log('auctionObtain');
                console.log(data);
            },
            dataType: 'json'
        });
    }

    function auctionCreate() {
        $.ajax({
            type: "POST",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/auctions',
            data: {
                auction: {
                    actual_begin_time: null,
                    actual_end_time: null,
                    contract_period_end_date: "2018-06-30",
                    contract_period_start_date: "2018-01-01",
                    duration: 10,
                    name: "SP Reverse Auction",
                    publish_status: null,
                    published_gid: null,
                    reserve_price: "0.1477",
                    start_datetime: "2017-12-01T12:00:00.000Z",
                    total_volume: null
                }
            },
            success: (data) => {
                console.log('auctionCreate');
                console.log(data);
            }
        });
    }

    function auctionUpdate() {
        $.ajax({
            type: "PATCH",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/auctions/1',
            data: {
                auction: {
                    id: 1,
                    actual_begin_time: null,
                    actual_end_time: null,
                    contract_period_end_date: "2018-06-30",
                    contract_period_start_date: "2018-01-01",
                    duration: 11,
                    name: "SP Reverse Auction",
                    publish_status: null,
                    published_gid: null,
                    reserve_price: "0.1477",
                    start_datetime: "2017-12-01T12:00:00.000Z",
                    total_volume: null
                }
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }

    function auctionPublish(){
        $.ajax({
            type: "PUT",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/auctions/1/publish',
            data: {
                publish_status: 'true'
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }

    function arrangementList(){
        $.ajax({
            type: "GET",
            url: '/api/arrangements',
            data: { auction_id: 1, accept_status: '2'},
            success: (data) => {
                console.log('arrangementsList');
                console.log(data);
            },
            dataType: 'json'
        });
    }

    function arrangementDetail(){
        $.ajax({
            type: "GET",
            url: '/api/arrangements/2',
            success: (data) => {
                console.log('arrangementsUserDetail');
                console.log(data);
            },
            dataType: 'json'
        });
    }

    function arrangementUpdate(){
        $.ajax({
            type: "PATCH",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/arrangements/2',
            data: {
                arrangement: {
                    "id": 2,
                    "main_name": "hello",
                    "main_email_address": "",
                    "main_mobile_number": "",
                    "main_office_number": "",
                    "alternative_name": null,
                    "alternative_email_address": null,
                    "alternative_mobile_number": null,
                    "alternative_office_number": null,
                    "lt_peak": null,
                    "lt_off_peak": null,
                    "hts_peak": null,
                    "hts_off_peak": null,
                    "htl_peak": null,
                    "htl_off_peak": null,
                    "accept_status": "2"
                }
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }

});