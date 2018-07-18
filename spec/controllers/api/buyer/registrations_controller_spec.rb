require 'rails_helper'

RSpec.describe Api::Buyer::RegistrationsController, type: :controller do
  let!(:admin_user) { create(:user, :with_admin, email: 'admin@email.com') }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }

  context 'save retailer information' do
    before { sign_in company_buyer }

    describe 'Validate user info' do
      context 'test buyer entity emails duplicated' do
        def do_request
          put :validate, params: { id: company_buyer.id,
                                   user: {id: company_buyer.id,
                                          company_name: 'abc',
                                          company_unique_entity_number: 'UEN',
                                          email: 'test_email@email.com'},
                                   buyer_entities: [{ contact_email: 'test_email1@email.com' },
                                                    { contact_email: 'test_email1@email.com' },
                                                    { contact_email: 'test_email2@email.com' }].to_json }
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          expect(hash_body['error_entity_indexes']).to eq([0, 1])
          expect(response).to have_http_status(:ok)
        end
      end

      context 'test buyer email is same with entity contact email' do
        def do_request
          put :validate, params: { id: company_buyer.id,
                                   user: {id: company_buyer.id,
                                          company_name: 'abc',
                                          company_unique_entity_number: 'UEN',
                                          email: 'test_email@email.com'},
                                   buyer_entities: [{ contact_email: 'test_email@email.com' },
                                                    { contact_email: 'test_email1@email.com' },
                                                    { contact_email: 'test_email2@email.com' }].to_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          expect(hash_body['error_entity_indexes']).to eq([0])
          expect(response).to have_http_status(:ok)
        end
      end

      context 'test buyer email is same with existing user email' do
        def do_request
          put :validate, params: { id: company_buyer.id,
                                   user: {id: company_buyer.id,
                                          company_name: 'abc',
                                          company_unique_entity_number: 'UEN',
                                          email: 'test_email@email.com'},
                                   buyer_entities: [{ contact_email: 'admin@email.com' },
                                                    { contact_email: 'test_email1@email.com' }].to_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          expect(hash_body['error_entity_indexes']).to eq([0])
          expect(response).to have_http_status(:ok)
        end
      end

      context 'test buyer email valicate succss' do
        def do_request
          put :validate, params: { id: company_buyer.id,
                                   user: {id: company_buyer.id,
                                          company_name: 'abc',
                                          company_unique_entity_number: 'UEN',
                                          email: 'test_email@email.com'},
                                   buyer_entities: [{ contact_email: 'test_email1@email.com' },
                                                    { contact_email: 'test_email2@email.com' }].to_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(true)
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
        buyer_entity_1.is_default = 1

        buyer_entity_2 = CompanyBuyerEntity.new
        buyer_entity_2.company_name = 'Test_Company_Name_2'
        buyer_entity_2.company_uen = 'Test_Company_UEN_2'
        buyer_entity_2.company_address = 'Test_Company_Address_2'

        buyer_entities = [buyer_entity_1, buyer_entity_2 ]

        put :update, params: { id: company_buyer.id,
                               user: { name: 'buyer3',
                                       email: 'cbuyer3@example.com',
                                       company_name: 'Dalian Buyer',
                                       company_address: 'cbuyer3@example.com',
                                       company_unique_entity_number: 'UEN 01234',
                                       agree_seller_buyer: '1',
                                       agree_buyer_revv: '0' },
                               buyer_entities: buyer_entities.to_json}
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
        buyer_entity_3.contact_email = 'Buyer_entity_3@email.com'

        buyer_entity_4 = CompanyBuyerEntity.new
        buyer_entity_4.company_name = 'Test_Company_Name_4'
        buyer_entity_4.company_uen = 'Test_Company_UEN_4'
        buyer_entity_4.company_address = 'Test_Company_Address_4'
        buyer_entity_4.contact_email = 'Buyer_entity_4@email.com'

        buyer_entities = [buyer_entity_3, buyer_entity_4 ]

        put :sign_up, params: { id: company_buyer.id,
                                user: { agree_seller_buyer: '1',
                                        agree_buyer_revv: '0' },
                                buyer_entities: buyer_entities.to_json}
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
