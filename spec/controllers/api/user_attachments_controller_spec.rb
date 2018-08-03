require 'rails_helper'

RSpec.describe Api::UserAttachmentsController, type: :controller do
  let!(:user) { create(:user) }
  base_url = 'api/user_attachments'
  context 'api/user_attachments routes' do
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

