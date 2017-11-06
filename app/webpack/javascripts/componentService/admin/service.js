import {get, create, Ws} from '../../../javascripts/http';

export const getArrangements = (status) => {
    return get('/api/arrangements', { auction_id: 1, accept_status: status });
}

export const createRa = (params) => {
    return update('/api/auctions', params);
}

export const getAuctionInVersionOne = () => {
    return get('/api/auctions/obtain');
}

export const createWebsocket = (auction, methods = {}) => {
    return new Ws(window.location.port, auction);
}