import {get, create, Ws} from '../../../javascripts/http';

export const getArrangements = (status) => {
    return get('/api/arrangements', { auction_id: 1, accept_status: status });
}

export const createRa = (params) => {
    return update('/api/auctions/'+params.auction.id, params);
}

export const getAuctionInVersionOne = () => {
    return get('/api/auctions/obtain');
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