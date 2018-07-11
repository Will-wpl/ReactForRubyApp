require 'rails_helper'

RSpec.describe Api::Retailer::RegistrationsController, type: :controller do
  let!(:retailer_user) { create(:user, :with_retailer) }
  let!(:retailer_user1) { create(:user, :with_retailer, company_name: 'Retailer1 Company') }

  context 'save retailer information' do
    before { sign_in retailer_user }

    describe 'Validate user info' do
      context 'success' do
        def do_request
          put :validate, params: { id: retailer_user.id, user: { id: retailer_user.id,
                                                                 company_name: 'Retailer Company',
                                                                 company_unique_entity_number: 'UEN',
                                                                 email: 'abc@emaiol.com',
                                                                 company_license_number: 'abc'} }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body['validate_result']).to eq(true)
          expect(response).to have_http_status(:ok)
        end
      end
      context 'Failed  - company name is exist.' do
        def do_request
          put :validate, params: { id: retailer_user.id, user: { id: retailer_user.id,
                                                                 company_name: 'Retailer1 Company',
                                                                 company_unique_entity_number: 'UEN',
                                                                 email: 'abc@emaiol.com',
                                                                 company_license_number: 'abc'} }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body['validate_result']).to eq(false)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    describe 'Get index' do
      def do_request
        get :index
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user_base_info')
        expect(response).to have_http_status(:ok)
      end
    end

    describe 'Put update' do
      def do_request
        put :update, params: { id: retailer_user.id, user: {id: '10',
                                                            email: 'retailer3@example.com',
                                                            company_name: 'Retailer3 Company',
                                                            company_unique_entity_number: 'UEN 01234',
                                                            company_address: 'China DL',
                                                            billing_address: 'asdf',
                                                            name: 'Retailer 3',
                                                            account_mobile_number: '12345678',
                                                            account_office_number: '87654321',
                                                            agree_seller_buyer: '1', agree_seller_revv: '0' } }
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
        put :sign_up, params: { id: retailer_user.id, user:{agree_seller_buyer: '1', agree_seller_revv: '0'} }
      end
      before { do_request }
      it 'success' do
        # expect(retailer_user.approval_status).to eq('2')
        hash_body = JSON.parse(response.body)
        expect(hash_body).to have_content('user')
        expect(response).to have_http_status(:ok)

      end
    end
  end
end
