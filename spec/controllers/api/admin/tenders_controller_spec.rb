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

        describe 'GET current' do
          context 'Show node3 message' do
            def do_request
              get :current, params: { id: arrangement.id }
            end
            before { do_request }
            it 'Success' do
              hash_body = JSON.parse(response.body)
              expect(response).to have_http_status(:ok)
              expect(hash_body['current']['current_node']).to eq(3)
              expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
            end
          end
        end

        describe 'GET node3_admin' do
          context 'Show node3 admin ' do
            let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
            let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
            def do_request
              get :node3_admin, params: { id: arrangement.id }
            end
            before { do_request }
            it 'Success' do
              hash_body = JSON.parse(response.body)
              expect(response).to have_http_status(:ok)
              expect(hash_body['chats'].size).to eq(1)
            end
          end
        end

        context 'Go to node4' do
          let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
          let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
          def do_request
            chat3 = { id: chat1['id'], item: chat1['item'], clause: chat1['clause'], propose_deviation: chat1['propose_deviation'], retailer_response: chat1['retailer_response'] }
            chats = [chat3]
            post :node3_send_response, params: { id: arrangement.id, chats: chats.to_json }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(3)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
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
            post :node4_admin_accept, params: { id: arrangement.id, comments: 'hello' }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
          end
        end
      end

      describe 'POST node4_admin_reject' do
        context 'Still at node4 and turn to retailer and retailer need re-submit' do
          def do_request
            post :node4_admin_reject, params: { id: arrangement.id, comments: 'hello' }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
          end
        end
      end
    end

  end
end