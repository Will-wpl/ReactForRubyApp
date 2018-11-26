require 'rails_helper'

RSpec.describe Api::Buyer::UserAttachmentsController, type: :controller do
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:tc) { create(:user_attachment, file_name: 'test', file_path: 'test')}
  let!(:tc1) { create(:user_attachment, file_name: 'test', file_path: 'test', file_type:'LETTER_OF_AUTHORISATION')}
  let!(:tc2) { create(:user_attachment, file_name: 'test', file_path: 'test')}
  context 'buy user' do
    before { sign_in company_buyer }

    describe 'buyer registration' do
      context 'create attachment - LETTER_OF_AUTHORISATION' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'LETTER_OF_AUTHORISATION' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('LETTER_OF_AUTHORISATION')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(company_buyer.id)
        end
      end

      context 'create attachment - SELLER_BUYER_TC' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'SELLER_BUYER_TC' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('SELLER_BUYER_TC')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(company_buyer.id)
        end
      end

      context 'create attachment - BUYER_REVV_TC' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'BUYER_REVV_TC' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('BUYER_REVV_TC')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(company_buyer.id)
        end
      end

      context 'create attachment - SELLER_REVV_TC' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'SELLER_REVV_TC' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('SELLER_REVV_TC')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(company_buyer.id)
        end
      end

      context 'patch consumption detail attachment' do
        def do_request
          ids = []
          ids.push(tc.id)
          ids.push(tc1.id)
          ids.push(tc2.id)

          put :patch_update_consumption_detail_id, params: { ids: ids.to_json, consumption_detail_id: 100 }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['result']).to eq('success')
        end
      end

      context 'Delete file' do
        def do_request
          delete :destroy, params: {id: tc1.id }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end

    end
  end
end
