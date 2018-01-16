require 'rails_helper'

RSpec.describe Api::Admin::TendersController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
  let!(:admin_user) { create(:user, :with_admin) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
  let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }

  context 'admin user' do
    before { sign_in admin_user }

    context 'node3' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }
      let!(:tender_node3_submit) { create(:tender_state_machine, arrangement: arrangement, previous_node: 3, current_node: 3, turn_to_role: 2,current_role: 1) }

      describe 'POST node3_send_response' do

        context 'Go to node4' do
          def do_request
            post :node3_send_response, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(3)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
          end
        end
      end

    end

    context 'node4' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }
      let!(:tender_node3_retailer_next) { create(:tender_state_machine, arrangement: arrangement, previous_node: 3, current_node: 4, turn_to_role: 2,current_role: 2) }
      let!(:tender_node4_retailer_submit) { create(:tender_state_machine, arrangement: arrangement, previous_node: 4, current_node: 4, turn_to_role: 1,current_role: 2) }
      describe 'POST node4_admin_accept' do
        context 'Still at node4 and turn to retailer and retailer could next' do
          def do_request
            post :node4_admin_accept, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(2)
          end
        end
      end

      describe 'POST node4_admin_reject' do
        context 'Still at node4 and turn to retailer and retailer need re-submit' do
          def do_request
            post :node4_admin_reject, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(2)
          end
        end
      end
    end

  end
end