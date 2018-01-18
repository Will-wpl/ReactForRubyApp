require 'rails_helper'

RSpec.describe Api::Retailer::AuctionAttachmentsController, type: :controller do
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }
  let! (:retailer) { create(:user, :with_retailer) }
  let!(:tc) { create(:auction_attachment, file_type: 'buyer_tc_upload0', file_name: 'test', file_path: 'test', auction: auction, user_id:retailer.id)}

  context 'Retailer user' do
    before { sign_in retailer }

    describe 'GET index' do
      context 'Base get' do
        def do_request
          get :index, params: {auction_id: auction.id, user_id: retailer.id }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'Upload file' do
      context 'Auction do it' do
        def do_request
          file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: file, auction_id: auction.id, file_type: 'tender_documents_upload', user_id: retailer.id  }
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
          hash_body = JSON.parse(response.body)
          expect(hash_body['file_path']).to include("uploads/attachments/#{auction.id}/")
          expect(hash_body['file_type']).to eq('tender_documents_upload')
          expect(hash_body['file_name']).to eq('test.jpg')
          expect(hash_body['user_id']).to eq(retailer.id)
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

end
