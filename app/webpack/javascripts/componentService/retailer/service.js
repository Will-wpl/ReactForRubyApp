import {get, update, create} from '../../../javascripts/http';

export const retailManageComing = (params) => {
    return update('/api/retailer/arrangements/'+params.arrangement.id, params);
}

export const getRetailerAuctionInVersionOne = (params) => {
    return get('/api/retailer/arrangements/obtain', params);
}

export const getAuctionHistorys = (auction, user) => {
    return get('/api/retailer/auction_histories', { auction_id: auction, user_id: user });
}

export const validateCanBidForm = (auction) => {
    return create('', {});
}

export const retailerReject = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node1_retailer_reject');
}

export const retailerAccept = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node1_retailer_accept');
}

export const retailerPproposeDeviations = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node2_retailer_propose_deviations');
}

export const retailerAcceptAll = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node2_retailer_accept_all');
}

export const retailerWithdrawAllDeviations = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_withdraw_all_deviations');
}

export const retailerSubmitDeviations = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_submit_deviations');
}

export const retailerNext = (arrangement,node) => {
    return create('/api/retailer/tenders/'+arrangement+'/node'+node+'_retailer_next');
}

export const retailerSubmit = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node4_retailer_submit');
}
