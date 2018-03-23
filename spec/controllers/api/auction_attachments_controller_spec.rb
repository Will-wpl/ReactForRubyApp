require 'rails_helper'

RSpec.describe Api::AuctionAttachmentsController, type: :controller do
  let!(:user) { create(:user) }
  base_url = 'api/auction_attachments'
  context 'api/auction_attachments routes' do
    describe 'GET index' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}").not_to be_routable
      end
    end

    describe 'POST create' do
      before { sign_in user }
      it 'success' do
        expect(post: "/#{base_url}").not_to be_routable
      end
    end


  end
end
