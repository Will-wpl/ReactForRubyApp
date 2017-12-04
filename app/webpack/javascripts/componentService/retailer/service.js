import {get, update} from '../../../javascripts/http';

export const retailManageComing = (params) => {
    return update('/api/arrangements/'+params.arrangement.id, params);
}

export const getRetailerAuctionInVersionOne = (params) => {
    return get('/api/arrangements/obtain', params);
}

export const getAuctionHistorys = (auction, user) => {
    return get('/api/auction_histories', { auction_id: auction, user_id: user });
}