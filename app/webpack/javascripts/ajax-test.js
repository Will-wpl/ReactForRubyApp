$(function () {

    // auctionObtain();
    // auctionCreate();
    // auctionUpdate();
    // auctionPublish();
    // arrangementList();
    // arrangementDetail();
    // arrangementUpdate();
    // aucitonLink();
    // auctionTimer();
    // auctionHold();
    auctionHistoriesList();
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

    var auction = {
        "id": 1,
        "name": "SP Reverse Auction",
        "start_datetime": "2017-12-01T12:00:00.000Z",
        "contract_period_start_date": "2018-01-01",
        "contract_period_end_date": "2018-06-30",
        "duration": 20,
        "reserve_price": "0.1477",
        "created_at": "2017-11-03T06:41:08.406Z",
        "updated_at": "2017-11-05T06:06:04.782Z",
        "actual_begin_time": null,
        "actual_end_time": null,
        "total_volume": null,
        "publish_status": null,
        "published_gid": null,
        "total_lt_peak": null,
        "total_lt_off_peak": null,
        "total_hts_peak": null,
        "total_hts_off_peak": null,
        "total_htl_peak": null,
        "total_htl_off_peak": null,
        "hold_status": false
    };
    function auctionUpdate() {
        $.ajax({
            type: "PATCH",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/auctions/1',
            data: {
                auction: {
                    id: 1,
                    contract_period_end_date: "2018-06-30",
                    contract_period_start_date: "2018-01-01",
                    duration: 20,
                    name: "SP Reverse Auction",
                    publish_status: null,
                    published_gid: null,
                    reserve_price: "0.1477",
                    start_datetime: "2017-12-01T12:00:00.000Z",
                    total_volume: null,
                    actual_begin_time: "2017-12-01T12:00:00.000Z",
                    actual_end_time: "2017-12-01T12:20:00.000Z",
                    total_volume: null,
                    total_lt_peak: 10000,
                    total_lt_off_peak: 10000,
                    total_hts_peak: 10000,
                    total_hts_off_peak: 10000,
                    total_htl_peak: 10000,
                    total_htl_off_peak: 10000,
                    // please follow auction object

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
                publish_status: '0'
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
            url: '/api/arrangements/3',
            data: {
                arrangement: {
                    "id": 3,
                    "main_name": "hello",
                    "main_email_address": "",
                    "main_mobile_number": "",
                    "main_office_number": "",
                    "alternative_name": null,
                    "alternative_email_address": null,
                    "alternative_mobile_number": null,
                    "alternative_office_number": null,
                    "lt_peak": 0.15,
                    "lt_off_peak": 0.12,
                    "hts_peak": 0.11,
                    "hts_off_peak": 0.16,
                    "htl_peak": 0.11,
                    "htl_off_peak": 0.11,
                    "accept_status": "2"
                }
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }

    function aucitonLink(){
        $.ajax({
            type: "GET",
            url: '/api/auctions/link',
            success: (data) => {
                console.log('auctionLink');
                console.log(data);
            },
            dataType: 'json'
        });
    }

    function auctionTimer(){
        $.ajax({
            type: "GET",
            url: '/api/auctions/1/timer',
            success: (data) => {
                console.log('auctionTimer');
                console.log(data);
            },
            dataType: 'json'
        });
    }

    function auctionHold(){
        $.ajax({
            type: "PUT",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: '/api/auctions/1/hold',
            data: {
                hold_status: true
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }

    function auctionHistoriesList(){
        $.ajax({
            type: "GET",
            url: '/api/auction_histories',
            data: { auction_id: 1, user_id: '3'},
            success: (data) => {
                console.log('auction_histories list');
                console.log(data);
            },
            dataType: 'json'
        });
    }
});