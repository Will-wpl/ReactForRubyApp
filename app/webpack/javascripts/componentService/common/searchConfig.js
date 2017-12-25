import React, { Component, PropTypes } from 'react'
export const searchTypeData = {
    "Retailer List":{
        list_url:"/api/admin/users/retailers",
        list_data:[
                    {title:"Company Name:",type:"company_name",species:"input"},
                    {title:"License Number:",type:"company_license_number",species:"input"},
                    {title:"Status:",type:"approval_status",species:"select",options:[{option:"Rejected"},{option:"Approved"},{option:"Pending"}]}
                ]
    },
    "Buyer List":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Email:",type:"email",species:"input"},
            {title:"Consumer Type:",type:"consumer_type",species:"select",options:[{option:"Company"},{option:"Individual"}]}
        ]
    },
    "Unpublished Auction List":{
        list_url:"/api/admin/users/buies",
        list_data:[
            {title:"Name:",type:"name",species:"input"},
            {title:"Date:",type:"start_datetime",species:"datePacker"}
        ]
    },
    "Published Auction List":{
        list_url:"/api/admin/users/buies",
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
            {title:"Auctions Status:",type:"publish_status",species:"select",options:[{option:"Unpublished"},{option:"Published"}]},
            {title:"Participation Status:",type:"participation_status",species:"select",options:[{option:"Rejected"},{option:"Confirmed"},{option:"Pending"}]}
        ]
    }
}
