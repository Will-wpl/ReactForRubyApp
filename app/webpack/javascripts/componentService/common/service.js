import {get, Ws, createWS} from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => {
    return get(`/api/auctions/${auction}/timer`);
}

export const createWebsocket = (auction) => {
    return new Ws(auction); // return createWS(auction);
}

export const getAuction = () => {
    return get('/api/auctions/obtain');
}

export const ACTION_COMMANDS = {
    SET_BID: 'set_bid'
}