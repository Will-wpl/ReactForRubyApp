require 'rails_helper'

RSpec.describe Api::Admin::AuctionResultsController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:retailer_user) { create(:user, :with_retailer) }
  let!(:buyer_user){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:consumption) { create(:consumption, :init, user: buyer_user, auction: auction, participation_status: '1', acknowledge: '1' ) }
  let!(:result) { create(:auction_result, auction: auction, user_id: retailer_user.id, status: '1') }

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }


    describe 'Index' do

      context 'Pager auction result list' do
        def do_request
          get :index, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(11)
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
          expect(hash['headers'].size).to eq(11)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end

      context 'Params pagers auction result list and sort' do
        def do_request
          get :index, params: { name: [auction.name, 'like'], start_datetime: [Time.current.strftime('%Y-%m-%d'), 'date_between'], page_size: '10', page_index: '1', sort_by: ['name' , 'asc', 'auctions'] }
        end

        before { do_request }
        it 'Success' do
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(11)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end


    end

    describe 'contract duration Index' do
      let!(:auction1) { create(:auction, :for_next_month, :upcoming, :published, :started) }
      let!(:result1) { create(:auction_result, auction: auction1) }
      let!(:consumption) { create(:consumption, :init, user: buyer_user, auction: auction1, participation_status: '1', acknowledge: '1', contract_duration: '6' ) }
      let!(:auction_result_contracts) { create(:auction_result_contract,auction_result: result1, auction: auction1, contract_duration: '6') }
      context 'Pager auction result list' do
        def do_request
          get :index, params: { page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash = JSON.parse(response.body)
          expect(hash['headers'].size).to eq(11)
          expect(hash['bodies']['data'].size).to eq(1)
        end
      end
    end

    describe 'Award' do
      context 'Pager auction result list' do
        def do_request
          get :award, params: { id: auction.id }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          array = JSON.parse(response.body)
          # expect(array.size).to eq(1)
          # expect(array[0]['acknowledge']).to eq('1')
        end
      end

      context 'Pager contract duration auction result list' do

        let!(:auction1) { create(:auction, :for_next_month, :upcoming, :published, :started) }
        let!(:consumption) { create(:consumption, :init, user: buyer_user, auction: auction1, participation_status: '1', acknowledge: '1', contract_duration: '6' ) }
        def do_request
          get :award, params: { id: auction1.id , contract_duration: '6' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          array = JSON.parse(response.body)
          # expect(array.size).to eq(1)
          # expect(array[0]['acknowledge']).to eq('1')
        end
      end
    end
  end

end
