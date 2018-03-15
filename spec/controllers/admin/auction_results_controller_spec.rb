require 'rails_helper'

RSpec.describe Admin::AuctionResultsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }

  describe '#index' do
    def do_request
      get :index
    end

    context 'with admin role' do
      before { sign_in admin_user }

      before { do_request }

      it {
        expect(response).to be_success
      }
    end

  end


end
