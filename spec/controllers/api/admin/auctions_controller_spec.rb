require 'rails_helper'

RSpec.describe Api::Admin::AuctionsController, type: :controller do
  # let! (:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }

  let!(:published_upcoming_auction) { create(:auction, :for_next_month, :upcoming, :published) }
  let!(:published_living_auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  base_url = 'api/admin/auctions'

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'GET obtain' do
      context 'has an auction' do
        def do_request
          get :obtain
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
          expect(hash_body['publish_status']).to eq('1')
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
      let!(:r1_his_init) { create(:auction_history, bid_time: current_time, user: retailer1, auction: auction, actual_bid_time:current_time) }
      let!(:r2_his_init) { create(:auction_history, bid_time: current_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
      let!(:r3_his_init) { create(:auction_history, bid_time: current_time, user: retailer3, auction: auction, actual_bid_time:current_time) }
      let!(:r1_his_bid) { create(:auction_history, :set_bid, bid_time: bid_time, user: retailer1, auction: auction, actual_bid_time:bid_time) }
      let!(:r2_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer2, auction: auction, actual_bid_time:current_time) }
      let!(:r3_his_bid) { create(:auction_history, :not_bid, bid_time: bid_time, user: retailer3, auction: auction, actual_bid_time:current_time) }

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
      def do_request
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
            published_gid: auction.published_gid,
            total_lt_peak: auction.total_lt_peak,
            total_lt_off_peak: auction.total_lt_off_peak,
            total_hts_peak: auction.total_hts_peak,
            total_hts_off_peak: auction.total_hts_off_peak,
            total_htl_peak: auction.total_htl_peak,
            total_htl_off_peak: auction.total_htl_off_peak,
            hold_status: auction.hold_status

        }
        put :update, params: { id: auction.id, auction: auction_object }
      end
      context 'has updated an auction' do

        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body['name']).to eq('Hello world')
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
          get :unpublished, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between'], page_size: '10', page_index: '1' }
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
          get :published, params: { name: [auction.name, 'like'], actual_begin_time: [Time.current.strftime("%Y-%m-%d"), 'date_between'], page_size: '10', page_index: '1' }
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
          put :update, params: { id: auction.id}
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
        expect(get: "/#{base_url}/obtain").to route_to(controller: "#{base_url}",
                                                        action: "obtain")
      end
    end

    describe 'PUT publish' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/publish").to be_routable
        expect(put: "/#{base_url}/#{auction.id}/publish").to route_to(controller: "#{base_url}",
                                                                       action: "publish",
                                                                       id: auction.id.to_s)
      end
    end

    describe 'PUT hold' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}/hold").to be_routable
        expect(put: "/#{base_url}/#{auction.id}/hold").to route_to(controller: "#{base_url}",
                                                                     action: "hold",
                                                                     id: auction.id.to_s)
      end
    end

    describe 'POST confirm' do
      it 'success' do
        expect(post: "/#{base_url}/#{auction.id}/confirm").to be_routable
        expect(post: "/#{base_url}/#{auction.id}/confirm").to route_to(controller: "#{base_url}",
                                                                  action: "confirm",
                                                                  id: auction.id.to_s)
      end
    end

    describe 'PUT/PATCH update' do
      it 'success' do
        expect(put: "/#{base_url}/#{auction.id}").to be_routable
        expect(patch: "/#{base_url}/#{auction.id}").to be_routable
        expect(put: "/#{base_url}/#{auction.id}").to route_to(controller: "#{base_url}",
                                                                      action: "update",
                                                                      id: auction.id.to_s)
        expect(patch: "/#{base_url}/#{auction.id}").to route_to(controller: "#{base_url}",
                                                              action: "update",
                                                              id: auction.id.to_s)
      end
    end
  end

end
