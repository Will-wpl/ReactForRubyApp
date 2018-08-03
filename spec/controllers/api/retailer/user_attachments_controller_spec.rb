require 'rails_helper'

RSpec.describe Api::Retailer::UserAttachmentsController, type: :controller do
  let!(:retailer_user){ create(:user, :with_retailer) }
  let!(:tc) { create(:user_attachment, :sbtc, file_name: 'test', file_path: 'test')}
  context 'retailer user' do
    before { sign_in retailer_user }

    describe 'retailer registration' do
      context 'create attachment' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'RETAILER_BUSINESS' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('RETAILER_BUSINESS')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(retailer_user.id)
        end
      end

    end
  end
end
