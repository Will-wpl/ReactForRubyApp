import React, { Component, PropTypes } from 'react'
export const searchTypeData = {
    "Retailer List":{//connect back end OK
        list_url:"/api/admin/users/retailers",
        list_data:[
                    {title:"Company Name:",type:"company_name",species:"input"},
                    {title:"License Number:",type:"company_license_number",species:"input"},
                    {title:"Status:",type:"approval_status",species:"select",options:[{option:"Rejected",value:"0"},{option:"Approved",value:"1"},{option:"Pending",value:"2"}]}
                ]
    },
    "Buyer List":{//connect back end OK
        list_url:"/api/admin/users/buyers",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Email:",type:"email",species:"input"},
            {title:"Consumer Type:",type:"consumer_type",species:"select",options:[{option:"Company",value:"2"},{option:"Individual",value:"3"}]}
        ]
    },
    "Unpublished Auction List":{//connect back end OK
        list_url:"/api/admin/auctions/unpublished",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Date:",type:"start_datetime",species:"datePacker"}
        ]
    },
    "Published Auction List":{//connect back end OK
        list_url:"/api/admin/auctions/published",
        list_data:[
            {title:"ID:",type:"id",species:"input"},
            {title:"Name:",type:"name",species:"input"},
            {title:"Date:",type:"start_datetime",species:"datePacker"}
        ]
    },
    "Status of Participation":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Date:",type:"start_datetime",species:"datePacker"},
            {title:"Auctions Status:",type:"publish_status",species:"select",options:[{option:"Unpublished",value:"0"},{option:"Published",value:"1"}]},
            {title:"Participation Status:",type:"participation_status",species:"select",options:[{option:"Rejected",value:"0"},{option:"Confirmed",value:"1"},{option:"Pending",value:"2"}]}
        ]
    },
    "Select Retailers":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Company Name:",type:"company_name",species:"input"},
            {title:"Status:",type:"approval_status",species:"select",options:[{option:"Rejected",value:"0"},{option:"Approved",value:"1"},{option:"Pending",value:"2"}]}
        ]
    },
    "Select Company Buyers":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Company Name:",type:"company_name",species:"input"},
            {title:"Status:",type:"approval_status",species:"select",options:[{option:"Rejected",value:"0"},{option:"Approved",value:"1"},{option:"Pending",value:"2"}]}
        ]
    },
    "Select Individual Buyers":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Housing Type:",type:"housing_type",species:"select",options:[{option:"HDB",value:"0"},{option:"Private High-rise",value:"1"},{option:"landed",value:"2"}]},
            {title:"Status:",type:"approval_status",species:"select",options:[{option:"Rejected",value:"0"},{option:"Approved",value:"1"},{option:"Pending",value:"2"}]}
        ]
    }
}
