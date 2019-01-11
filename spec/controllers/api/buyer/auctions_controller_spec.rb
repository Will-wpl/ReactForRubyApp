require 'rails_helper'

RSpec.describe Api::Buyer::AuctionsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:auctions) { create_list(:auction, 10, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyers) { create_list(:user, 30, :with_buyer, :with_company_buyer) }
  let!(:consumption0) { create(:consumption, user: company_buyers[0], auction: auctions[0], participation_status: '1', action_status: '1') }
  let!(:consumption1) { create(:consumption, user: company_buyers[0], auction: auctions[1], participation_status: '1', action_status: '1') }
  let!(:consumption2) { create(:consumption, user: company_buyers[0], auction: auctions[2], participation_status: '1', action_status: '1') }
  let!(:consumption3) { create(:consumption, user: company_buyers[0], auction: auctions[3], participation_status: '2', action_status: '1') }
  let!(:consumption4) { create(:consumption, user: company_buyers[0], auction: auctions[7], participation_status: '2', action_status: '1') }
  let!(:consumption5) { create(:consumption, user: company_buyers[0], auction: auctions[9], participation_status: '2', action_status: '1') }
  let!(:consumption6) { create(:consumption, user: company_buyers[1], auction: auctions[7]) }
  let!(:consumption7) { create(:consumption, user: company_buyers[1], auction: auctions[9]) }
  let!(:consumption8) { create(:consumption, user: company_buyers[2], auction: auctions[7]) }
  let!(:consumption9) { create(:consumption, user: company_buyers[2], auction: auctions[9]) }

  base_url = 'api/buyer/auctions'
  # context 'retailer user' do
  #   before { sign_in retailer_user }
  #
  #   describe 'GET obtain' do
  #     context 'has an part of auction' do
  #       def do_request
  #         get :obtain, params: { id: auction.id }
  #       end
  #       before { do_request }
  #       it 'success' do
  #         hash_body = JSON.parse(response.body)
  #         expect(hash_body['id']).to eq(auction.id)
  #         expect(hash_body['name']).to be_nil
  #         expect(response).to have_http_status(:ok)
  #       end
  #     end
  #   end
  # end
  #
  describe 'GET buyer published auction list' do
    before { sign_in company_buyers[0] }
    context 'Pager published auction' do
      def do_request
        get :published, params: { page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(6)
        expect(hash['bodies']['total']).to eq(6)
        expect(hash['bodies']['data'].size).to eq(6)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'Params pagers published auction' do
      def do_request
        get :published, params: { name: [auctions[0].name, 'like', 'auctions'],
                                  actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between', 'auctions'],
                                  publish_status: [auctions[0].publish_status, '=', 'auctions'],
                                  participation_status: ['1', '='],
                                  page_size: '10', page_index: '1' }
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(6)
        # expect(hash['bodies']['total']).to eq(3)
        expect(hash['bodies']['data'].size).to eq(3)
        expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        expect(hash['bodies']['data'][0]['actions']).to eq(1)
      end
    end

    context 'Params pagers published auction and sort' do
      def do_request
        get :published, params: { name: [auctions[0].name, 'like', 'auctions'],
                                  actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between', 'auctions'],
                                  publish_status: [auctions[0].publish_status, '=', 'auctions'],
                                  participation_status: ['1', '='],
                                  page_size: '10', page_index: '1', sort_by: ['participation_status' , 'asc', 'consumptions']}
      end

      before { do_request }
      it 'Success' do
        hash = JSON.parse(response.body)
        expect(hash['headers'].size).to eq(6)
        # expect(hash['bodies']['total']).to eq(3)
        expect(hash['bodies']['data'].size).to eq(3)
        expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        expect(hash['bodies']['data'][0]['actions']).to eq(1)
      end
    end
  end

  context 'api/retailer/auctions routes' do
    describe 'GET timer' do
      it 'success' do
        expect(get: "/#{base_url}/#{auction.id}/timer").not_to be_routable
      end
    end

    describe 'GET obtain' do
      it 'success' do
        expect(get: "/#{base_url}/obtain").to be_routable
        expect(get: "/#{base_url}/obtain").to route_to(controller: "#{base_url}",
                                                       action: "obtain")
      end
    end

    describe 'PUT publish' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/publish").not_to be_routable
      end
    end

    describe 'PUT hold' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/hold").not_to be_routable
      end
    end

    describe 'POST confirm' do
      it 'success' do
        expect(post: "/#{base_url}/#{auction.id}/confirm").not_to be_routable
      end
    end

    describe 'PUT/PATCH update' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}").not_to be_routable
        expect(patch: "/#{base_url}/#{auction.id}").not_to be_routable
      end
    end
  end

  describe 'GET pdf' do
    before :each do
      @auction_test = create(:auction, name:'Test20170510',start_datetime:'2018-02-07T06:57:00',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',duration:10,reserve_price:0.1222,created_at:'2018-02-07T06:49:44.531577',updated_at:'2018-02-07T06:55:27.423286',actual_begin_time:'2018-02-07T06:57:00',actual_end_time:'2018-02-07T07:07:00',total_volume:39452.05479452054794521,publish_status:1,published_gid:'RA20180009',total_lt_peak:10000.0,total_lt_off_peak:10000.0,total_hts_peak:10000.0,total_hts_off_peak:10000.0,total_htl_peak:10000.0,total_htl_off_peak:10000.0,hold_status:false,time_extension:0,average_price:0,retailer_mode:0,total_eht_peak:10000.0,total_eht_off_peak:10000.0)

      @user1 = create(:user, email:'yangqingxin@chinasofti.com',encrypted_password:'$2a$11$qSIYYyBxF97DQpxrJv3JtOZ7643w.g/sPsjUJvIjcugDq02Gl61eS',sign_in_count:4,current_sign_in_at:'2018-03-07T07:39:19.749265',last_sign_in_at:'2018-03-07T07:30:13.6502',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.807288',updated_at:'2018-03-07T07:39:19.751447',company_name:'Yang Qingxin Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 02234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user2 = create(:user, email:'will.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01244',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user3 = create(:user, email:'judy.zhu@chinasofti.com',encrypted_password:'$2a$11$Ee.qBlHtLx3W4iffIPIYQ.HbkioLZLVG/pfjmrHeO7aCKI267wTfu',sign_in_count:11,current_sign_in_at:'2018-03-09T02:24:13.334563',last_sign_in_at:'2018-03-09T01:56:00.396638',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.662046',updated_at:'2018-03-09T02:24:13.335992',company_name:'Judy Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user4 = create(:user, :with_buyer, email:'user14.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01235',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user5 = create(:user, email:'user23.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01236',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user6 = create(:user, email:'user24.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01237',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user7 = create(:user, email:'user33.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01238',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      sign_in @user4


      @auction_result_test = create(:auction_result, reserve_price:0.1222,lowest_average_price:0.099900000000000000000075965624999999999999991,status:'win',lowest_price_bidder:'Judy Electricity',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',total_volume:39452.05479452054794521,total_award_sum:3941.260273972602739729476,lt_peak:0.0999,lt_off_peak:0.0999,hts_peak:0.0999,hts_off_peak:0.0999,htl_peak:0.0999,htl_off_peak:0.0999,user:@user3,auction: @auction_test,created_at:'2018-02-07T07:07:05.951654',updated_at:'2018-02-07T07:07:05.951654',eht_peak:0.0999,eht_off_peak:0.0999)

      create(:auction_history, average_price:0.120100000000000000000091326041666666666666656,lt_peak:0.1201,lt_off_peak:0.1201,hts_peak:0.1201,hts_off_peak:0.1201,htl_peak:0.1201,htl_off_peak:0.1201,bid_time:"2018-02-07T06:59:15.728765",user:@user2,auction: @auction_test,created_at:"2018-02-07T06:59:15.779643",updated_at:"2018-02-07T06:59:15.779643",total_award_sum:"4738.191780821917808223324",ranking:3,is_bidder:false,flag:"eef657fd-c478-4de9-99cb-4e8d92ad0183",actual_bid_time:"2018-02-07T06:58:25.536",eht_peak:0.1201,eht_off_peak:0.1201)
      create(:auction_history, average_price:0.12000000000000000000009124999999999999999999,lt_peak:0.12,lt_off_peak:0.12,hts_peak:0.12,hts_off_peak:0.12,htl_peak:0.12,htl_off_peak:0.12,bid_time:"2018-02-07T06:59:15.728765",user:@user1,auction: @auction_test,created_at:"2018-02-07T06:59:15.766355",updated_at:"2018-02-07T06:59:15.766355",total_award_sum:"4734.2465753424657534288",ranking:2,is_bidder:false,flag:"eef657fd-c478-4de9-99cb-4e8d92ad0183",actual_bid_time:"2018-02-07T06:58:04.841",eht_peak:0.12,eht_off_peak:0.12)
      create(:auction_history, average_price:0.099900000000000000000075965624999999999999991,lt_peak:0.0999,lt_off_peak:0.0999,hts_peak:0.0999,hts_off_peak:0.0999,htl_peak:0.0999,htl_off_peak:0.0999,bid_time:"2018-02-07T06:59:15.728765",user:@user3,auction: @auction_test,created_at:"2018-02-07T06:59:15.744567",updated_at:"2018-02-07T06:59:15.744567",total_award_sum:"3941.260273972602739729476",ranking:1,is_bidder:true,flag:"eef657fd-c478-4de9-99cb-4e8d92ad0183",actual_bid_time:"2018-02-07T06:59:15.728765",eht_peak:0.0999,eht_off_peak:0.0999)
      create(:auction_history, average_price:0.120100000000000000000091326041666666666666656,lt_peak:0.1201,lt_off_peak:0.1201,hts_peak:0.1201,hts_off_peak:0.1201,htl_peak:0.1201,htl_off_peak:0.1201,bid_time:"2018-02-07T06:58:59.116883",user:@user2,auction: @auction_test,created_at:"2018-02-07T06:58:59.174917",updated_at:"2018-02-07T06:58:59.174917",total_award_sum:"4738.191780821917808223324",ranking:3,is_bidder:false,flag:"e1e22e1a-33b8-4222-8a7d-56822f47fe29",actual_bid_time:"2018-02-07T06:58:25.536",eht_peak:0.1201,eht_off_peak:0.1201)
      create(:auction_history, average_price:0.12000000000000000000009124999999999999999999,lt_peak:0.12,lt_off_peak:0.12,hts_peak:0.12,hts_off_peak:0.12,htl_peak:0.12,htl_off_peak:0.12,bid_time:'2018-02-07T06:58:59.116883' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:58:59.163415' ,updated_at: '2018-02-07T06:58:59.163415' ,total_award_sum: '4734.2465753424657534288' ,ranking:2,is_bidder:false,flag: 'e1e22e1a-33b8-4222-8a7d-56822f47fe29' ,actual_bid_time:'2018-02-07T06:58:04.841' ,eht_peak:0.12,eht_off_peak:0.12)
      create(:auction_history, average_price:0.100000000000000000000076041666666667,lt_peak:0.1,lt_off_peak:0.1,hts_peak:0.1,hts_off_peak:0.1,htl_peak:0.1,htl_off_peak:0.1,bid_time:'2018-02-07T06:58:59.116883' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:58:59.124376' ,updated_at: '2018-02-07T06:58:59.124376' ,total_award_sum: '3945.205479452054794524' ,ranking:1,is_bidder:true,flag: 'e1e22e1a-33b8-4222-8a7d-56822f47fe29' ,actual_bid_time:'2018-02-07T06:58:59.116883' ,eht_peak:0.1,eht_off_peak:0.1)
      create(:auction_history, average_price:0.120100000000000000000091326041666666666666656,lt_peak:0.1201,lt_off_peak:0.1201,hts_peak:0.1201,hts_off_peak:0.1201,htl_peak:0.1201,htl_off_peak:0.1201,bid_time:'2018-02-07T06:58:53.252474' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:58:53.303381' ,updated_at: '2018-02-07T06:58:53.303381' ,total_award_sum: '4738.191780821917808223324' ,ranking:3,is_bidder:false,flag: 'd89d5f85-6c48-487a-821e-a4e5e50fc5b2' ,actual_bid_time:'2018-02-07T06:58:25.536' ,eht_peak:0.1201,eht_off_peak:0.1201)
      create(:auction_history, average_price:0.12000000000000000000009124999999999999999999,lt_peak:0.12,lt_off_peak:0.12,hts_peak:0.12,hts_off_peak:0.12,htl_peak:0.12,htl_off_peak:0.12,bid_time:'2018-02-07T06:58:53.252474' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:58:53.290903' ,updated_at: '2018-02-07T06:58:53.290903' ,total_award_sum: '4734.2465753424657534288' ,ranking:2,is_bidder:false,flag: 'd89d5f85-6c48-487a-821e-a4e5e50fc5b2' ,actual_bid_time:'2018-02-07T06:58:04.841' ,eht_peak:0.12,eht_off_peak:0.12)
      create(:auction_history, average_price:0.111100000000000000000084482291666666666666657,lt_peak:0.1111,lt_off_peak:0.1111,hts_peak:0.1111,hts_off_peak:0.1111,htl_peak:0.1111,htl_off_peak:0.1111,bid_time:'2018-02-07T06:58:53.252474' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:58:53.268726' ,updated_at: '2018-02-07T06:58:53.268726' ,total_award_sum: '4383.123287671232876716164' ,ranking:1,is_bidder:true,flag: 'd89d5f85-6c48-487a-821e-a4e5e50fc5b2' ,actual_bid_time:'2018-02-07T06:58:53.252474' ,eht_peak:0.1111,eht_off_peak:0.1111)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:58:25.536471' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:58:25.583957' ,updated_at: '2018-02-07T06:58:25.583957' ,total_award_sum: '5752.109589041095890415992' ,ranking:3,is_bidder:false,flag: '8672501b-0d9a-46df-bb24-27d6df60716e' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.120100000000000000000091326041666666666666656,lt_peak:0.1201,lt_off_peak:0.1201,hts_peak:0.1201,hts_off_peak:0.1201,htl_peak:0.1201,htl_off_peak:0.1201,bid_time:'2018-02-07T06:58:25.536471' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:58:25.559024' ,updated_at: '2018-02-07T06:58:25.559024' ,total_award_sum: '4738.191780821917808223324' ,ranking:2,is_bidder:true,flag: '8672501b-0d9a-46df-bb24-27d6df60716e' ,actual_bid_time:'2018-02-07T06:58:25.536471' ,eht_peak:0.1201,eht_off_peak:0.1201)
      create(:auction_history, average_price:0.12000000000000000000009124999999999999999999,lt_peak:0.12,lt_off_peak:0.12,hts_peak:0.12,hts_off_peak:0.12,htl_peak:0.12,htl_off_peak:0.12,bid_time:'2018-02-07T06:58:25.536471' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:58:25.546566' ,updated_at: '2018-02-07T06:58:25.546566' ,total_award_sum: '4734.2465753424657534288' ,ranking:1,is_bidder:false,flag: '8672501b-0d9a-46df-bb24-27d6df60716e' ,actual_bid_time:'2018-02-07T06:58:04.841' ,eht_peak:0.12,eht_off_peak:0.12)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:58:04.841253' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:58:04.948054' ,updated_at: '2018-02-07T06:58:04.948054' ,total_award_sum: '5752.109589041095890415992' ,ranking:3,is_bidder:false,flag: '9caaafad-e8ac-4fe8-aa8e-af914c1174fa' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.121100000000000000000092086458333333333333323,lt_peak:0.1211,lt_off_peak:0.1211,hts_peak:0.1211,hts_off_peak:0.1211,htl_peak:0.1211,htl_off_peak:0.1211,bid_time:'2018-02-07T06:58:04.841253' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:58:04.936784' ,updated_at: '2018-02-07T06:58:04.936784' ,total_award_sum: '4777.643835616438356168564' ,ranking:2,is_bidder:false,flag: '9caaafad-e8ac-4fe8-aa8e-af914c1174fa' ,actual_bid_time:'2018-02-07T06:57:54.775' ,eht_peak:0.1211,eht_off_peak:0.1211)
      create(:auction_history, average_price:0.12000000000000000000009124999999999999999999,lt_peak:0.12,lt_off_peak:0.12,hts_peak:0.12,hts_off_peak:0.12,htl_peak:0.12,htl_off_peak:0.12,bid_time:'2018-02-07T06:58:04.841253' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:58:04.868724' ,updated_at: '2018-02-07T06:58:04.868724' ,total_award_sum: '4734.2465753424657534288' ,ranking:1,is_bidder:true,flag: '9caaafad-e8ac-4fe8-aa8e-af914c1174fa' ,actual_bid_time:'2018-02-07T06:58:04.841253' ,eht_peak:0.12,eht_off_peak:0.12)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:54.775553' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:57:54.839006' ,updated_at: '2018-02-07T06:57:54.839006' ,total_award_sum: '5752.109589041095890415992' ,ranking:3,is_bidder:false,flag: '5a142cd9-421b-45da-9d76-0e7d9358cb4b' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.122200000000000000000092922916666666666666656,lt_peak:0.1222,lt_off_peak:0.1222,hts_peak:0.1222,hts_off_peak:0.1222,htl_peak:0.1222,htl_off_peak:0.1222,bid_time:'2018-02-07T06:57:54.775553' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:57:54.816942' ,updated_at: '2018-02-07T06:57:54.816942' ,total_award_sum: '4821.041095890410958908328' ,ranking:2,is_bidder:false,flag: '5a142cd9-421b-45da-9d76-0e7d9358cb4b' ,actual_bid_time:'2018-02-07T06:57:41.197' ,eht_peak:0.1222,eht_off_peak:0.1222)
      create(:auction_history, average_price:0.121100000000000000000092086458333333333333323,lt_peak:0.1211,lt_off_peak:0.1211,hts_peak:0.1211,hts_off_peak:0.1211,htl_peak:0.1211,htl_off_peak:0.1211,bid_time:'2018-02-07T06:57:54.775553' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:57:54.787509' ,updated_at: '2018-02-07T06:57:54.787509' ,total_award_sum: '4777.643835616438356168564' ,ranking:1,is_bidder:true,flag: '5a142cd9-421b-45da-9d76-0e7d9358cb4b' ,actual_bid_time:'2018-02-07T06:57:54.775553' ,eht_peak:0.1211,eht_off_peak:0.1211)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:41.197261' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:57:41.235656' ,updated_at: '2018-02-07T06:57:41.235656' ,total_award_sum: '5752.109589041095890415992' ,ranking:3,is_bidder:false,flag: 'd9406550-2964-4699-adb1-d59e440488f9' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.130000000000000000000098854166666666666666655,lt_peak:0.13,lt_off_peak:0.13,hts_peak:0.13,hts_off_peak:0.13,htl_peak:0.13,htl_off_peak:0.13,bid_time:'2018-02-07T06:57:41.197261' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:57:41.226634' ,updated_at: '2018-02-07T06:57:41.226634' ,total_award_sum: '5128.7671232876712328812' ,ranking:2,is_bidder:false,flag: 'd9406550-2964-4699-adb1-d59e440488f9' ,actual_bid_time:'2018-02-07T06:57:27.85' ,eht_peak:0.13,eht_off_peak:0.13)
      create(:auction_history, average_price:0.122200000000000000000092922916666666666666656,lt_peak:0.1222,lt_off_peak:0.1222,hts_peak:0.1222,hts_off_peak:0.1222,htl_peak:0.1222,htl_off_peak:0.1222,bid_time:'2018-02-07T06:57:41.197261' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:57:41.206609' ,updated_at: '2018-02-07T06:57:41.206609' ,total_award_sum: '4821.041095890410958908328' ,ranking:1,is_bidder:true,flag: 'd9406550-2964-4699-adb1-d59e440488f9' ,actual_bid_time:'2018-02-07T06:57:41.197261' ,eht_peak:0.1222,eht_off_peak:0.1222)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:27.850124' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:57:27.915204' ,updated_at: '2018-02-07T06:57:27.915204' ,total_award_sum: '5752.109589041095890415992' ,ranking:3,is_bidder:false,flag: 'b3220238-8f32-445e-b193-9c7622430914' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.133300000000000000000101363541666666666666655,lt_peak:0.1333,lt_off_peak:0.1333,hts_peak:0.1333,hts_off_peak:0.1333,htl_peak:0.1333,htl_off_peak:0.1333,bid_time:'2018-02-07T06:57:27.850124' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:57:27.907309' ,updated_at: '2018-02-07T06:57:27.907309' ,total_award_sum: '5258.958904109589041100492' ,ranking:2,is_bidder:false,flag: 'b3220238-8f32-445e-b193-9c7622430914' ,actual_bid_time:'2018-02-07T06:57:10.699' ,eht_peak:0.1333,eht_off_peak:0.1333)
      create(:auction_history, average_price:0.130000000000000000000098854166666666666666655,lt_peak:0.13,lt_off_peak:0.13,hts_peak:0.13,hts_off_peak:0.13,htl_peak:0.13,htl_off_peak:0.13,bid_time:'2018-02-07T06:57:27.850124' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:57:27.877874' ,updated_at: '2018-02-07T06:57:27.877874' ,total_award_sum: '5128.7671232876712328812' ,ranking:1,is_bidder:true,flag: 'b3220238-8f32-445e-b193-9c7622430914' ,actual_bid_time:'2018-02-07T06:57:27.850124' ,eht_peak:0.13,eht_off_peak:0.13)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:10.699158' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:57:10.765249' ,updated_at: '2018-02-07T06:57:10.765249' ,total_award_sum: '5752.109589041095890415992' ,ranking:2,is_bidder:false,flag: '8e4a4e2c-0b31-4c34-83d9-02ae66d9b3de' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:10.699158' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:57:10.751158' ,updated_at: '2018-02-07T06:57:10.751158' ,total_award_sum: '5752.109589041095890415992' ,ranking:2,is_bidder:false,flag: '8e4a4e2c-0b31-4c34-83d9-02ae66d9b3de' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.133300000000000000000101363541666666666666655,lt_peak:0.1333,lt_off_peak:0.1333,hts_peak:0.1333,hts_off_peak:0.1333,htl_peak:0.1333,htl_off_peak:0.1333,bid_time:'2018-02-07T06:57:10.699158' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:57:10.724875' ,updated_at: '2018-02-07T06:57:10.724875' ,total_award_sum: '5258.958904109589041100492' ,ranking:1,is_bidder:true,flag: '8e4a4e2c-0b31-4c34-83d9-02ae66d9b3de' ,actual_bid_time:'2018-02-07T06:57:10.699158' ,eht_peak:0.1333,eht_off_peak:0.1333)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:00' ,user:@user1,auction: @auction_test,created_at: '2018-02-07T06:54:39.530875' ,updated_at: '2018-02-07T06:54:39.546797' ,total_award_sum: '5752.109589041095890415992' ,ranking:1,is_bidder:true,flag: 'null' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:00' ,user:@user2,auction: @auction_test,created_at: '2018-02-07T06:53:45.656599' ,updated_at: '2018-02-07T06:53:45.66932' ,total_award_sum: '5752.109589041095890415992' ,ranking:1,is_bidder:true,flag: 'null' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)
      create(:auction_history, average_price:0.145800000000000000000110868749999999999999987,lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,bid_time:'2018-02-07T06:57:00' ,user:@user3,auction: @auction_test,created_at: '2018-02-07T06:52:44.293282' ,updated_at: '2018-02-07T06:52:44.327446' ,total_award_sum: '5752.109589041095890415992' ,ranking:1,is_bidder:true,flag: 'null' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458)

      @consumption_test = create(:consumption, action_status:1,participation_status:1,lt_peak:10000.0,lt_off_peak:10000.0,hts_peak:10000.0,hts_off_peak:10000.0,htl_peak:10000.0,htl_off_peak:10000.0,user:@user4,auction: @auction_test,created_at: '2018-02-07T06:49:47.698736' ,updated_at: '2018-03-09T02:24:36.338668' ,eht_peak:10000.0,eht_off_peak:10000.0,acknowledge:1)
      create(:consumption, action_status:1,participation_status:2,user:@user5,auction: @auction_test,created_at: '2018-02-07T06:49:48.04069' ,updated_at: '2018-02-07T06:49:48.04069' )
      create(:consumption, action_status:1,participation_status:2,user:@user6,auction: @auction_test,created_at: '2018-02-07T06:49:52.993281' ,updated_at: '2018-02-07T06:49:52.993281' )
      create(:consumption, action_status:1,participation_status:2,user:@user7,auction: @auction_test,created_at: '2018-02-07T06:49:53.377232' ,updated_at: '2018-02-07T06:49:53.377232' )

      @arrangement_test = create(:arrangement, main_name:'test',main_email_address:'enquiry@bestelectricity.com.sg',main_mobile_number:'12345678',main_office_number:'12346578',alternative_name:'',alternative_email_address:'',alternative_mobile_number:'',alternative_office_number:'',lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,user:@user3,auction: @auction_test,accept_status:1,created_at:'2018-02-07T06:51:30.493463',updated_at:'2018-02-07T06:52:44.25187',action_status:1,eht_peak:0.1458,eht_off_peak:0.1458,comments:'')

      create(:tender_state_machine, previous_node:4,current_node:4,current_status:2,turn_to_role:1,current_role:2,arrangement:@arrangement_test,created_at:'2018-02-07T06:52:09.874848',updated_at:'2018-02-07T06:52:09.874848')

      create(:consumption_detail,account_number:111,intake_level:'LT',peak:10000.0,off_peak:10000.0,consumption:@consumption_test,created_at: '2018-02-07T06:51:07.533246' ,updated_at: '2018-02-07T06:51:07.533246' ,premise_address:'address 67 -1', contracted_capacity: 10000.0)
      create(:consumption_detail,account_number:222,intake_level:'HTS',peak:10000.0,off_peak:10000.0,consumption:@consumption_test,created_at: '2018-02-07T06:51:07.536357' ,updated_at: '2018-02-07T06:51:07.536357' )
      create(:consumption_detail,account_number:333,intake_level:'HTL',peak:10000.0,off_peak:10000.0,consumption:@consumption_test,created_at: '2018-02-07T06:51:07.540794' ,updated_at: '2018-02-07T06:51:07.540794' )
      create(:consumption_detail,account_number:444,intake_level:'EHT',peak:10000.0,off_peak:10000.0,consumption:@consumption_test,created_at: '2018-02-07T06:51:07.544786' ,updated_at: '2018-02-07T06:51:07.544786')
    end


    # context 'GET /api/buyer/auctions/:id/letter_of_award_pdf' do
    #   it 'buyer letter of award pdf', pdf: true do
    #     expect(get: "/api/buyer/auctions/#{@auction_test.id.to_s}/letter_of_award_pdf").to be_routable
    #
    #     get :letter_of_award_pdf, params: {id: @auction_test.id}
    #     expect(response.headers['Content-Type']).to have_content 'application/pdf'
    #   end
    # end

    context 'GET /api/buyer/auctions/:id/pdf' do
      it 'buyer ra report pdf', pdf: true do
        expect(get: "/api/buyer/auctions/#{@auction_test.id.to_s}/pdf").to be_routable

        get :pdf, params: {id: @auction_test.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'buyer ra report pdf auctions id not present', pdf: true do
        expect(get: "/api/buyer/auctions/99999/pdf").to be_routable

        get :pdf, params: {id: 9999}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end


    end

    context 'GET /api/buyer/auctions/:id/pdf entities' do
      before :each do

        rich_templates = [
            {type: 1},
            {type: 2},
        ]


        template_file = Rails.root.join('app', 'assets', 'templates', 'letter_of_award_template.html')
        file_content = nil
        file_content = File.read(template_file) if File.exist?(template_file)
        @rich_template1 = create(:rich_template, type:'1', content:file_content)

        template_file = Rails.root.join('app', 'assets', 'templates', 'letter_of_award_template_nominated_entity.html')
        file_content = nil
        file_content = File.read(template_file) if File.exist?(template_file)
        @rich_template2 = create(:rich_template, type:'2', content:file_content)


        @user1 = create(:user, email:'yangqingxin1@chinasofti.com',encrypted_password:'$2a$11$qSIYYyBxF97DQpxrJv3JtOZ7643w.g/sPsjUJvIjcugDq02Gl61eS',sign_in_count:4,current_sign_in_at:'2018-03-07T07:39:19.749265',last_sign_in_at:'2018-03-07T07:30:13.6502',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.807288',updated_at:'2018-03-07T07:39:19.751447',company_name:'Yang Qingxin Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 02234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
        @user2 = create(:user, email:'will.wang2@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01244',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
        @user3 = create(:user, email:'judy.zhu3@chinasofti.com',encrypted_password:'$2a$11$Ee.qBlHtLx3W4iffIPIYQ.HbkioLZLVG/pfjmrHeO7aCKI267wTfu',sign_in_count:11,current_sign_in_at:'2018-03-09T02:24:13.334563',last_sign_in_at:'2018-03-09T01:56:00.396638',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.662046',updated_at:'2018-03-09T02:24:13.335992',company_name:'Judy Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
        @user5 = create(:user, :with_buyer, email:'user145.wang4@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01235',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')

        @user6 = create(:user, email:'user24.wang7@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01237',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
        @user7 = create(:user, email:'user33.wang8@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01238',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
        sign_in @user5

        ####
        @user_entity1 = create(:company_buyer_entity, company_name:'name1',	company_uen:'uen0001',	company_address:'addr111',	billing_address:'bill addr111',	bill_attention_to:'dsfsd',	contact_name:'ccca',	contact_email:'sfsfs@dsfds.com',	contact_mobile_no:'44444444',	contact_office_no:'44444444',	created_at:'2018-07-19T01:36:13.732276',	updated_at:'2018-07-19T01:36:13.732276',	user:@user5,	is_default:0)
        @user_entity2 = create(:company_buyer_entity, company_name:'name12',	company_uen:'uen0002',	company_address:'addr1112',	billing_address:'bill addr1112',	bill_attention_to:'dsfsd2',	contact_name:'ccca2',	contact_email:'sfsfs2@dsfds.com',	contact_mobile_no:'44444433',	contact_office_no:'44444433',	created_at:'2018-07-19T01:36:13.732276',	updated_at:'2018-07-19T01:36:13.732276',	user:@user5,	is_default:1)

        @user_attachment1 = create(:user_attachment, file_path:'file_path1', file_name: 'file_name1')
        @user_attachment2 = create(:user_attachment, file_path:'file_path2', file_name: 'file_name2')
        @user_attachment3 = create(:user_attachment, file_path:'file_path3', file_name: 'file_name3')

        tc_attach_info = {}
        tc_attach_info[:SELLER_BUYER_TC] = @user_attachment1.id
        tc_attach_info[:SELLER_REVV_TC] = @user_attachment2.id
        tc_attach_info[:BUYER_REVV_TC] = @user_attachment3.id
        @auction_test2 = create(:auction, tc_attach_info:tc_attach_info.to_json, name:'Test20180710',start_datetime:'2018-07-19T02:13:00',contract_period_start_date:'2018-07-25',duration:3,created_at:'2018-07-19T01:44:36.476743',updated_at:'2018-07-19T02:16:27.65381',actual_begin_time:'2018-07-19T02:13:00',actual_end_time:'2018-07-19T02:24:00',total_volume:0,publish_status:1,published_gid:'RA20180046',total_lt_peak:0,total_lt_off_peak:0,total_hts_peak:0,total_hts_off_peak:0,total_htl_peak:0,total_htl_off_peak:0,hold_status:false,time_extension:0,average_price:0,retailer_mode:0,total_eht_peak:0,total_eht_off_peak:0, starting_price_time:1, buyer_type:1, allow_deviation:1)
        @auction2_contract = create(:auction_contract, auction: @auction_test2, contract_duration:12,	contract_period_end_date:'2019-07-24',	total_volume:57600.000000000000000065,	total_lt_peak:420,	total_lt_off_peak:980,	total_hts_peak:640,	total_hts_off_peak:960,	total_htl_peak:1260,	total_htl_off_peak:540,	total_eht_peak:0,	total_eht_off_peak:0,	starting_price_lt_peak:0.7222,	starting_price_lt_off_peak:0.7222,	starting_price_hts_peak:0.7222,	starting_price_hts_off_peak:0.7222,		starting_price_htl_peak:0.7222,		starting_price_htl_off_peak:0.7222,		starting_price_eht_peak:0.7222,		starting_price_eht_off_peak:0.7222,	reserve_price_lt_peak:0.1222,	reserve_price_lt_off_peak:0.1222,	reserve_price_hts_peak:0.1222,	reserve_price_hts_off_peak:0.1222,	reserve_price_htl_peak:0.1222,	reserve_price_htl_off_peak:0.1222,	reserve_price_eht_peak:0.1222,	reserve_price_eht_off_peak:0.1222,	created_at:'2018-07-19T01:44:36.533477',	updated_at:'2018-07-19T02:08:36.801233')
        @auction2_contract2 = create(:auction_contract, auction: @auction_test2, contract_duration:6,	contract_period_end_date:'2019-01-24',	total_volume:34178.6301369863013698,	total_lt_peak:60,	total_lt_off_peak:90,	total_hts_peak:600,	total_hts_off_peak:1400,	total_htl_peak:800,	total_htl_off_peak:1200,	total_eht_peak:900,	total_eht_off_peak:600,	starting_price_lt_peak:0.7666,	starting_price_lt_off_peak:0.7666,	starting_price_hts_peak:0.7666,	starting_price_hts_off_peak:0.7666,		starting_price_htl_peak:0.7666,		starting_price_htl_off_peak:0.7666,		starting_price_eht_peak:0.7666,		starting_price_eht_off_peak:0.7666,	reserve_price_lt_peak:0.6666,	reserve_price_lt_off_peak:0.6666,	reserve_price_hts_peak:0.6666,	reserve_price_hts_off_peak:0.6666,	reserve_price_htl_peak:0.6666,	reserve_price_htl_off_peak:0.6666,	reserve_price_eht_peak:0.6666,	reserve_price_eht_off_peak:0.6666,	created_at:'2018-07-19T01:44:36.525796',	updated_at:'2018-07-19T01:57:05.166021')
        @auction2_result_test = create(:auction_result, contract_period_start_date:'2018-07-25',auction: @auction_test2,created_at:'2018-07-07T07:07:05.951654',updated_at:'2018-07-07T07:07:05.951654')

        create(:auction_result_contract, lowest_average_price:0.119319292035398230089058420523664082282612571,	status:'win',	lowest_price_bidder:'CSI Kathy',	contract_period_end_date:'2019-01-24',	total_volume:34178.6301369863013698,	total_award_sum:4078.1699506849315068610336,	lt_peak:0.1,	lt_off_peak:0.1666,	hts_peak:0.1,	hts_off_peak:0.1166,	htl_peak:0.1,	htl_off_peak:0.1666,	eht_peak:0.1,	eht_off_peak:0.1,	created_at:'2018-07-19T02:25:01.191797',	updated_at:'2018-07-19T02:25:01.191797',	auction_result_id: @auction2_result_test.id,	contract_duration:6,	auction_id:@auction_test2.id,	user_id:@user7.id,	reserve_price_lt_peak:0.6666,	reserve_price_lt_off_peak:0.6666,	reserve_price_hts_peak:0.6666,	reserve_price_hts_off_peak:0.6666,	reserve_price_htl_peak:0.6666,	reserve_price_htl_off_peak:0.6666,	reserve_price_eht_peak:0.6666,	reserve_price_eht_off_peak:0.6666, parent_template_id: @rich_template1.id,  entity_template_id: @rich_template2.id)
        create(:auction_result_contract, lowest_average_price:0.409699999999999999995819609375000000000004717,	status:'win',	lowest_price_bidder:'Judy Electricity',	contract_period_end_date:'2019-07-24',	total_volume:57600.000000000000000065,	total_award_sum:23598.71999999999999978584,	lt_peak:0.2222,	lt_off_peak:0.2222,	hts_peak:0.2222,	hts_off_peak:0.2222,	htl_peak:0.7222,	htl_off_peak:0.7222,	eht_peak:0,	eht_off_peak:0,	created_at:'2018-07-19T02:25:01.191797',	updated_at:'2018-07-19T02:25:01.191797',	auction_result_id: @auction2_result_test.id,	contract_duration:12,	auction_id:@auction_test2.id,	user_id:@user6.id,	reserve_price_lt_peak:0.1222,	reserve_price_lt_off_peak:0.1222,	reserve_price_hts_peak:0.1222,	reserve_price_hts_off_peak:0.1222,	reserve_price_htl_peak:0.1222,	reserve_price_htl_off_peak:0.1222,	reserve_price_eht_peak:0.1222,	reserve_price_eht_off_peak:0.1222, parent_template_id: @rich_template1.id,  entity_template_id: @rich_template2.id)

        @consumption_test2 = create(:consumption, action_status:1,participation_status:1,lt_peak:420,lt_off_peak:980,hts_peak:640,hts_off_peak:960,htl_peak:1260,htl_off_peak:540,user:@user5,auction: @auction_test2,created_at: '2018-07-19T01:44:48.392758' ,updated_at: '2018-07-19T02:00:27.051592' ,eht_peak:0,eht_off_peak:0, contract_duration:6, accept_status:1)
        create(:consumption_detail, company_buyer_entity_id: @user_entity1.id,  account_number:'test1002',intake_level:'HTS',peak:640,off_peak:960,consumption:@consumption_test2,created_at: '2018-07-19T02:00:27.025829' ,updated_at: '2018-07-19T02:00:27.025829' ,premise_address:'address 67 -1', contracted_capacity: 1600,existing_plan:'Retailer plan', contract_expiry:'2018-07-19T00:00:00', blk_or_unit:'11b',street:'stttr', unit_number:'unitnumber', postal_code:'23424', totals:1600, peak_pct:40)
        create(:consumption_detail, company_buyer_entity_id: @user_entity2.id,  account_number:'test10',intake_level:'LT',peak:420,off_peak:980,consumption:@consumption_test2,created_at: '2018-07-19T02:00:27.025829' ,updated_at: '2018-07-19T02:00:27.025829' ,premise_address:'address 67 -11', existing_plan:'SPS tariff', contract_expiry:'2018-07-19T00:00:00', blk_or_unit:'11b',street:'stttr', unit_number:'unitnumber3', postal_code:'23424', totals:1400, peak_pct:30)
        create(:consumption_detail, company_buyer_entity_id: @user_entity2.id,  account_number:'test1003',intake_level:'HTL',peak:420,off_peak:980,consumption:@consumption_test2,created_at: '2018-07-19T02:00:27.025829' ,updated_at: '2018-07-19T02:00:27.025829' ,premise_address:'address 67 -122', contracted_capacity: 1500,existing_plan:'Retailer plan', contract_expiry:'2018-07-19T00:00:00', blk_or_unit:'11b',street:'stttr3', unit_number:'unitnumber2', postal_code:'234241', totals:1800, peak_pct:70)

        @arrangement_test = create(:arrangement, main_name:'test2',main_email_address:'enquiry@bestelectricity.com.sg',main_mobile_number:'12345678',main_office_number:'12346578',alternative_name:'',alternative_email_address:'',alternative_mobile_number:'',alternative_office_number:'',lt_peak:0.1458,lt_off_peak:0.1458,hts_peak:0.1458,hts_off_peak:0.1458,htl_peak:0.1458,htl_off_peak:0.1458,user:@user7,auction: @auction_test,accept_status:1,created_at:'2018-02-07T06:51:30.493463',updated_at:'2018-02-07T06:52:44.25187',action_status:1,eht_peak:0.1458,eht_off_peak:0.1458,comments:'')

        create(:tender_state_machine, previous_node:4,current_node:4,current_status:2,turn_to_role:1,current_role:2,arrangement:@arrangement_test,created_at:'2018-02-07T06:52:09.874848',updated_at:'2018-02-07T06:52:09.874848')

        create(:auction_history, average_price:0.363414159292035398231992046753856997415619454,lt_peak:0.3666,lt_off_peak:0.3666,hts_peak:0.3666,hts_off_peak:0.3666,htl_peak:0.3666,htl_off_peak:0.3666,bid_time:'2018-07-19T02:20:10.812228' ,user:@user3,auction: @auction_test2,created_at: '2018-02-07T06:53:45.656599' ,updated_at: '2018-02-07T06:53:45.66932' ,total_award_sum: '12420.9981369863013699051744' ,ranking:2,is_bidder:false,flag: 'null' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.3666,eht_off_peak:0.3666, contract_duration:6)
        create(:auction_history, average_price:0.119319292035398230089058420523664082282612571,lt_peak:0.1,lt_off_peak:0.1666,hts_peak:0.1,hts_off_peak:0.1166,htl_peak:0.1,htl_off_peak:0.1666,bid_time:'2018-07-19T02:20:10.812228' ,user:@user2,auction: @auction_test2,created_at: '2018-02-07T06:52:44.293282' ,updated_at: '2018-02-07T06:52:44.327446' ,total_award_sum: '4078.1699506849315068610336' ,ranking:1,is_bidder:true,flag: 'null' ,actual_bid_time:'2018-02-07T06:57:00' ,eht_peak:0.1458,eht_off_peak:0.1458, contract_duration:6)

      end
      it 'buyer entity ra report pdf', pdf2: true do
        expect(get: "/api/buyer/auctions/#{@auction_test2.id.to_s}/pdf").to be_routable

        get :pdf, params: {id: @auction_test2.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'buyer entity letter of award report pdf', pdf2: true do
        expect(get: "/api/buyer/auctions/#{@auction_test2.id.to_s}/letter_of_award_pdf").to be_routable

        get :letter_of_award_pdf, params: {id: @auction_test2.id, contract_duration:6, entity_id:@user_entity2.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'buyer letter of award report(Contract) pdf', pdf2: true do
        expect(get: "/api/buyer/auctions/#{@auction_test2.id.to_s}/letter_of_award_pdf").to be_routable
        get :letter_of_award_pdf, params: {id: @auction_test2.id, contract_duration:6, entity_id:@user_entity2.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end
    end
  end
end
