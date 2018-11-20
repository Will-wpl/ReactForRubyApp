require 'rails_helper'

RSpec.describe Api::Retailer::TendersController, type: :controller do

  context 'retailer user' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published) }
    let!(:retailer_user){ create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
    let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }
    let!(:rcuu) { create(:auction_attachment, :rcuu, auction: auction)}
    let!(:btu) { create(:auction_attachment, :btu, auction: auction)}
    let!(:tdus) { create_list(:auction_attachment, 5, :tdu, auction: auction) }
    let!(:retailer_tdus) { create_list(:auction_attachment, 7, :tdu, auction: auction, user_id: retailer_user.id) }
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
            expect(hash_body['flows'].to_s).to eq('[]')
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
            expect(hash_body['flows'].to_s).to eq('[1]')
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
            expect(hash_body['flows'].to_s).to eq('[]')
          end
        end
      end

      describe 'GET node1_retailer' do

        context 'get details' do
          def do_request
            post :node1_retailer, params: { id: arrangement.id }
          end
          before {
            do_request
          }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body[0]['file_type']).to eq('retailer_confidentiality_undertaking_upload')
          end
        end


        context 'get details, has tc_attach_info' do
          let!(:six_month_contract) { create(:auction_contract, auction: auction, contract_duration: '6', contract_period_end_date: DateTime.current) }
          let!(:twelve_month_contract) { create(:auction_contract, auction: auction, contract_duration: '12', contract_period_end_date: DateTime.current) }
          let!(:twenty_four_month_contract) { create(:auction_contract, auction: auction, contract_duration: '24', contract_period_end_date: DateTime.current) }
          let!(:tc1) { create(:user_attachment, file_name: 'SELLER_BUYER_TC', file_path: 'test', file_type: 'SELLER_BUYER_TC')}
          let!(:tc2) { create(:user_attachment, file_name: 'SELLER_REVV_TC', file_path: 'test', file_type: 'SELLER_REVV_TC')}
          let!(:tc3) { create(:user_attachment, file_name: 'BUYER_REVV_TC', file_path: 'test', file_type: 'BUYER_REVV_TC')}
          def do_request
            post :node1_retailer, params: { id: arrangement.id }
          end
          before {
            tc_attach_info = {}
            tc_attach_info[:SELLER_BUYER_TC] = tc1.id
            tc_attach_info[:SELLER_REVV_TC] = tc2.id
            tc_attach_info[:BUYER_REVV_TC] = tc3.id
            auction.tc_attach_info = tc_attach_info.to_json
            auction.save
            do_request
          }
          it 'Success' do
            expect(response).to have_http_status(:ok)
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
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
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
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
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

        context 'get details, has auction contracts' do
          let!(:six_month_contract) { create(:auction_contract, auction: auction, contract_duration: '6', contract_period_end_date: DateTime.current) }
          let!(:twelve_month_contract) { create(:auction_contract, auction: auction, contract_duration: '12', contract_period_end_date: DateTime.current) }
          let!(:twenty_four_month_contract) { create(:auction_contract, auction: auction, contract_duration: '24', contract_period_end_date: DateTime.current) }
          let!(:tc1) { create(:user_attachment, file_name: 'SELLER_BUYER_TC', file_path: 'test', file_type: 'SELLER_BUYER_TC')}
          let!(:tc2) { create(:user_attachment, file_name: 'SELLER_REVV_TC', file_path: 'test', file_type: 'SELLER_REVV_TC')}
          let!(:tc3) { create(:user_attachment, file_name: 'BUYER_REVV_TC', file_path: 'test', file_type: 'BUYER_REVV_TC')}
          def do_request
            post :node2_retailer, params: { id: arrangement.id }
          end
          before {
            tc_attach_info = {}
            tc_attach_info[:SELLER_BUYER_TC] = tc1.id
            tc_attach_info[:SELLER_REVV_TC] = tc2.id
            tc_attach_info[:BUYER_REVV_TC] = tc3.id
            auction.tc_attach_info = tc_attach_info.to_json
            auction.save
            do_request
          }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
          end
        end

      end
    end

    context 'node3' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }

      describe 'POST node3_retailer_withdraw_all_deviations' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        context 'Go to node4' do
          def do_request
            chat1 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
            chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
            chat3 = { id: chat1[:id].to_s, item: chat1[:item], clause: chat1[:clause], propose_deviation: chat1[:propose_deviation], retailer_response: chat1[:retailer_response] }

            chats = [chat1, chat2, chat3]
            post :node3_retailer_withdraw_all_deviations, params: { id: arrangement.id, chats: chats.to_json }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(4)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')

          end
        end
      end

      describe 'POST node3_retailer_submit' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        context 'Still at node3 and turn to admin' do
          def do_request
            chat0 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
            chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
            chat3 = { id: chat1['id'].to_s, item: chat1['item'], clause: chat1['clause'], propose_deviation: chat1['propose_deviation'], retailer_response: chat1['retailer_response'] }

            chats = [chat0, chat2, chat3]
            post :node3_retailer_submit_deviations, params: { id: arrangement.id, chats: chats.to_json  }
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
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
          end
        end

      end

      describe 'GET node3_retailer' do

        context 'No chat' do
          def do_request
            get :node3_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['chats'].size).to eq(0)
          end
        end

        context 'Has chats' do
          let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
          let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
          let!(:chat2) { create(:tender_chat, arrangement: arrangement) }
          let!(:chat2_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat2) }
          def do_request
            get :node3_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['chats'].size).to eq(2)
          end
        end
      end

      describe 'GET history' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        let!(:chat1_detail2) { create(:tender_chat_detail, :with_sp, :sp_accept, tender_chat: chat1) }
        let!(:chat1_detail3) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        let!(:chat1_detail4) { create(:tender_chat_detail, :with_sp, :sp_accept, tender_chat: chat1) }

        def do_request
          get :history, params: { id: arrangement.id, chat_id: chat1.id }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['details'].size).to eq(4)
          expect(hash_body['retailer_name']).to eq(arrangement.user.company_name)
        end
      end

      describe 'POST node3_retailer_save' do
        let!(:chat1_1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1_1) }
        # let!(:chat1_detail2) { create(:tender_chat_detail, :with_sp, :sp_reject, tender_chat: chat1) }

        def do_request
          chat1 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
          chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
          chat3 = { id: chat1_1['id'].to_s, item: chat1_1['item'], clause: chat1_1['clause'], propose_deviation: chat1_1['propose_deviation'], retailer_response: chat1_1['retailer_response'] }

          chats = [chat1, chat2, chat3]
          post :node3_retailer_save, params: { id: arrangement.id, chats: chats.to_json }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          count = TenderChat.where('arrangement_id = ?', arrangement.id).count
          expect(count).to eq(3)
        end
      end

      describe 'POST node3_retailer_withdraw' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }

        def do_request
          chat3 = { id: chat1['id'], item: chat1['item'], clause: chat1['clause'], propose_deviation: chat1['propose_deviation'], retailer_response: chat1['retailer_response'] }
          post :node3_retailer_withdraw, params: { id: arrangement.id, chat: chat3 }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['sp_response_status']).to eq('4')
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
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4]')
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
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(5)
            expect(hash_body['current']['current_status']).to eq('closed')
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3, 4, 5]')
          end
        end
      end
    end
  end

  context 'retailer has mult buyer' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, buyer_type: '1') }
    let!(:retailer_user){ create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
    let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }
    let!(:rcuu) { create(:auction_attachment, :rcuu, auction: auction)}
    let!(:btu) { create(:auction_attachment, :btu, auction: auction)}
    let!(:tdus) { create_list(:auction_attachment, 5, :tdu, auction: auction) }
    let!(:retailer_tdus) { create_list(:auction_attachment, 7, :tdu, auction: auction, user_id: retailer_user.id) }
    let!(:auction_contract_six) { create(:auction_contract, :six_month, auction: auction) }
    let!(:auction_contract_twelve) { create(:auction_contract, :twelve_month, auction: auction) }
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
            expect(hash_body['flows'].to_s).to eq('[]')
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
            expect(hash_body['flows'].to_s).to eq('[1]')
          end
        end
      end

      describe 'GET node1_retailer' do
        pending "add test to #{__FILE__}"
      end
    end

    context 'node2' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }

      describe 'POST node2_retailer_accept_all' do

        context 'Go to node5' do
          def do_request
            post :node2_retailer_accept_all, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
          end
        end
      end

      describe 'GET node2_retailer' do
        pending "add test to #{__FILE__}"
      end
    end

    context 'node5' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_accept_all) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 5, turn_to_role: 2,current_role: 2) }

      describe 'POST node5_retailer_submit' do

        context 'Finished tender' do
          def do_request
            post :node5_retailer_submit, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(5)
            expect(hash_body['current']['current_status']).to eq('closed')
            expect(hash_body['flows'].to_s).to eq('[1, 2, 5]')
          end
        end
      end
    end
  end

  context 'retailer has single buyer' do
    let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, buyer_type: '0', allow_deviation: '1' ) }
    let!(:retailer_user){ create(:user, :with_retailer) }
    let!(:arrangement) { create(:arrangement, user: retailer_user, auction: auction) }
    let!(:tender) { create(:tender_state_machine, arrangement: arrangement, current_node: 1) }
    let!(:rcuu) { create(:auction_attachment, :rcuu, auction: auction)}
    let!(:btu) { create(:auction_attachment, :btu, auction: auction)}
    let!(:tdus) { create_list(:auction_attachment, 5, :tdu, auction: auction) }
    let!(:retailer_tdus) { create_list(:auction_attachment, 7, :tdu, auction: auction, user_id: retailer_user.id) }
    let!(:auction_contract_six) { create(:auction_contract, :six_month, auction: auction) }
    let!(:auction_contract_twelve) { create(:auction_contract, :twelve_month, auction: auction) }
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
            expect(hash_body['flows'].to_s).to eq('[]')
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
            expect(hash_body['flows'].to_s).to eq('[1]')
          end
        end
      end

      describe 'GET node1_retailer' do
        pending "add test to #{__FILE__}"
      end
    end

    context 'node2' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }

      describe 'POST node2_retailer_accept_all' do

        context 'Go to node5' do
          def do_request
            post :node2_retailer_accept_all, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
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
            expect(hash_body['flows'].to_s).to eq('[1, 2]')
          end
        end
      end

      describe 'GET node2_retailer' do
        pending "add test to #{__FILE__}"
      end
    end

    context 'node3' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_propose_deviations) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 3, turn_to_role: 2,current_role: 2) }

      describe 'POST node3_retailer_withdraw_all_deviations' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        context 'Go to node5' do
          def do_request
            chat1 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
            chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
            chat3 = { id: chat1[:id].to_s, item: chat1[:item], clause: chat1[:clause], propose_deviation: chat1[:propose_deviation], retailer_response: chat1[:retailer_response] }

            chats = [chat1, chat2, chat3]
            post :node3_retailer_withdraw_all_deviations, params: { id: arrangement.id, chats: chats.to_json }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')

          end
        end
      end

      describe 'POST node3_retailer_submit' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        context 'Still at node3 and turn to admin' do
          def do_request
            chat0 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
            chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
            chat3 = { id: chat1['id'].to_s, item: chat1['item'], clause: chat1['clause'], propose_deviation: chat1['propose_deviation'], retailer_response: chat1['retailer_response'] }

            chats = [chat0, chat2, chat3]
            post :node3_retailer_submit_deviations, params: { id: arrangement.id, chats: chats.to_json  }
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

        context 'Go to node5' do
          def do_request
            post :node3_retailer_next, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(3)
            expect(hash_body['current']['turn_to_role']).to eq(2)
            expect(hash_body['flows'].to_s).to eq('[1, 2, 3]')
          end
        end

      end

      describe 'GET node3_retailer' do

        context 'No chat' do
          def do_request
            get :node3_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['chats'].size).to eq(0)
          end
        end

        context 'Has chats' do
          let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
          let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
          let!(:chat2) { create(:tender_chat, arrangement: arrangement) }
          let!(:chat2_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat2) }
          def do_request
            get :node3_retailer, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['chats'].size).to eq(2)
          end
        end
      end

      describe 'GET history' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        let!(:chat1_detail2) { create(:tender_chat_detail, :with_sp, :sp_accept, tender_chat: chat1) }
        let!(:chat1_detail3) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }
        let!(:chat1_detail4) { create(:tender_chat_detail, :with_sp, :sp_accept, tender_chat: chat1) }

        def do_request
          get :history, params: { id: arrangement.id, chat_id: chat1.id }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['details'].size).to eq(4)
          expect(hash_body['retailer_name']).to eq(arrangement.user.company_name)
        end
      end

      describe 'POST node3_retailer_save' do
        let!(:chat1_1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1_1) }
        # let!(:chat1_detail2) { create(:tender_chat_detail, :with_sp, :sp_reject, tender_chat: chat1) }

        def do_request
          chat1 = { id: '0', item: 1, clause: '1.1', propose_deviation: 'abc1', retailer_response: 'aaa' }
          chat2 = { id: '0', item: 2, clause: '1.2', propose_deviation: 'abc2', retailer_response: 'bbb' }
          chat3 = { id: chat1_1['id'].to_s, item: chat1_1['item'], clause: chat1_1['clause'], propose_deviation: chat1_1['propose_deviation'], retailer_response: chat1_1['retailer_response'] }

          chats = [chat1, chat2, chat3]
          post :node3_retailer_save, params: { id: arrangement.id, chats: chats.to_json }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          count = TenderChat.where('arrangement_id = ?', arrangement.id).count
          expect(count).to eq(3)
        end

      end

      describe 'POST node3_retailer_back' do
        let!(:chat1_1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1_1) }
        def do_request
          post :node3_retailer_back, params: { id: arrangement.id }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          count = TenderChat.where('arrangement_id = ?', arrangement.id).count
          expect(count).to eq(0)
        end
      end

      describe 'POST node3_retailer_withdraw' do
        let!(:chat1) { create(:tender_chat, arrangement: arrangement) }
        let!(:chat1_detail1) { create(:tender_chat_detail, :with_retailer, tender_chat: chat1) }

        def do_request
          chat3 = { id: chat1['id'], item: chat1['item'], clause: chat1['clause'], propose_deviation: chat1['propose_deviation'], retailer_response: chat1['retailer_response'] }
          post :node3_retailer_withdraw, params: { id: arrangement.id, chat: chat3 }
        end

        before { do_request }
        it 'Success' do
          hash_body = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(hash_body['sp_response_status']).to eq('4')
        end
      end

    end

    context 'node5' do
      let!(:tender_node1_accept) { create(:tender_state_machine, arrangement: arrangement, previous_node: 1, current_node: 2, turn_to_role: 2,current_role: 2) }
      let!(:tender_node2_accept_all) { create(:tender_state_machine, arrangement: arrangement, previous_node: 2, current_node: 5, turn_to_role: 2,current_role: 2) }

      describe 'POST node5_retailer_submit' do

        context 'Finished tender' do
          def do_request
            post :node5_retailer_submit, params: { id: arrangement.id }
          end
          before { do_request }
          it 'Success' do
            hash_body = JSON.parse(response.body)
            expect(response).to have_http_status(:ok)
            expect(hash_body['current']['current_node']).to eq(5)
            expect(hash_body['current']['previous_node']).to eq(5)
            expect(hash_body['current']['current_status']).to eq('closed')
            expect(hash_body['flows'].to_s).to eq('[1, 2, 5]')
          end
        end
      end
    end
  end
end