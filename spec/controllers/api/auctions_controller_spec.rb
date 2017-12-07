require 'rails_helper'

RSpec.describe Api::AuctionsController, type: :controller do

  let! (:auction) { create(:auction, :for_next_month, :upcoming) }

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'GET timer' do
      it 'success' do
        get :timer, params: { id: auction.id }
        expect(response).to have_http_status(:ok)
        hash_timer = JSON.parse(response.body)
        expect(Time.parse(hash_timer['actual_begin_time']).ctime).to eq(auction.actual_begin_time.ctime)
        expect(Time.parse(hash_timer['actual_end_time']).ctime).to eq(auction.actual_end_time.ctime)
        expect(Time.parse(hash_timer['current_time']).ctime).to_not be_nil
      end
    end

  end

  context 'api/auctions routes' do
    describe 'GET timer' do
      it 'success' do
        expect(get: "/api/auctions/#{auction.id}/timer").to be_routable
        expect(get: "/api/auctions/#{auction.id}/timer").to route_to(
                                                        controller: "api/auctions",
                                                        action: "timer",
                                                        id: auction.id.to_s )
      end
    end

    describe 'GET obtain' do
      it 'success' do
        expect(get: "/api/auctions/obtain").not_to be_routable
      end
    end

    describe 'PUT publish' do
      it 'success' do
        expect(put: "/api/auctions/#{auction.id}/publish").not_to be_routable
      end
    end

    describe 'PUT hold' do
      it 'success' do
        expect(put: "/api/auctions/#{auction.id}/hold").not_to be_routable
      end
    end

    describe 'POST confirm' do
      it 'success' do
        expect(put: "/api/auctions/#{auction.id}/confirm").not_to be_routable
      end
    end

    describe 'PUT/PATCH update' do
      it 'success' do
        expect(put: "/api/auctions/#{auction.id}").not_to be_routable
        expect(patch: "/api/auctions/#{auction.id}").not_to be_routable
      end
    end
  end

end
