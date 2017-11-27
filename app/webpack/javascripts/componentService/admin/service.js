import {get, create, put, Ws,update} from '../../../javascripts/http';

export const getArrangements = (auction_id, status) => {
    return get('/api/arrangements', { auction_id: auction_id, accept_status: status });
}

export const createRa = (params) => {
    return update('/api/auctions/'+params.auction.id, params);
}

export const getAuctionInVersionOne = () => {
    return get('/api/auctions/obtain');
}

export const getRetailerAuctionInVersionOne = (params) => {
    return get('/api/arrangements/obtain',params);
}

export const retailManageComing = (params) => {
    return update('/api/arrangements/'+params.arrangement.id, params);
}

export const raPublish = (params) => {
    return put('/api/auctions/'+params.id+'/publish', params.pagedata);
}

export const getBidderStatus = (params) => {
    return get('/api/arrangements',params);
}

export const createWebsocket = (auction, methods = {}) => {
    return new Ws(window.location.port, auction);
}

export const arrangementDetail = (params) => {
    return get('/api/arrangements/'+params);
}

export const getHistories = (params) => {
    return get('/api/auction_histories/list', params);
}

export const getHistoriesLast = (params) => {
    return get('/api/auction_histories/last', params);
}

export const auctionConfirm = (params) => {
    return create('/api/auctions/'+params.id+'/confirm', params.data);
}

export const upateHoldStatus = (auction, hold_status) => {
    return put(`/api/auctions/${auction}/hold`, {hold_status});
}
