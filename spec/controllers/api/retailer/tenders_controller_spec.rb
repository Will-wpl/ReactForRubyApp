require 'rails_helper'

RSpec.describe Api::Retailer::TendersController, type: :controller do
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
  let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }
  let!(:rcuu) { create(:auction_attachment, :rcuu, auction: auction)}
  let!(:btu) { create(:auction_attachment, :btu, auction: auction)}
  let!(:tdus) { create_list(:auction_attachment, 5, :tdu, auction: auction) }
  let!(:retailer_tdus) { create_list(:auction_attachment, 7, :tdu, auction: auction, user_id: retailer_user.id) }
  context 'retailer user' do
    before { sign_in retailer_user }

    context 'node1' do

      describe 'GET current' do
        context 'Show node1 message' do
          def do_request
            get :current, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(1)
            expect(hash_body['flows'].to_s).to eq('[1]')
          end
        end
      end

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
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
          end
        end
      end

      describe 'POST node1_retailer_reject' do
        context 'Reject and closed tender' do
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
            expect(hash_body['flows'].to_s).to eq('[1]')
          end
        end
      end

      describe 'GET node1_retailer' do
        context 'get details' do
          def do_request
            post :node1_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body[0]['file_type']).to eq('retailer_confidentiality_undertaking_upload')
          end
        end
      end
    end

    context 'node2' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }

      describe 'POST node2_retailer_accept_all' do

        context 'Go to node4' do
          def do_request
            post :node2_retailer_accept_all, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 4]')
          end
        end
      end

      describe 'POST node2_retailer_propose_deviations' do
        context 'Go to node3' do
          def do_request
            post :node2_retailer_propose_deviations, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(3)
            expect(hash_body['current']['previous_node']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
          end
        end
      end

      describe 'GET node2_retailer' do
        context 'get details' do
          def do_request
            post :node2_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['attachments'].size).to eq(5)
          end
        end
      end
    end

    context 'node3' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }
      describe 'POST node3_retailer_withdraw_all_deviations' do

        context 'Go to node4' do
          def do_request
            post :node3_retailer_withdraw_all_deviations, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
          end
        end
      end

      describe 'POST node3_retailer_submit' do

        context 'Still at node3 and turn to admin' do
          def do_request
            post :node3_retailer_submit_deviations, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(3)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(1)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
          end
        end
      end

      describe 'POST node3_retailer_next' do

        context 'Go to node4' do
          def do_request
            post :node3_retailer_next, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
          end
        end

      end

    end

    context 'node4' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }
      let!(:tender_node3_retailer_next) { create(:tender_state_machine, arrangement: arrangement, previous_node: 3, current_node: 4, turn_to_role: 2,current_role: 2) }

      describe 'POST node4_retailer_submit' do

        context 'Still at node4 and turn to admin' do
          def do_request
            post :node4_retailer_submit, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(1)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
          end
        end
      end

      describe 'POST node4_retailer_next' do
        let!(:tender_node4_admin_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 4, current_node: 4, turn_to_role: 2,current_role: 1) }
        context 'Go to node5' do
          def do_request
            post :node4_retailer_next, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(4)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4, 5]')
          end
        end
      end

      describe 'GET node4_retailer' do
        context 'get details' do
          def do_request
            post :node4_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            puts hash_body
            expect(response).to have_http_status(:ok)
            expect(hash_body.size).to eq(7)
          end
        end
      end
    end

    context 'node5' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }
      let!(:tender_node3_retailer_next) { create(:tender_state_machine, arrangement: arrangement, previous_node: 3, current_node: 4, turn_to_role: 2,current_role: 2) }
      let!(:tender_node4_retailer_submit) { create(:tender_state_machine, arrangement: arrangement, previous_node: 4, current_node: 4, turn_to_role: 1,current_role: 2) }
      let!(:tender_node4_admin_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 4, current_node: 5, turn_to_role: 2,current_role: 1) }

      describe 'POST node5_retailer_submit' do

        context 'Finished tender' do
          def do_request
            post :node5_retailer_submit, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to be_nil
            expect(hash_body['current']['previous_node']).to be_nil
            expect(hash_body['current']['current_status']).to eq('closed')
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4, 5]')
          end
        end
      end
    end
  end
end