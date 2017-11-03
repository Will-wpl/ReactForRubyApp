import {get, create} from '../../../javascripts/http';

export const getArrangements = (status) => {
    return get('/api/arrangements/list', { auction_id: 1, accept_status: status });
}

export const createRa = (params) => {
    return create('/api/auctions', params);
}