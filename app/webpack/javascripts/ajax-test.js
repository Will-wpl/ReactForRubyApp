$(function () {

    auctionObtain();
    // auctionCreate();
    // auctionUpdate();
    //auctionPublish();
    function auctionObtain() {
        $.ajax({
            type: "GET",
            url: '/admin/auctions/obtain',
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
            url: '/admin/auctions',
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
            url: '/admin/auctions/1',
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
            url: '/admin/auctions/1/publish',
            data: {
                publish_status: 'true'
            },
            success: (data) => {
                console.log('auctionUpdate');
                console.log(data);
            }
        });
    }


    // $.ajax({
    //     type: "POST",
    //     url: '/admin/auctions/2/publish',
    //     data: {
    //         hello: {
    //             a: "hello",
    //             b: "world"
    //         }
    //     },
    //     success: (data) => {
    //         console.log(data);
    //     },
    //     dataType: 'json',
    //     // beforeSend: function (xhr) {
    //     //     xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
    //     //     //jquery 
    //     // },
    //     beforeSend: $.rails.CSRFProtection
    //     //jquery ujs
    // });


});