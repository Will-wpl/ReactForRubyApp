import {get, Ws} from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => {
    return get(`/api/auctions/${auction}/timer`);
}

export const createWebsocket = (auction, methods = {}) => {
    return new Ws(window.location.port, auction);
}