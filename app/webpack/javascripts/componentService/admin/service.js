import {get, create} from '../../../javascripts/http';

export const getArrangements = (status) => {
    return get('/api/arrangements', { auction_id: 1, accept_status: status });
}

export const createRa = (params) => {
    return update('/api/auctions', params);
}