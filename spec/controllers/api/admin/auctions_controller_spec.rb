require 'rails_helper'

RSpec.describe Api::Admin::AuctionsController, type: :controller do
  # let! (:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }
  let! (:retailers) { create_list(:user, 25, :with_retailer) }
  let! (:arrangement_1) { create(:arrangement, user: retailers[0], auction: auction, action_status: '1') }
  let! (:arrangement_2) { create(:arrangement, user: retailers[1], auction: auction, action_status: '1') }
  let! (:arrangement_3) { create(:arrangement, user: retailers[2], auction: auction, action_status: '2') }
  let! (:arrangement_4) { create(:arrangement, user: retailers[4], auction: auction, action_status: '2') }
  let! (:buyer_c_s) { create_list(:user, 25, :with_buyer, :with_company_buyer) }
  let! (:consumption_1) { create(:consumption, user: buyer_c_s[0], auction: auction, action_status: '1') }
  let! (:consumption_2) { create(:consumption, user: buyer_c_s[1], auction: auction, action_status: '2') }
  let! (:consumption_3) { create(:consumption, user: buyer_c_s[2], auction: auction, action_status: '2') }
  let! (:consumption_4) { create(:consumption, user: buyer_c_s[4], auction: auction, action_status: '2') }
  let! (:buyer_i_s) { create_list(:user, 25, :with_buyer, :with_individual_buyer) }
  let! (:consumption_5) { create(:consumption, user: buyer_i_s[0], auction: auction, action_status: '1') }
  let! (:consumption_6) { create(:consumption, user: buyer_i_s[1], auction: auction, action_status: '2') }
  let! (:consumption_7) { create(:consumption, user: buyer_i_s[2], auction: auction, action_status: '2') }
  let! (:consumption_8) { create(:consumption, user: buyer_i_s[4], auction: auction, action_status: '2') }
  let!(:published_upcoming_auction) { create(:auction, :for_next_month, :upcoming, :published) }
  let! (:arrangement_pua) { create(:arrangement, user: retailers[0], auction: published_upcoming_auction, action_status: '1') }
  let!(:r1_his_init) { create(:auction_history, bid_time: Date.current, user: retailers[0], auction: published_upcoming_auction) }
  let!(:published_living_auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:logs) { create_list(:auction_event, 50, auction: auction, user: retailers[0] ,auction_do: 'confirm' ) }
  let!(:tc1) { create(:user_attachment, file_name: 'SELLER_BUYER_TC', file_path: 'test', file_type: 'SELLER_BUYER_TC')}
  let!(:tc2) { create(:user_attachment, file_name: 'SELLER_REVV_TC', file_path: 'test', file_type: 'SELLER_REVV_TC')}
  let!(:tc3) { create(:user_attachment, file_name: 'BUYER_REVV_TC', file_path: 'test', file_type: 'BUYER_REVV_TC')}

  base_url = 'api/admin/auctions'

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }


    describe 'GET filter_date' do
      let!(:six_month_contract) { create(:auction_contract, :six_month, :total, auction: auction ) }
      let! (:buyer_a) { create(:user, :with_buyer, :with_company_buyer ) }
      let! (:buyer_b) { create(:user, :with_buyer, :with_company_buyer ) }
      let! (:entity1) {create(:company_buyer_entity, user: buyer_a, approval_status: '1')}
      let! (:entity2) {create(:company_buyer_entity, user: buyer_a, approval_status: '1')}
      let! (:consumption_a) { create(:consumption, user: buyer_a, auction: auction, action_status: '1', contract_duration: six_month_contract.contract_duration, accept_status: '1') }
      let!(:consumption_lt) { create(:consumption_detail, :for_lt ,account_number: 'ddd' , consumption_id: consumption_a.id, company_buyer_entity_id: entity1.id) }
      let!(:consumption_hts) { create(:consumption_detail, :for_hts ,account_number: 'aaa' , consumption_id: consumption_a.id, company_buyer_entity_id: entity1.id) }
      let!(:consumption_htl) { create(:consumption_detail, :for_htl ,account_number: 'bbb' , consumption_id: consumption_a.id, company_buyer_entity_id: entity2.id) }
      let!(:consumption_eht) { create(:consumption_detail, :for_eht ,account_number: 'ccc' , consumption_id: consumption_a.id, company_buyer_entity_id: entity2.id) }
      let! (:auction2) { create(:auction, :for_next_month, :upcoming) }
      let!(:twelve_month_contract) { create(:auction_contract, :twelve_month, :total, auction: auction2 ) }
      let! (:consumption_a2) { create(:consumption, user: buyer_a, auction: auction2, action_status: '1', contract_duration: twelve_month_contract.contract_duration, accept_status: '1') }
      let!(:consumption_lt2) { create(:consumption_detail, :for_lt ,account_number: 'ddd' , consumption_id: consumption_a2.id, company_buyer_entity_id: entity1.id) }
      let!(:consumption_hts2) { create(:consumption_detail, :for_hts ,account_number: 'aaa' , consumption_id: consumption_a2.id, company_buyer_entity_id: entity1.id) }
      let!(:consumption_htl2) { create(:consumption_detail, :for_htl ,account_number: 'bbb' , consumption_id: consumption_a2.id, company_buyer_entity_id: entity2.id) }
      let!(:consumption_eht2) { create(:consumption_detail, :for_eht ,account_number: 'ccc' , consumption_id: consumption_a2.id, company_buyer_entity_id: entity2.id) }

      context 'got base accounts' do
        def do_request
          get :filter_date, params: { date: '2022-01-01' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['accounts'].size).to eq(4)
          expect(hash_body['account_ids'].include?(consumption_lt.id)).to eq(false)
          expect(hash_body['account_ids'].include?(consumption_lt2.id)).to eq(true)
        end
      end

      context 'got sort accounts' do
        def do_request
          sort_by = ["ra_id", 'asc']
          get :filter_date, params: { date: '2022-01-01', sort_by: sort_by.to_json }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['accounts'].size).to eq(4)
          expect(hash_body['account_ids'].include?(consumption_lt.id)).to eq(false)
          expect(hash_body['account_ids'].include?(consumption_lt2.id)).to eq(true)
        end
      end
    end

    describe 'POST create' do
      let! (:buyer_a) { create(:user, :with_buyer, :with_company_buyer ) }
      context 'Create RA' do
        def do_request
          buyer_ids = [buyer_a.id]
          post :create, params: { date: '2020-01-01' , buyer_ids: buyer_ids.to_json }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Create RA,buyer id is 0' do
        def do_request
          buyer_ids = [buyer_a.id]
          post :create, params: { date: '2020-01-01' , buyer_ids: [].to_json }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Create RA,buyer id >1' do
        def do_request
          buyer_ids = [buyer_a.id, buyer_b.id]
          post :create, params: { date: '2020-01-01' , buyer_ids: buyer_ids.to_json }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
        end
      end

    end


    describe 'GET obtain' do
      context 'Has an empty auction' do
        def do_request
          get :obtain
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to be_nil
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Has an auction' do
        def do_request
          get :obtain, params: { id: auction.id }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction.id)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Has an auction' do
        def do_request
          get :obtain, params: { id: auction.id }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction.id)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'PUT publish' do

      def do_request
        put :publish, params: { id: auction.id, publish_status: '1' }
      end
      context 'has published an auction' do
        before { do_request }
        it 'success' do
          expect(auction.publish_status).to eq('0')
          hash_body = JSON.parse(response.body)
          expect(hash_body['published_gid']).to eq("RA#{Time.current.year}" + '0003')
          expect(hash_body['publish_status']).to eq('1')
          expect(response).to have_http_status(:ok)
        end
      end


      context 'has published an auction and datetime is nil and published' do
        before {
          auction.published_date_time = nil
          auction.publish_status = Auction::PublishStatusPublished
          auction.save
          do_request
        }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has published an auction and hans published gid' do
        before {
          auction.published_gid = 'RAabcd0001'
          auction.save
          do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['publish_status']).to eq('1')
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'DELETE destroy' do
      context 'Has deleted an auction' do
        def do_request
          delete :destroy, params: { id: auction.id }
        end

        before { do_request }
        it 'success' do
          expect(response.body).to eq('null')
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Has not delete an auction' do
        def do_request
          delete :destroy, params: { id: published_upcoming_auction.id }
        end

        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['message']).to include('not delete it')
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'PUT hold' do
      def do_request_hold
        put :hold, params: { id: auction.id, hold_status: true }
      end

      def do_request_un_hold
        put :hold, params: { id: auction.id, hold_status: false }
      end

      context 'has to hold an auction' do
        before { do_request_hold }
        it 'success' do
          expect(auction.hold_status).to eq(false)
          hash_body = JSON.parse(response.body)
          expect(hash_body['hold_status']).to eq(true)
          expect(hash_body['forward']).to eq(false)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has to stop hold an auction when current time less than actual_begin_time' do
        let (:auction) { create(:auction, :for_next_month, :upcoming, :published) }
        before { do_request_un_hold }
        it 'success' do
          expect(auction.hold_status).to eq(false)
          hash_body = JSON.parse(response.body)
          expect(hash_body['hold_status']).to eq(false)
          expect(hash_body['forward']).to eq(false)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has to stop hold an auction when current time more than actual_begin_time' do
        let (:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
        before { do_request_un_hold }
        it 'success' do
          expect(auction.hold_status).to eq(false)
          hash_body = JSON.parse(response.body)
          expect(hash_body['hold_status']).to eq(false)
          expect(hash_body['forward']).to eq(true)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'POST confirm' do
      current_time = Time.current
      bid_time = Time.current + 10
      let! (:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
      let!(:retailer1) { create(:user, :with_retailer) }
      let!(:retailer2) { create(:user, :with_retailer) }
      let!(:retailer3) { create(:user, :with_retailer) }
      let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time: current_time) }
      let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time: current_time) }
      let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time: current_time) }
      let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time: bid_time) }
      let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time: current_time) }
      let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time: current_time) }

      def do_request_void
        post :confirm, params: { id: auction.id, user_id: retailer1, status: 'void' }
      end

      def do_request_winner
        post :confirm, params: { id: auction.id, user_id: retailer1, status: 'win' }
      end

      context 'confirm void' do
        before { do_request_void }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq('void')
          expect(response).to have_http_status(:ok)
        end
      end

      context 'confirm winner' do
        before { do_request_winner }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq('win')
          expect(hash_body['lowest_average_price'].to_s).to eq(r1_his_bid.average_price.to_s)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'POST new confirm' do
      current_time = Time.current
      bid_time = Time.current + 10
      let! (:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
      let!(:six_month_contract) { create(:auction_contract, :six_month, :total, auction: auction ) }
      let!(:retailer1) { create(:user, :with_retailer) }
      let!(:retailer2) { create(:user, :with_retailer) }
      let!(:retailer3) { create(:user, :with_retailer) }
      let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time: current_time, contract_duration: '6') }
      let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time: current_time, contract_duration: '6') }
      let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time: current_time, contract_duration: '6') }
      let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time: bid_time, contract_duration: '6') }
      let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time: current_time, contract_duration: '6') }
      let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time: current_time, contract_duration: '6') }

      def do_request_void
        post :confirm, params: { id: auction.id, user_id: retailer1, status: 'void', contract_duration: '6'  }
      end

      def do_request_winner
        post :confirm, params: { id: auction.id, user_id: retailer1, status: 'win', contract_duration: '6' }
      end

      context 'confirm void' do
        before { do_request_void }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq('void')
          expect(response).to have_http_status(:ok)
        end
      end

      context 'confirm winner' do
        before { do_request_winner }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq('win')
          expect(hash_body['lowest_average_price'].to_s).to eq(r1_his_bid.average_price.to_s)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'PUT update' do
      def do_request(id, auction)
        auction_object = {
          name: 'Hello world',
          start_datetime: auction.start_datetime,
          contract_period_start_date: auction.contract_period_start_date,
          contract_period_end_date: auction.contract_period_end_date,
          duration: auction.duration,
          reserve_price: auction.reserve_price,
          actual_begin_time: auction.actual_begin_time,
          actual_end_time: auction.actual_end_time,
          total_volume: auction.total_volume,
          publish_status: auction.publish_status,
          hold_status: auction.hold_status,
          time_extension: '1',
          average_price: '2',
          retailer_mode: '3',
          starting_price: '0.1666'
        }
        put :update, params: { id: id, auction: auction_object }
      end

      context 'Has create an auction' do
        before { do_request(0, auction) }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).not_to eq(auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(response).to have_http_status(201)
        end
      end

      context 'has updated an auction' do
        before { do_request(auction.id, auction) }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has updated an auction, has retailers' do


        before { do_request(published_upcoming_auction.id, published_upcoming_auction) }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(published_upcoming_auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(response).to have_http_status(:ok)
          histories = RedisHelper.get_current_sorted_histories(published_upcoming_auction.id)
          expect(histories[0][:id]).to eq(r1_his_init.id)

        end
      end
    end

    describe 'PUT new update' do
      def do_request(id, auction)
        put :update, params: { id: id, auction: auction }
      end

      context 'Has create an auction' do
        before do
          common_contract = {
              starting_price_lt_peak: 0.1888,
              starting_price_lt_off_peak: 0.1888,
              starting_price_hts_peak: 0.1888,
              starting_price_hts_off_peak: 0.1888,
              starting_price_htl_peak: 0.1888,
              starting_price_htl_off_peak: 0.1888,
              starting_price_eht_peak: 0.1888,
              starting_price_eht_off_peak: 0.1888,
              reserve_price_lt_peak: 0.0988,
              reserve_price_lt_off_peak: 0.0988,
              reserve_price_hts_peak: 0.0988,
              reserve_price_hts_off_peak: 0.0988,
              reserve_price_htl_peak: 0.0988,
              reserve_price_htl_off_peak: 0.0988,
              reserve_price_eht_peak: 0.0988,
              reserve_price_eht_off_peak: 0.0988}
          contract_6 = common_contract
          contract_6[:contract_duration] = '6'
          contract_12 = common_contract
          contract_12[:contract_duration] = '12'
          contract_24 = common_contract
          contract_24[:contract_duration] = '24'
          contracts = [contract_6 , contract_12, contract_24]
          auction_object = {
              name: 'Hello world',
              start_datetime: auction.start_datetime,
              contract_period_start_date: auction.contract_period_start_date,
              duration: auction.duration,
              actual_begin_time: auction.actual_begin_time,
              actual_end_time: auction.actual_end_time,
              publish_status: auction.publish_status,
              hold_status: auction.hold_status,
              time_extension: '0',
              average_price: '2',
              retailer_mode: '3',
              starting_price_time: 2,
              buyer_type: '0',
              allow_deviation: '1',
              auction_contracts: contracts.to_json
          }


          do_request(0, auction_object)
        end
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).not_to eq(auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(hash_body['auction_contracts'].count).to eq(3)
          expect(response).to have_http_status(201)
        end
      end

      context 'has updated an auction' do
        let! (:auction_new) { create(:auction, :for_next_month, :upcoming) }
        let!(:six_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '6', contract_period_end_date: DateTime.current) }
        let!(:twelve_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '12', contract_period_end_date: DateTime.current) }
        let!(:twenty_four_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '24', contract_period_end_date: DateTime.current) }
        before do
          contract_6 = six_month_contract
          contracts = [contract_6]
          auction_object = {
              id: auction_new.id,
              name: 'Hello world',
              start_datetime: auction_new.start_datetime,
              contract_period_start_date: auction_new.contract_period_start_date,
              duration: auction_new.duration,
              actual_begin_time: auction_new.actual_begin_time,
              actual_end_time: auction_new.actual_end_time,
              publish_status: auction_new.publish_status,
              hold_status: auction_new.hold_status,
              time_extension: '0',
              average_price: '2',
              retailer_mode: '3',
              starting_price_time: 2,
              buyer_type: '0',
              allow_deviation: '1',
              auction_contracts: contracts.to_json
          }
          do_request(auction_new.id, auction_object)
        end

        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction_new.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(hash_body['auction_contracts'].count).to eq(1)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has updated same data an auction' do
        let! (:auction_new) { create(:auction, :for_next_month, :upcoming) }
        let!(:six_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '6', contract_period_end_date: DateTime.current) }
        let!(:twelve_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '12', contract_period_end_date: DateTime.current) }
        let!(:twenty_four_month_contract) { create(:auction_contract, auction: auction_new, contract_duration: '24', contract_period_end_date: DateTime.current) }
        before do

          contracts = [six_month_contract, twelve_month_contract, twenty_four_month_contract]
          auction_object = auction_new.attributes.dup
          auction_object[:auction_contracts] = contracts.to_json
          do_request(auction_new.id, auction_object)
        end

        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction_new.id)
          expect(hash_body['name']).to eq(auction_new.name)
          expect(hash_body['auction_contracts'].count).to eq(3)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'has updated an auction, has retailers' do
        let!(:published_upcoming_auction_new) { create(:auction, :for_next_month, :upcoming, :published) }
        let! (:arrangement_pua_new) { create(:arrangement, user: retailers[0], auction: published_upcoming_auction_new, action_status: '1') }
        let!(:r1_his_init_1) { create(:auction_history, bid_time: Date.current, user: retailers[0], auction: published_upcoming_auction_new, contract_duration: '6') }
        let!(:r1_his_init_2) { create(:auction_history, bid_time: Date.current, user: retailers[0], auction: published_upcoming_auction_new, contract_duration: '12') }
        let!(:r1_his_init_3) { create(:auction_history, bid_time: Date.current, user: retailers[0], auction: published_upcoming_auction_new, contract_duration: '24') }
        let!(:six_month_contract) { create(:auction_contract, :six_month, :total, auction: published_upcoming_auction_new ) }
        let!(:twelve_month_contract) { create(:auction_contract, :twelve_month, :total, auction: published_upcoming_auction_new ) }
        let!(:twenty_four_month_contract) { create(:auction_contract, :twenty_four_month, :total, auction: published_upcoming_auction_new) }
        before do
          contracts = [six_month_contract, twelve_month_contract, twenty_four_month_contract]
          published_upcoming_auction = published_upcoming_auction_new.attributes.dup
          published_upcoming_auction[:auction_contracts] = contracts.to_json
          do_request(published_upcoming_auction_new.id, published_upcoming_auction)
        end
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(published_upcoming_auction_new.id)
          expect(hash_body['name']).to eq(published_upcoming_auction_new.name)
          expect(response).to have_http_status(:ok)

          histories_j6 = RedisHelper.get_current_sorted_histories_duration(published_upcoming_auction_new.id, 6)
          expect(histories_j6[0][:id]).to eq(r1_his_init_1.id)
          histories_j12 = RedisHelper.get_current_sorted_histories_duration(published_upcoming_auction_new.id, 12)
          expect(histories_j12[0][:id]).to eq(r1_his_init_2.id)
          histories_j24 = RedisHelper.get_current_sorted_histories_duration(published_upcoming_auction_new.id, 24)
          expect(histories_j24[0][:id]).to eq(r1_his_init_3.id)

        end
      end
    end

    describe 'GET unpublished auction list' do
      context 'Pager unpublished an auction' do
        def do_request
          get :unpublished, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(2)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end

      context 'Params pagers unpublished auction' do
        def do_request
          get :unpublished, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(2)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end

      context 'Params pagers unpublished auction and sort' do
        def do_request
          get :unpublished, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1', sort_by: ['name', 'asc', ''] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(2)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end

      context 'Params pagers unpublished auction and sort include table name' do
        def do_request
          get :unpublished, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1', sort_by: ['name' , 'asc', 'auctions'] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(2)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end

    end

    describe 'GET published auction list' do
      context 'Pager published auction' do
        def do_request
          get :published, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
        end
      end

      context 'Params pagers published auction' do
        def do_request
          get :published, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end

      context 'Params pagers published auction and sort' do
        def do_request
          get :published, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1', sort_by: ['name' , 'asc', ''] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
          expect(hash['bodies']['data'][0]['name']).to eq(auction.name)
        end
      end
    end

    describe 'GET retailers of selected auction' do


      context 'Pager got user list' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(25)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got selected user list' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['1', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(4)
          expect(hash['bodies']['data'].size).to eq(4)
        end
      end

      context 'Pager got un-selected user list' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['0', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(21)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got notification sent user list' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['3', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
        end
      end

      context 'Pager got pending notification user list and sort' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['2', '='], page_size: '10', page_index: '1', sort_by: ['company_name' , 'asc', ''] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
        end
      end


      context 'Pager got pending notification user list' do
        def do_request
          get :retailers, params: { id: auction.id, status: ['2', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(2)
          expect(hash['bodies']['data'].size).to eq(2)
        end
      end
    end

    describe 'GET buyer of selected auction' do

      context 'Pager got company buyer user list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(25)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got individual buyer user list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(25)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got company buyer user list and sort' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['', '='], page_size: '10', page_index: '1', sort_by: ['company_name' , 'asc', ''] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(25)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got individual buyer user list and sort' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['', '='], page_size: '10', page_index: '1', sort_by: ['name' , 'asc', 'users'] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(25)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got selected company buyer list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['1', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(4)
          expect(hash['bodies']['data'].size).to eq(4)
        end
      end

      context 'Pager got selected individual list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['1', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(4)
          expect(hash['bodies']['data'].size).to eq(4)
        end
      end

      context 'Pager got not selected company list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['0', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(21)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got not selected individual list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['0', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(21)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Pager got notification sent selected company list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['3', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end

      context 'Pager got notification sent individual company list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['3', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(1)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end

      context 'Pager got pending notification selected company list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['2', '='], status: ['2', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(3)
          expect(hash['bodies']['total']).to eq(3)
          expect(hash['bodies']['data'].size).to eq(3)
        end
      end

      context 'Pager got pending notification selected individual list' do
        def do_request
          get :buyers, params: { id: auction.id, consumer_type: ['3', '='], status: ['2', '='], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(3)
          expect(hash['bodies']['data'].size).to eq(3)
        end
      end

    end

    describe 'GET count of selected users' do


      context 'got count object' do
        def do_request
          get :selects, params: { id: auction.id}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['retailers']['1']).to eq(2)
          expect(hash['company_buyers']['2']).to eq(3)
          expect(hash['individual_buyers']['2']).to eq(3)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'PUT send email' do

      context 'Send email for retailer' do
        def do_request
          put :send_mails, params: { id: auction.id, role_name: 'retailer'}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          arrangement = Arrangement.find(arrangement_1.id)
          expect(arrangement.action_status).to eq('1')
          expect(response).to have_http_status(:ok)
        end
      end

      context 'Send email for buyer' do

        def do_request
          put :send_mails, params: { id: auction.id, role_name: 'buyer'}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          consumption = Consumption.find(consumption_1.id)
          expect(consumption.action_status).to eq('1')
          expect(response).to have_http_status(:ok)
        end
      end


    end

    describe 'GET retailer_dashbaord' do
      let!(:auction_tender) { create(:auction, :for_next_month, :upcoming, :published) }
      let!(:retailer_user){ create(:user, :with_retailer) }
      let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction_tender) }
      let!(:tender) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 1) }
      let!(:retailer_user1){ create(:user, :with_retailer) }
      let!(:arrangement1) { create(:arrangement, user: retailer_user1, auction: auction_tender) }
      let!(:tender2) { create(:tender_state_machine, arrangement: arrangement1, previous_node: 1, current_node: 1) }


      context 'Got tenders of auction' do
        def do_request
          get :retailer_dashboard, params: { id: auction_tender.id}
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['tenders'][0]['detail']['flows'].to_s).to eq('[1]')
          expect(hash['tenders'][1]['detail']['flows'].to_s).to eq('[1]')
          expect(hash['step_counts'].to_s).to eq('[2, 2, 0, 0, 0, 0, 0]')
        end
      end
    end

    describe 'GET buyer_dashbaord' do

      context 'Got buyers of auction' do

        def do_request
          get :buyer_dashboard, params: { id: auction.id, consumer_type: '2'}
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash['count_company']).to eq(4)
        end
      end
    end

    describe 'GET log' do

      context 'Base Search' do
        def do_request
          get :log, params: { id: auction.id}
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(50)
          expect(hash['bodies']['data'].size).to eq(50)
        end
      end

      context 'Pager Search' do
        def do_request
          get :log, params: {id: auction.id, page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(50)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end

      context 'Conditions Pager Search' do
        def do_request
          get :log, params: {id: auction.id, company_name: [retailers[0].company_name, 'like', 'users'], page_size: '10', page_index: '1' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(50)
          expect(hash['bodies']['data'].size).to eq(10)
        end
      end
    end

    describe 'GET new log' do
      let!(:logs) { create_list(:auction_event, 3, auction: auction, user: retailers[0] ,auction_do: 'update' ) }
      let!(:logs_bid_6) { create_list(:auction_event, 10, auction: auction, user: retailers[0] ,auction_do: 'set bid 6 months' ) }
      let!(:logs_bid) { create_list(:auction_event, 10, auction: auction, user: retailers[0] ,auction_do: 'set bid' ) }

      context 'Conditions Pager Search' do
        def do_request
          get :log, params: {id: auction.id, company_name: [retailers[0].company_name, 'like', 'users'], page_size: '20', page_index: '1', contract_duration: '6' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(4)
          expect(hash['bodies']['total']).to eq(13)
          expect(hash['bodies']['data'].size).to eq(13)
        end
      end
    end

    describe 'PUT check buyer_type' do
      def do_request(buyer_type)
        put :check_buyer_type, params: { id: auction.id, buyer_type: buyer_type }
      end

      context 'has buyer' do
        before { do_request('0') }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['count']).to eq(4)

        end
      end

      context 'not has buyer' do
        before { do_request('1') }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['count']).to eq(0)

        end
      end
    end

    describe 'PUT delete selected buyer' do
      def do_request(buyer_type)
        put :delete_selected_buyer, params: { id: auction.id, buyer_type: buyer_type }
      end

      context 'has buyer will delete' do
        before { do_request('0') }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq('1')
        end
      end

      context 'not has buyer be deleted' do
        before { do_request('1') }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['status']).to eq(nil)

        end
      end
    end
  end

  context 'retailer user' do
    before { sign_in create(:user, :with_retailer) }

    describe '401 Unauthorized' do
      context 'GET obtain' do
        it 'success' do
          get :obtain
          expect(response).to have_http_status(401)
        end
      end
      context '#publish' do
        it 'success' do
          put :publish, params: { id: auction.id }
          expect(response).to have_http_status(401)
        end
      end
      context '#hold' do
        it 'success' do
          put :hold, params: { id: auction.id }
          expect(response).to have_http_status(401)
        end
      end
      context '#confirm' do
        it 'success' do
          post :confirm, params: { id: auction.id }
          expect(response).to have_http_status(401)
        end
      end
      context '#confirm' do
        it 'success' do
          put :update, params: { id: auction.id }
          expect(response).to have_http_status(401)
        end
      end
      context '#delete' do
        it 'success' do
          delete :destroy, params: { id: auction.id }
          expect(response).to have_http_status(401)
        end
      end
    end
  end

  context 'api/admin/auctions routes' do
    describe 'GET timer' do
      it 'success' do
        expect(get: "/#{base_url}/#{auction.id}/timer").not_to be_routable
      end
    end

    describe 'GET obtain' do
      it 'success' do
        expect(get: "/#{base_url}/obtain").to be_routable
        expect(get: "/#{base_url}/obtain").to route_to(controller: base_url.to_s,
                                                       action: 'obtain')
      end
    end

    describe 'PUT publish' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/publish").to be_routable
        expect(put: "/#{base_url}/#{auction.id}/publish").to route_to(controller: base_url.to_s,
                                                                      action: 'publish',
                                                                      id: auction.id.to_s)
      end
    end

    describe 'PUT hold' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/hold").to be_routable
        expect(put: "/#{base_url}/#{auction.id}/hold").to route_to(controller: base_url.to_s,
                                                                   action: 'hold',
                                                                   id: auction.id.to_s)
      end
    end

    describe 'POST confirm' do
      it 'success' do
        expect(post: "/#{base_url}/#{auction.id}/confirm").to be_routable
        expect(post: "/#{base_url}/#{auction.id}/confirm").to route_to(controller: base_url.to_s,
                                                                       action: 'confirm',
                                                                       id: auction.id.to_s)
      end
    end

    describe 'PUT/PATCH update' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}").to be_routable
        expect(patch: "/#{base_url}/#{auction.id}").to be_routable
        expect(put: "/#{base_url}/#{auction.id}").to route_to(controller: base_url.to_s,
                                                              action: 'update',
                                                              id: auction.id.to_s)
        expect(patch: "/#{base_url}/#{auction.id}").to route_to(controller: base_url.to_s,
                                                                action: 'update',
                                                                id: auction.id.to_s)
      end
    end
  end

  describe 'GET pdf' do
    before :each do
      sign_in create(:user, :with_admin)

      @auction_test = create(:auction, name:'Test0207001',start_datetime:'2018-02-07T06:57:00',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',duration:10,reserve_price:0.1222,created_at:'2018-02-07T06:49:44.531577',updated_at:'2018-02-07T06:55:27.423286',actual_begin_time:'2018-02-07T06:57:00',actual_end_time:'2018-02-07T07:07:00',total_volume:39452.05479452054794521,publish_status:1,published_gid:'RA20180009',total_lt_peak:10000.0,total_lt_off_peak:10000.0,total_hts_peak:10000.0,total_hts_off_peak:10000.0,total_htl_peak:10000.0,total_htl_off_peak:10000.0,hold_status:false,time_extension:0,average_price:0,retailer_mode:0,total_eht_peak:10000.0,total_eht_off_peak:10000.0)

      @user1 = create(:user, email:'yangqingxin@chinasofti.com',encrypted_password:'$2a$11$qSIYYyBxF97DQpxrJv3JtOZ7643w.g/sPsjUJvIjcugDq02Gl61eS',sign_in_count:4,current_sign_in_at:'2018-03-07T07:39:19.749265',last_sign_in_at:'2018-03-07T07:30:13.6502',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.807288',updated_at:'2018-03-07T07:39:19.751447',company_name:'Yang Qingxin Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 02234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user2 = create(:user, email:'will.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01244',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user3 = create(:user, email:'judy.zhu@chinasofti.com',encrypted_password:'$2a$11$Ee.qBlHtLx3W4iffIPIYQ.HbkioLZLVG/pfjmrHeO7aCKI267wTfu',sign_in_count:11,current_sign_in_at:'2018-03-09T02:24:13.334563',last_sign_in_at:'2018-03-09T01:56:00.396638',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.662046',updated_at:'2018-03-09T02:24:13.335992',company_name:'Judy Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01234',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user4 = create(:user, email:'user14.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01235',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user5 = create(:user, email:'user23.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01236',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user6 = create(:user, email:'user24.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01237',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')
      @user7 = create(:user, email:'user33.wang@chinasofti.com',encrypted_password:'$2a$11$nibCPeRYZ/ujqpnfJ6Dmc.Q.8kQi/IzJ6dcbJeaQxNGXz34eFg.HC',sign_in_count:4,current_sign_in_at:'2018-02-07T06:55:49.657515',last_sign_in_at:'2018-02-07T06:53:01.014156',current_sign_in_ip:'127.0.0.1',last_sign_in_ip:'127.0.0.1',created_at:'2018-01-23T06:45:52.22272',updated_at:'2018-02-07T06:55:49.658783',company_name:'Will Electricity',approval_status:1,company_address:'China DL',company_unique_entity_number:'UEN 01238',company_license_number:'LICENSE 01234',account_mobile_number:'12345678',account_office_number:'87654321')

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

    context 'GET letter of award pdf' do
      it 'admin letter of award pdf', pdf: true do
        create(:user, :with_admin)
        expect(get: "/api/admin/auctions/letter_of_award_pdf?auction_id=#{@auction_test.id.to_s}&user_id=#{@user4.id}").to be_routable

        get :letter_of_award_pdf, params: {auction_id: @auction_test.id, user_id: @user4.id}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end
    end

    context 'GET RA report pdf' do
      it 'admin RA report pdf', pdf: true do
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2000-02-07T08:57:00.000Z',
                           start_time2: '2000-02-07T08:57:00.000Z',
                           end_time: '2018-02-07T10:57:15.999Z',
                           end_time2: '2018-02-07T10:57:15.999Z',
                           start_price:'0.0012',
                           end_price:'0.4325',
                           uid: @user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf time le 3500', pdf: true do
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2018-02-07T06:57:00Z',
                           start_time2: '2018-02-07T06:57:00Z',
                           end_time: '2018-02-07T06:59:15Z',
                           end_time2: '2018-02-07T06:59:15Z',
                           start_price:'0.0000',
                           end_price:'0.1458',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf x-axis', pdf: true do
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2018-02-07T06:57:00Z',
                           start_time2: '2018-02-07T06:57:00Z',
                           end_time: '2018-02-07T06:57:54Z',
                           end_time2: '2018-02-07T06:59:15Z',
                           start_price:'0.0000',
                           end_price:'0.1458',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf y-axis', pdf: true do
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2018-02-07T06:57:00Z',
                           start_time2: '2018-02-07T06:57:00Z',
                           end_time: '2018-02-07T06:57:54Z',
                           end_time2: '2018-02-07T06:59:15Z',
                           start_price:'0.0000',
                           end_price:'6.0000',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf chart color', pdf: true do
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf?start_time=2018-02-07T06:57:00.000Z&end_time=2018-02-07T06:59:15.728Z&start_time2=2018-02-07T06:57:00.000Z&end_time2=2018-02-07T06:59:15.728Z&start_price=0.0000&end_price=0.1458&uid=5,2,6&uid2=5,2,6&color=22ad38,ffff00,f53d0b&color2=22ad38,ffff00,f53d0b").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2000-02-07T08:57:00.000Z',
                           start_time2: '2000-02-07T08:57:00.000Z',
                           end_time: '2018-02-07T10:57:15.999Z',
                           end_time2: '2018-02-07T10:57:15.999Z',
                           start_price:'0.0012',
                           end_price:'0.4325',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           color:'22ad38,ffff00,f53d0b',
                           color2:'22ad38,ffff00,f53d0b'}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf Auction result status is null', pdf: true do
        result_id = @auction_result_test.id
        AuctionResult.where(id: result_id).delete_all
        @auction_result_test = create(:auction_result,  :status_nil, id: result_id, reserve_price:0.1222,lowest_average_price:0.099900000000000000000075965624999999999999991,lowest_price_bidder:'Judy Electricity',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',total_volume:39452.05479452054794521,total_award_sum:3941.260273972602739729476,lt_peak:0.0999,lt_off_peak:0.0999,hts_peak:0.0999,hts_off_peak:0.0999,htl_peak:0.0999,htl_off_peak:0.0999,user:@user3,auction: @auction_test,created_at:'2018-02-07T07:07:05.951654',updated_at:'2018-02-07T07:07:05.951654',eht_peak:0.0999,eht_off_peak:0.0999)
        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2000-02-07T08:57:00.000Z',
                           start_time2: '2000-02-07T08:57:00.000Z',
                           end_time: '2018-02-07T10:57:15.999Z',
                           end_time2: '2018-02-07T10:57:15.999Z',
                           start_price:'0.0012',
                           end_price:'0.4325',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf result status is not "win"', pdf: true do
        result_id = @auction_result_test.id
        AuctionResult.where(id: result_id).delete_all
        @auction_result_test = create(:auction_result,  status: 'Awarded', id: result_id, reserve_price:0.1222,lowest_average_price:0.099900000000000000000075965624999999999999991,lowest_price_bidder:'Judy Electricity',contract_period_start_date:'2018-02-09',contract_period_end_date:'2018-02-23',total_volume:39452.05479452054794521,total_award_sum:3941.260273972602739729476,lt_peak:0.0999,lt_off_peak:0.0999,hts_peak:0.0999,hts_off_peak:0.0999,htl_peak:0.0999,htl_off_peak:0.0999,user:@user3,auction: @auction_test,created_at:'2018-02-07T07:07:05.951654',updated_at:'2018-02-07T07:07:05.951654',eht_peak:0.0999,eht_off_peak:0.0999)

        expect(get: "/api/admin/auctions/#{@auction_test.id.to_s}/pdf").to be_routable
        get :pdf, params: {id: @auction_test.id,
                           start_time: '2000-02-07T08:57:00.000Z',
                           start_time2: '2000-02-07T08:57:00.000Z',
                           end_time: '2018-02-07T10:57:15.999Z',
                           end_time2: '2018-02-07T10:57:15.999Z',
                           start_price:'0.0012',
                           end_price:'0.4325',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end

      it 'admin RA report pdf auction id not present ' , pdf: true do

        get :pdf, params: {id: 99999,
                           start_time: '2000-02-07T08:57:00.000Z',
                           start_time2: '2000-02-07T08:57:00.000Z',
                           end_time: '2018-02-07T08:57:15.999Z',
                           end_time2: '2018-02-07T08:57:15.999Z',
                           start_price:'0.0012',
                           end_price:'0.4325',
                           uid:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s,
                           uid2:@user1.id.to_s + ',' + @user2.id.to_s + ',' + @user3.id.to_s}
        expect(response.headers['Content-Type']).to have_content 'application/pdf'
      end
    end
  end
end
