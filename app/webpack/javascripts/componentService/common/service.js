import { Ws, create, get, put, post } from '../../../javascripts/http';

export const getAuctionTimeRule = (auction) => get(`/api/auctions/${auction}/timer`)

export const createWebsocket = (auction) =>
    new Ws(auction) // return createWS(auction);


export const getAuction = (type, id) => get(`/api/${type}/auctions/obtain?id=${id}`)

export const logout = (id) => create('/api/auctions/logout', { user_id: id })

export const getRoleList = (data, url) => get(url, data)

export const setBuyerParticipate = (data, url) => create(url, data)

export const getBuyerParticipate = (url) => get(url)

export const getBuyerUserInfo = () => {
    return get('/api/buyer/registrations');
}

export const getBuyerUserInfoByUserId = (id) => {
    return get(`/api/admin/registrations/${id}/buyer_info?user_id=${id}`);
}

export const validateIsExist = (params) => {
    return put('/api/buyer/registrations/' + params.user.id + '/validate', params);
    // return put('/api/buyer/registrations/validate_buyer_entity', params);
}

export const saveBuyerUserInfo = (params) => {
    return put('/api/buyer/registrations/' + params.user.id, params);
}

export const submitBuyerUserInfo = (params) => {
    return put('/api/buyer/registrations/' + params.user.id + '/sign_up', params);
}

export const getNeedBuyerApproveAttachments = () => {
    return get('/api/buyer/users/show_current_user');
}

export const saveBuyerAttachmentModification = () => {
    return put('/api/buyer/users/update_attachment_status');
}

export const validateConsumptionDetailRepeat = (params) => {
    return put('/api/buyer/consumption_details/validate_single', params)
}

export const getBuyerRequestDetail = (params) => {
    return get('./', params)
}

export const saveBuyerRequest = (params) => {
    return put('./', params)
}
export const approveBuyerRequest = (params) => {
    return get('./', params)
}

export const createRA_byRequest = (params) => {
    return put('./', params)
}

export const ACTION_COMMANDS = {
    SET_BID: 'set_bid',
    MAKE_UNIQUE: 'limit_user'
}

export const AUCTION_PROPS = {
    ACTUAL_BEGIN_TIME: 'actual_begin_time',
    ACTUAL_CURRENT_TIME: 'current_time',
    ACTUAL_END_TIME: 'actual_end_time',
    HOLD_STATUS: 'hold_status'
}

export const checknetwork = () => create('/api/base/heartbeat')

export const getTendersCurrent = (type, id) => {
    return get('/api/' + type + '/tenders/' + id + '/current');
}

export const getTenderhistory = (type, id) => {
    return get('/api/' + type + '/tenders/history', { chat_id: id });
}


