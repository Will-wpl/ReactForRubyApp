require 'rails_helper'

RSpec.describe Api::Admin::UserAttachmentsController, type: :controller do
  let! (:admin_user) { create(:user, :with_admin) }
  let!(:tc) { create(:user_attachment, :sbtc, file_name: 'test', file_path: 'test')}
  base_url = 'api/admin/user_attachments'

  context 'admin user' do
    before { sign_in admin_user }

    describe 'GET last file by type' do
      context 'Base get' do
        def do_request
          put :find_last_by_type, params: {id: tc.id, file_type:'SELLER_BUYER_TC'}
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'GET index' do
      context 'Base get' do
        def do_request
          get :index, params: {file_type:'SELLER_BUYER_TC'}
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'Upload file' do
      context 'Admin do it' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'SELLER_BUYER_TC' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_path']).to include('/uploads/attachments/1')
          expect(hash_body['file_type']).to eq('SELLER_BUYER_TC')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(nil)
        end
      end

    end

    describe 'Delete file' do
      context 'Base get' do
        def do_request
          delete :destroy, params: {id: tc.id }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end


  context 'retailer user' do

    before { sign_in create(:user, :with_retailer) }

    describe '401 Unauthorized' do
      context 'GET index' do
        it 'success' do
          get :index
          expect(response).to have_http_status(401)
        end
      end

      context 'GET index' do
        it 'success' do
          post :create
          expect(response).to have_http_status(401)
        end
      end
    end
  end
end
