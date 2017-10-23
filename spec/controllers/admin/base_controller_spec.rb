require 'rails_helper'

RSpec.describe Admin::BaseController, type: :controller do
  controller do
    def index
      head :ok
    end
  end

  describe '#index' do
    def do_request
      get :index
    end

    context 'as non-admin' do
      before { sign_in create(:user) }

      it 'raises error' do
        do_request

        expect(response).to have_http_status(:unauthorized)
        expect(response).not_to be_success
      end
    end

    context 'as admin' do
      before { sign_in create(:user, :with_admin) }

      it 'does not raise error' do
        do_request

        expect(response).to be_success
      end
    end
  end
end
