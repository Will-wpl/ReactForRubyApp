import React, { Component, PropTypes } from 'react'
export const searchTypeData = {
    "Retailer List": {//connect back end OK
        list_url: "/api/admin/users/retailers",
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like' },
            { title: "License Number:", type: "company_license_number", species: "input", operator: 'like' },
            { title: "Status:", type: "approval_status", operator: '=', table: 'users', species: "select", options: [{ option: "All", value: "" }, { option: "Registering", value: "3" }, { option: "Pending", value: "2" }, { option: "Approved", value: "1" }, { option: "Rejected", value: "0" },] }
        ]
    },

    "Buyer List": {//connect back end OK
        list_url: "/api/admin/users/buyers",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'users' },
            { title: "Email:", type: "email", species: "input", operator: 'like' },
            { title: "Consumer Type:", type: "consumer_type", operator: '=', species: "select", options: [{ option: "Company", value: "2" }, { option: "Individual", value: "3" }] },
            { title: "Status:", type: "approval_status", operator: '=', table: 'users', species: "select", options: [{ option: "All", value: "" }, { option: "Registering", value: "3" }, { option: "Pending", value: "2" }, { option: "Approved", value: "1" }, { option: "Rejected", value: "0" }] }
        ]
    },
    "Deleted Retailer List": {//connect back end OK
        list_url: "/api/admin/users/retailers_deleted",
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like' },
            { title: "License Number:", type: "company_license_number", species: "input", operator: 'like' }
        ]
    },
    "Deleted Buyer List": {//connect back end OK
        list_url: "/api/admin/users/buyers_deleted",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'users' },
            { title: "Email:", type: "email", species: "input", operator: 'like' },
            { title: "Consumer Type:", type: "consumer_type", operator: '=', species: "select", options: [{ option: "Company", value: "2" }, { option: "Individual", value: "3" }] }
        ]
    },
    "Unpublished Auction List": {//connect back end OK
        list_url: "/api/admin/auctions/unpublished",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between' }
        ]
    },
    "Published Auction List": {//connect back end OK
        list_url: "/api/admin/auctions/published",
        list_data: [
            { title: "ID:", type: "published_gid", species: "input", operator: 'like', table: 'auctions' },
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' }
        ]
    },
    "Retailer Published Auction List": {
        list_url: "/api/retailer/auctions/published",
        list_data: [
            { title: "ID:", type: "published_gid", species: "input", operator: 'like', table: 'auctions' },
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' }
        ]
    },
    "Status of Participation": {
        list_url: "/api/buyer/auctions/published",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' },
            { title: "Auctions Status:", type: "publish_status", species: "select", operator: '=', table: 'auctions', options: [{ option: "All", value: "" }, { option: "Unpublished", value: "0" }, { option: "Published", value: "1" }] },
            { title: "Participation Status:", type: "participation_status", species: "select", operator: '=', options: [{ option: "All", value: "" }, { option: "Rejected", value: "0" }, { option: "Confirmed", value: "1" }, { option: "Pending", value: "2" }] }
        ]
    },
    "Select Retailers": {
        list_url: "/api/admin/auctions/" + sessionStorage.auction_id + "/retailers",
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like' },
            { title: "Status:", type: "status", species: "select", operator: '=', options: [{ option: "All", value: "" }, { option: "Not Invited", value: "0" }, { option: "Pending Notification", value: "2" }, { option: "Notification Sent", value: "3" }, { option: "Invited", value: "1" }] }
        ]
    },
    "Select Company Buyers": {
        list_url: "/api/admin/auctions/" + sessionStorage.auction_id + "/buyers",
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like', table: 'users' },
            { title: "Status:", type: "status", species: "select", operator: '=', options: [{ option: "All", value: "" }, { option: "Not Invited", value: "0" }, { option: "Pending Notification", value: "2" }, { option: "Notification Sent", value: "3" }, { option: "Invited", value: "1" }] },
            { title: "consumer_type:", type: "consumer_type", operator: '=', defaultval: '2', species: 'hidden' }
        ]
    },
    "Select Individual Buyers": {
        list_url: "/api/admin/auctions/" + sessionStorage.auction_id + "/buyers",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'users' },
            { title: "Housing Type:", type: "account_housing_type", species: "select", operator: '=', options: [{ option: "All", value: "" }, { option: "HDB", value: "0" }, { option: "Private High-rise", value: "1" }, { option: "Landed", value: "2" }] },
            { title: "Status:", type: "status", species: "select", operator: '=', options: [{ option: "All", value: "" }, { option: "Not Invited", value: "0" }, { option: "Pending Notification", value: "2" }, { option: "Notification Sent", value: "3" }, { option: "Invited", value: "1" }] },
            { title: "consumer_type:", type: "consumer_type", operator: '=', defaultval: '3', species: 'hidden' }
        ]
    },
    "Past Reverse Auction": {//connect back end OK
        list_url: "/api/admin/auction_results",
        list_data: [
            { title: "ID:", type: "published_gid", species: "input", operator: 'like', table: 'auctions' },
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' }
        ]
    },
    "Retailer Past Reverse Auction": {//connect back end OK
        list_url: "/api/retailer/auction_results",
        list_data: [
            { title: "Reference ID:", type: "published_gid", species: "input", operator: 'like', table: 'auctions' },
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' }
        ]
    },
    "Buyer Purchase Order Records": {//connect back end OK
        list_url: "/api/buyer/auction_results",
        list_data: [
            { title: "Reference ID:", type: "published_gid", species: "input", operator: 'like', table: 'auctions' },
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
            { title: "Date:", type: "start_datetime", species: "datePacker", operator: 'date_between', table: 'auctions' }
        ]
    },
    "User Extension List (Retailers)": {//connect back end OK
        list_url: "/api/admin/user_extensions",
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like' },
        ]
    },
    "Auction Log List": {
        list_url: `/api/admin/auctions${window.location.href.indexOf('/log') > 0 ? (window.location.href.split("/auctions")[1].split("/log")[0]) : '1'}/log`,
        list_data: [
            { title: "Company Name:", type: "company_name", species: "input", operator: 'like' },
        ]
    },

    "Manage Buyer Request": {//connect back end OK
        list_url: "/api/buyer/request_auctions",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
        ]
    },
    "Buyer Request List": {//connect back end OK
        list_url: "/api/admin/request_auctions",
        list_data: [
            { title: "Name:", type: "name", species: "input", operator: 'like', table: 'auctions' },
        ]
    },
    
}
