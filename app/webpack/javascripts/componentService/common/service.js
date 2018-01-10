import {Ws, create, get} from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => get(`/api/auctions/${auction}/timer`)

export const createWebsocket = (auction) =>
     new Ws(auction) // return createWS(auction);


export const getAuction = (type, id) => get(`/api/${type}/auctions/obtain?id=${id}`)

export const logout = (id) => create('/api/auctions/logout', {user_id:id})

export const getRoleList = (data, url) => get(url, data)

export const setBuyerParticipate = (data, url) => create(url, data)

export const getBuyerParticipate = (url) => get(url)

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

export const checknetwork = () => create('/api/base/heartbeat')