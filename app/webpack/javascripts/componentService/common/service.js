import {get, Ws, create} from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => {
    return get(`/api/auctions/${auction}/timer`);
}

export const createWebsocket = (auction) => {
    return new Ws(auction); // return createWS(auction);
}

export const getAuction = (type) => {
    return get(`/api/${type}/auctions/obtain`);
}

export const logout = (id) => {
    return create('/api/auctions/logout',{user_id:id});
}

export const ACTION_COMMANDS = {
    SET_BID: 'set_bid',
    MAKE_UNIQUE: 'limit_user',
    CAN_BIDDING_FORM: 'can_bid_form'
}

export const AUCTION_PROPS = {
    ACTUAL_BEGIN_TIME : 'actual_begin_time',
    ACTUAL_CURRENT_TIME : 'current_time',
    ACTUAL_END_TIME : 'actual_end_time',
    HOLD_STATUS : 'hold_status'
}

export const checknetwork = () => {
    return create('/api/base/heartbeat');
}