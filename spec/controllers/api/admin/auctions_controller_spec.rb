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
  let!(:published_living_auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:logs) { create_list(:auction_event, 50, auction: auction, user: retailers[0]) }

  base_url = 'api/admin/auctions'

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

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

    describe 'PUT update' do
      def do_request(id)
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
          retailer_mode: '3'
        }
        put :update, params: { id: id, auction: auction_object }
      end

      context 'Has create an auction' do
        before { do_request(0) }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).not_to eq(auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(response).to have_http_status(201)
        end
      end

      context 'has updated an auction' do
        before { do_request(auction.id) }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['id']).to eq(auction.id)
          expect(hash_body['name']).to eq('Hello world')
          expect(hash_body['average_price']).to eq('2')
          expect(response).to have_http_status(:ok)
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
          # hash['bodies']['data'].each do |auction|
          #   if auction.publish_status == '0'
          # end
          # expect(hash['bodies']['data']).to eq(auction.name)
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
          hash = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash[0]['detail']['flows'].to_s).to eq('[1]')
          expect(hash[1]['detail']['flows'].to_s).to eq('[1]')
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

    describe 'GET buyer_dashbaord' do

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
end
