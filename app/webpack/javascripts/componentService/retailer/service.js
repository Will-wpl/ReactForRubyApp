import {get} from '../../../javascripts/http';

export const getAuctionHistorys = (auction, user) => {
    return get('/api/auction_histories', { auction_id: auction, user_id: user });
}