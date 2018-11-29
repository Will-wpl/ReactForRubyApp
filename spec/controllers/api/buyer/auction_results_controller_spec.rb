require 'rails_helper'

RSpec.describe Api::Buyer::AuctionResultsController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:individual_buyer) { create(:user, :with_buyer, :with_individual_buyer) }
  let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, action_status: '1', participation_status: '1') }
  let!(:result) { create(:auction_result, auction: auction, user_id: company_buyer.id) }

  context 'company buyer user' do
    before { sign_in company_buyer }
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
          # expect(hash['bodies']['data'].size).to eq(1)
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
          # expect(hash['bodies']['data'].size).to eq(1)
        end
      end

      context 'Params pagers auction result list and sort' do
        def do_request
          get :index, params: { name: [auction.name, 'like'], start_datetime: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1', sort_by: ['name' , 'asc', 'auctions'] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(5)
          # expect(hash['bodies']['data'].size).to eq(1)
        end
      end
    end

  end

end
