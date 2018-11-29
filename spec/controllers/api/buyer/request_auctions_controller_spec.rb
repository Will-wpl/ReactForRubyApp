require 'rails_helper'

RSpec.describe Api::Buyer::RequestAuctionsController, type: :controller do
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:request_auction) { create(:request_auction, contract_period_start_date: DateTime.now, user_id: company_buyer.id) }
  let!(:tc) { create(:request_attachment, file_name: 'test', file_path: 'test') }
  context 'buy user' do
    before { sign_in company_buyer }
    describe 'save_update' do
      context 'create new request auction (no attachment)' do
        def do_request
          put :save_update, params: { name: 'new_request', contract_period_start_date: DateTime.now, duration: 6,
                                      buyer_type: 'single', allow_deviation: 'yes' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('request_auction')
          expect(hash_body['request_auction']['name']).to eq('new_request')
        end
      end

      context 'create new request auction (have an attachment)' do
        def do_request
          put :save_update, params: { name: 'new_request_file', contract_period_start_date: DateTime.now, duration: 6,
                                      buyer_type: 'single', allow_deviation: 'yes', attachment_id: tc.id }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('request_auction')
          expect(hash_body['request_auction']['name']).to eq('new_request_file')
        end
      end

      context 'update an existed request auction' do
        def do_request
          put :save_update, params: { id: request_auction.id, name: 'new_request', contract_period_start_date: DateTime.now, duration: 6,
                                      buyer_type: 'single', allow_deviation: 'yes' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('request_auction')
          expect(hash_body['request_auction']['id']).to eq(request_auction.id)
          expect(hash_body['request_auction']['name']).to eq('new_request')
        end
      end
    end


    describe 'delete_request_auction' do

      context 'success' do
        def do_request
          put :delete_request_auction, params: { id: request_auction.id }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body['result']).to eq('success')
        end
      end

      context 'Failure --> missing request auction' do
        def do_request
          put :delete_request_auction, params: { id: 999999 }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body['result']).to eq('failure')
        end
      end
    end

    describe 'index' do
      context 'all request auctions' do
        def do_request
          get :index
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body.length).to eq(3)
        end
      end

      context 'request auctions witch page' do
        def do_request
          sort_by = ['name', 'desc', '']
          get :index, params: { sort_by: sort_by, page_size: '10', page_index: '1' }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body.length).to eq(3)
        end
      end
    end

    describe 'buyer_entity_contracts' do

      context 'with default order' do
        def do_request
          get :buyer_entity_contracts
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('buyer_entity_contracts')
        end
      end

      context 'with special default order' do
        def do_request
          sort_by = ['entity_name','desc'].to_json
          get :buyer_entity_contracts, params: { sort_by: sort_by }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('buyer_entity_contracts')
        end
      end
    end

    describe 'show' do
      context 'success' do
        def do_request
          put :show, params: { id: request_auction.id }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body).to have_content('request_auction')
          expect(hash_body).to have_content('last_attachment')
          expect(hash_body).to have_content('all_attachments')
          expect(hash_body['result']).to eq('success')
          expect(hash_body['request_auction']['id']).to eq(request_auction.id)
        end
      end
      context 'Failure --> missing request auction' do
        def do_request
          put :show, params: { id: 99999}
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body['result']).to eq('failure')
        end
      end
    end
  end
end
