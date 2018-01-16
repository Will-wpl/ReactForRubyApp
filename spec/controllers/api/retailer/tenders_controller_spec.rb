require 'rails_helper'

RSpec.describe Api::Retailer::TendersController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
  let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }

  context 'retailer user' do
    before { sign_in retailer_user }

    describe 'POST node1_retailer_accept' do
      context 'Go to node2' do
        def do_request
          post :node1_retailer_accept, params: { id: arrangement.id }
        end
        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['current']['current_node']).to eq(2)
          expect(hash_body['current']['previous_node']).to eq(1)
        end
      end
    end

    describe 'POST node1_retailer_reject' do
      context 'reject and closed tender' do
        def do_request
          post :node1_retailer_reject, params: { id: arrangement.id }
        end
        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['current']['current_node']).to be_nil
          expect(hash_body['current']['previous_node']).to be_nil
          expect(hash_body['current']['current_status']).to eq('reject')
        end
      end
    end


  end
end