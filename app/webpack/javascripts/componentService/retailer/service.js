import {get, update, create, Ddelete, put} from '../../../javascripts/http';

export const retailManageComing = (params) => {
    return put('/api/retailer/arrangements/'+params.arrangement.id, params);
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

export const retailerWithdrawAllDeviations = (arrangement,data) => {
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_withdraw_all_deviations',{chats:data});
}

export const retailerSubmitDeviations = (arrangement,data) => {
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_submit_deviations',{chats:data});
}

export const retailerDeviationsSave = (arrangement,data) => {
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_save',{chats:data});
}

export const retailerWithdraw = (arrangement,data) => {
    console.log(data);
    return create('/api/retailer/tenders/'+arrangement+'/node3_retailer_withdraw',{chat:data});
}

export const retailerNext = (arrangement,node) => {
    return create('/api/retailer/tenders/'+arrangement+'/node'+node+'_retailer_next');
}

export const retailerSubmit = (arrangement) => {
    return create('/api/retailer/tenders/'+arrangement+'/node4_retailer_submit');
}

export const getUndertaking = (arrangement) => {
    return get('/api/retailer/tenders/'+arrangement+'/node1_retailer');
}

export const getTenderdocuments = (arrangement) => {
    return get('/api/retailer/tenders/'+arrangement+'/node2_retailer');
}

export const getSumission = (arrangement) => {
    return get('/api/retailer/tenders/'+arrangement+'/node4_retailer');
}

export const removeRetailerFile = (params) => {
    return Ddelete('/api/retailer/auction_attachments/'+params);
}

export const retailManageComingNode5 = (params) => {
    return create('/api/retailer/tenders/'+params+'/node5_retailer_submit');
}

export const getRetailerDeviationsList = (params) => {
    return get('/api/retailer/tenders/'+params+'/node3_retailer');
}
export const getRetailerFiles = (params) => {
    return get('/api/retailer/tenders/'+params+'/node5_retailer');
}
export const getLetterOfAward = (params)=> {
    return get(`/api/retailer/auction_results/${params}/award`)
}
export const retailerAcknowledge = (id) => {
    return create(`/api/retailer/consumptions/${id}/acknowledge`)
}
export const retailerAllAcknowledge = (data) => {
    return create(`/api/retailer/consumptions/acknowledge_all`,data)
}
