import {get, create, put, Ws, update,Ddelete} from '../../../javascripts/http';

export const getArrangements = (auction_id, status) => {
    return get('/api/admin/arrangements', { auction_id: auction_id, accept_status: status });
}

export const getBidderStatus = (params) => {
    return get('/api/admin/arrangements', params);
}

export const arrangementDetail = (params) => {
    return get('/api/admin/arrangements/'+params);
}

export const getUsersDetail = (params) => {
    return get('/api/admin/users/'+params);
}

export const removeFile = (params) => {
    return Ddelete('/api/admin/auction_attachments/'+params);
}

export const getFileList = (params) => {
    return get('/api/admin/auction_attachments?auction_id='+params);
}

export const createRa = (params) => {
    return update('/api/admin/auctions/'+params.auction.id, params);
}

export const deleteAuction = (params) => {
    return Ddelete('/api/admin/auctions/'+params.auction.id);
}
// export const createNewRa = (params) => {
//     return update('/api/admin/auctions/new', params);
// }

export const raPublish = (params) => {
    return put('/api/admin/auctions/'+params.id+'/publish', params.pagedata);
}

export const sendMail = (params) => {
    return put('/api/admin/auctions/'+params.id+'/send_mails', params.data);
}

export const getBuyerDetails = (params) => {
    return get('/api/admin/consumptions?id='+params.id+'&consumer_type='+params.type);
}

export const getBuyerDetailsConsumptions = (params) => {
    return get('/api/admin/consumption_details?consumption_id='+params.id);
}

export const adminShowSelects = () => {
    return get('/api/admin/auctions/'+sessionStorage.auction_id+'/selects');
}

export const upateHoldStatus = (auction, hold_status) => {
    return put(`/api/admin/auctions/${auction}/hold`, {hold_status});
}

export const auctionConfirm = (params) => {
    return create('/api/admin/auctions/'+params.id+'/confirm', params.data);
}

export const updateStatus = (params) => {
    return put('/api/admin/'+params.type+'/'+params.id+'/update_status', params.data);
}

export const deleteStatus = (params) => {
    return Ddelete('/api/admin/'+params.type+'/'+params.id);
}

export const getRetailerList = (params) => {
    return get('/api/admin/auctions/'+params+'/retailer_dashboard');
}

export const adminReject = (params) => {
    return create('/api/admin/tenders/'+params+'/node4_admin_reject');
}

export const adminAccept = (params) => {
    return create('/api/admin/tenders/'+params+'/node4_admin_accept');
}

export const adminSendResponse = (params) => {
    return create('/api/admin/tenders/'+params+'/node3_send_response');
}
//arrangements
//consumptions
export const getHistories = (params) => {
    return get('/api/admin/auction_histories/list', params);
}

export const getHistoriesLast = (params) => {
    return get('/api/admin/auction_histories/last', params);
}

export const createWebsocket = (auction, methods = {}) => {
    return new Ws(window.location.port, auction);
}
