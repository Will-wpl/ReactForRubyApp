require 'rails_helper'

RSpec.describe Api::Buyer::RegistrationsController, type: :controller do
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }

  context 'save retailer information' do
    before { sign_in company_buyer }
    describe 'Get index' do
      def do_request
        get :index
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('buyer_base_info')
        expect(hash_body).to have_content('buyer_entities')
        expect(response).to have_http_status(:ok)
      end
    end

    describe 'Put update' do
      def do_request
        buyer_entity_1 = CompanyBuyerEntity.new
        buyer_entity_1.company_name = 'Test_Company_Name_1'
        buyer_entity_1.company_uen = 'Test_Company_UEN_1'
        buyer_entity_1.company_address = 'Test_Company_Address_1'

        buyer_entity_2 = CompanyBuyerEntity.new
        buyer_entity_2.company_name = 'Test_Company_Name_2'
        buyer_entity_2.company_uen = 'Test_Company_UEN_2'
        buyer_entity_2.company_address = 'Test_Company_Address_2'

        buyer_entities = [buyer_entity_1, buyer_entity_2 ]

        put :update, params: { id: company_buyer.id, user: {agree_seller_buyer: '1', agree_buyer_revv: '0' }, buyer_entities: buyer_entities.to_json}
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user')
        expect(response).to have_http_status(:ok)
      end
    end

    describe 'Put sign up' do
      def do_request
        buyer_entity_3 = CompanyBuyerEntity.new
        buyer_entity_3.company_name = 'Test_Company_Name_3'
        buyer_entity_3.company_uen = 'Test_Company_UEN_3'
        buyer_entity_3.company_address = 'Test_Company_Address_3'

        buyer_entity_4 = CompanyBuyerEntity.new
        buyer_entity_4.company_name = 'Test_Company_Name_4'
        buyer_entity_4.company_uen = 'Test_Company_UEN_4'
        buyer_entity_4.company_address = 'Test_Company_Address_4'

        buyer_entities = [buyer_entity_3, buyer_entity_4 ]

        put :sign_up, params: { id: company_buyer.id, user: {agree_seller_buyer: '1', agree_buyer_revv: '0' }, buyer_entities: buyer_entities.to_json}
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user')
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
