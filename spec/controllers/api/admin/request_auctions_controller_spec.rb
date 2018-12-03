require 'rails_helper'

RSpec.describe Api::Admin::RequestAuctionsController, type: :controller do
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:request_auction){ create( :request_auction, contract_period_start_date: DateTime.now, user_id: company_buyer.id) }
  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'request_auctions_pending' do
      context 'all pending request auctions' do
        def do_request
          get :request_auctions_pending
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body.length).to eq(1)
        end
      end
    end

    describe 'approval_request_auction' do
      context 'approval request auction (success)' do
        def do_request
          put :approval_request_auction, params: { id: request_auction.id, accepted:1}
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body).to have_content('request_auction')
          expect(hash_body['result']).to eq('success')
          expect(hash_body['request_auction']['accept_status']).to eq('1')
        end
      end

      context 'reject request auction (success)' do
        def do_request
          put :approval_request_auction, params: { id: request_auction.id }
        end

        before { do_request }
        it 'Success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('result')
          expect(hash_body).to have_content('request_auction')
          expect(hash_body['result']).to eq('success')
          expect(hash_body['request_auction']['accept_status']).to eq('0')
        end

      end

      context 'Failure --> missing request auction' do
        def do_request
          put :approval_request_auction, params: { id: 99999, accepted:1}
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
