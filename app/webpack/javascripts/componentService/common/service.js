import {get, Ws, create} from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => {
    return get(`/api/auctions/${auction}/timer`);
}

export const createWebsocket = (auction) => {
    return new Ws(auction); // return createWS(auction);
}

export const getAuction = (type,id) => {
    return get(`/api/${type}/auctions/obtain?id=${id}`);
}

export const logout = (id) => {
    return create('/api/auctions/logout',{user_id:id});
}

export const getRoleList = (data,url) => {
    return get(url,data);
}

export const setBuyerParticipate = (data,url) => {
    return create(url,data);
}

export const getBuyerParticipate = (url) => {
    return get(url);
}

export const ACTION_COMMANDS = {
    SET_BID: 'set_bid',
    MAKE_UNIQUE: 'limit_user'
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