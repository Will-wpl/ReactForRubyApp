require 'rails_helper'

RSpec.describe Api::Retailer::AuctionResultsController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:retailer_user) { create(:user, :with_retailer) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction, action_status: '1') }
  let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id) }

  context 'retailer user' do
    before { sign_in retailer_user }


    describe 'Index' do

      context 'Pager auction result list' do
        def do_request
          get :index, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end

      context 'Params pagers auction result list' do
        def do_request
          get :index, params: { name: [auction.name, 'like'], start_datetime: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end


    end

  end

end
