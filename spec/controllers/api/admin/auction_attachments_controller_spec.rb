require 'rails_helper'

RSpec.describe Api::Admin::AuctionAttachmentsController, type: :controller do
  let! (:auction) { create(:auction, :for_next_month, :upcoming) }
  base_url = 'api/admin/auction_attachments'

  context 'admin user' do
    before { sign_in create(:user, :with_admin) }

    describe 'GET index' do
      context 'Base get' do
        def do_request
          get :index
        end
        before { do_request }
        it 'success' do
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'Upload file' do
      context 'Base get' do


        def do_request
          @file = fixture_file_upload('files/test.jpg', 'image/jpg')
          post :create, params: { file: @file }
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
