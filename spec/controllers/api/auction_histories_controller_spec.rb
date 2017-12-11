require 'rails_helper'

RSpec.describe Api::AuctionHistoriesController, type: :controller do
  let!(:user) { create(:user) }
  base_url = 'api/auction_histories'
  context 'api/auction_histories routes' do
    describe 'GET show' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}").not_to be_routable
      end
    end

    describe 'GET list' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}/list").not_to be_routable
      end
    end

    describe 'GET last' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}/last").not_to be_routable
      end
    end

  end

end
