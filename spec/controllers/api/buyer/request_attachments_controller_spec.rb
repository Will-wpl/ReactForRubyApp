require 'rails_helper'

RSpec.describe Api::Buyer::RequestAttachmentsController, type: :controller do
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }

  context 'buy user' do
    before { sign_in company_buyer }

    describe 'create' do
      context 'success' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, file_type: 'Request T&C' }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_type']).to eq('Request T&C')
          expect(hash_body['file_name']).to eq('test.jpg')
        end
      end
    end
  end
end
