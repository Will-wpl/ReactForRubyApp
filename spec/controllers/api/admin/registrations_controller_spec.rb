require 'rails_helper'

RSpec.describe Api::Admin::RegistrationsController, type: :controller do
  let!(:admin_user) { create(:user, :with_admin) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:retailer_user) { create(:user, :with_retailer) }

  context 'get buyer/retailer info' do
    before { sign_in admin_user }
    describe 'Get buyer info by user id' do
      def do_request
        get :buyer_info, params: { id: admin_user.id, user_id: company_buyer.id  }
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user_base_info')
        expect(hash_body).to have_content('buyer_entities')
        expect(response).to have_http_status(:ok)
      end
    end

    describe 'Get retailer info by user id' do
      def do_request
        get :retailer_info, params: { id: admin_user.id, user_id: retailer_user.id }
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user_base_info')
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
