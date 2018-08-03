require 'rails_helper'

RSpec.describe Api::Buyer::RegistrationsController, type: :controller do
  let!(:admin_user) { create(:user, :with_admin, email: 'admin@email.com') }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer, approval_status: '1', company_unique_entity_number: 'Test UEN', company_name: 'test buyer', email: 'test_email4@email.com') }
  let!(:company_buyer1) { create(:user, :with_buyer, :with_company_buyer, email:'test_email1@email.com') }

  context 'save retailer information' do
    before { sign_in company_buyer }

    describe 'Validate user info' do
      context 'test buyer entity company_name/emails duplicated' do
        def do_request
          buyer_entities_json = [{ company_name: 'AA',
                                   company_uen: 'Test UEN AA - 1',
                                   contact_email: 'test_email1@email.com', is_default:1 },
                                 { company_name: 'AA',
                                   company_uen: 'Test UEN AA - 2',
                                   contact_email: 'test_email1@email.com' },
                                 { company_name: 'BB',
                                   company_uen: 'Test UEN BB - 1',
                                   contact_email: 'test_email2@email.com' },
                                 { company_name: 'BB',
                                   company_uen: 'Test UEN BB - 2',
                                   contact_email: 'test_email3@email.com' },
                                 { company_name: 'test buyer',
                                   company_uen: 'Test UEN',
                                   contact_email: 'test_email4@email.com' }].to_json
          put :validate, params: { id: company_buyer.id,
                                   user: { id: company_buyer.id,
                                           company_name: 'AA',
                                           company_unique_entity_number: 'UEN',
                                           email: 'test_email@email.com' },
                                   buyer_entities: buyer_entities_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          expect(response).to have_http_status(:ok)
        end
      end

      context 'test buyer email is same with entity contact email' do
        def do_request
          buyer_entities_json = [{ company_name: 'AA',
                                   company_uen: 'Test UEN AA',
                                   contact_email: 'test_email3@email.com' },
                                 { company_name: 'BB',
                                   company_uen: 'Test UEN BB',
                                   contact_email: 'test_email3@email.com' },
                                 { company_name: 'CC',
                                   company_uen: 'Test UEN CC',
                                   contact_email: 'test_email2@email.com' }].to_json
          put :validate, params: { id: company_buyer.id,
                                   user: {id: company_buyer.id,
                                          company_name: 'abc',
                                          company_unique_entity_number: 'UEN',
                                          email: 'test_email@email.com' },
                                   buyer_entities: buyer_entities_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          error_entities = [{ 'entity_index' => 0, 'error_field_name' => 'contact_email' },
                            { 'entity_index' => 1, 'error_field_name' => 'contact_email' }]
          expect(hash_body['error_entity_indexes']).to eq(error_entities)
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
                                   buyer_entities: [{ company_name: 'AA',
                                                      company_uen: 'Test UEN AA',
                                                      contact_email: 'admin@email.com' },
                                                    { company_name: 'BB',
                                                      company_uen: 'Test UEN BB',
                                                      contact_email: 'test_email1@email.com' }].to_json}
        end
        before { do_request }
        it 'success' do
          hash_body = JSON.parse(response.body)
          expect(hash_body).to have_content('validate_result')
          expect(hash_body).to have_content('error_fields')
          expect(hash_body).to have_content('error_entity_indexes')
          expect(hash_body['validate_result']).to eq(false)
          error_entities = [{'entity_index'=>0, 'error_field_name'=>'contact_email'},
                            {'entity_index'=>1, 'error_field_name'=>'contact_email'}]
          expect(hash_body['error_entity_indexes']).to eq(error_entities)
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
                                   buyer_entities: [{ company_name: 'AA',
                                                      company_uen: 'Test UEN AA',
                                                      contact_email: 'test_email3@email.com' },
                                                    { company_name: 'BB',
                                                      company_uen: 'Test UEN BB',
                                                      contact_email: 'test_email2@email.com' }].to_json}
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

        buyer_entities = [buyer_entity_1, buyer_entity_2]

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

    describe 'Put update with foreign key error' do
      def do_request
        buyer_entity_1 = CompanyBuyerEntity.new
        buyer_entity_1.company_name = 'Test_Company_Name_1'
        buyer_entity_1.company_uen = 'Test_Company_UEN_1'
        buyer_entity_1.company_address = 'Test_Company_Address_1'
        buyer_entity_1.is_default = 1

        buyer_entity_2 = CompanyBuyerEntity.new
        buyer_entity_2.user_id = company_buyer.id
        buyer_entity_2.company_name = 'Test_Company_Name_2'
        buyer_entity_2.company_uen = 'Test_Company_UEN_2'
        buyer_entity_2.company_address = 'Test_Company_Address_2'
        buyer_entity_2.save!

        auction = create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01')
        consumption =create(:consumption, user: company_buyer, auction: auction, participation_status: '1')
        create(:consumption_detail, :for_lt, consumption_id: consumption.id, company_buyer_entity_id: buyer_entity_2.id)

        buyer_entities = [buyer_entity_1]

        put :sign_up, params: { id: company_buyer.id,
                                user: { agree_seller_buyer: '1',
                                        agree_buyer_revv: '0' },
                                buyer_entities: buyer_entities.to_json }
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body['result']).to have_content('failed')
        expect(hash_body).to have_content('message')
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
        buyer_entity_4.user_id = company_buyer.id
        buyer_entity_4.company_name = 'Test_Company_Name_4'
        buyer_entity_4.company_uen = 'Test_Company_UEN_4'
        buyer_entity_4.company_address = 'Test_Company_Address_4'
        buyer_entity_4.contact_email = 'Buyer_entity_4@email.com'
        buyer_entity_4.save!

        buyer_entities = [buyer_entity_3, buyer_entity_4]

        put :sign_up, params: { id: company_buyer.id,
                                user: { id: company_buyer.id,
                                        company_unique_entity_number: 'Test UEN1',
                                        company_name: 'test buyer',
                                        agree_seller_buyer: '1',
                                        agree_buyer_revv: '0' },
                                buyer_entities: buyer_entities.to_json }
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body['result']).to have_content('success')
        expect(hash_body).to have_content('user')
        expect(response).to have_http_status(:ok)
      end
    end

    describe 'Put sign up with foreign key error' do
      def do_request
        buyer_entity_3 = CompanyBuyerEntity.new
        buyer_entity_3.company_name = 'Test_Company_Name_3'
        buyer_entity_3.company_uen = 'Test_Company_UEN_3'
        buyer_entity_3.company_address = 'Test_Company_Address_3'
        buyer_entity_3.contact_email = 'Buyer_entity_3@email.com'

        buyer_entity_4 = CompanyBuyerEntity.new
        buyer_entity_4.user_id = company_buyer.id
        buyer_entity_4.company_name = 'Test_Company_Name_4'
        buyer_entity_4.company_uen = 'Test_Company_UEN_4'
        buyer_entity_4.company_address = 'Test_Company_Address_4'
        buyer_entity_4.contact_email = 'Buyer_entity_4@email.com'
        buyer_entity_4.save!

        auction = create(:auction, :for_next_month, :upcoming, :published, :started, contract_period_start_date: '2018-07-01')
        consumption =create(:consumption, user: company_buyer, auction: auction, participation_status: '1')
        create(:consumption_detail, :for_lt, consumption_id: consumption.id, company_buyer_entity_id: buyer_entity_4.id)

        buyer_entities = [buyer_entity_3]

        put :sign_up, params: { id: company_buyer.id,
                                user: { agree_seller_buyer: '1',
                                        agree_buyer_revv: '0' },
                                buyer_entities: buyer_entities.to_json }
      end
      before { do_request }
      it 'success' do
        hash_body = JSON.parse(response.body)
        expect(hash_body['result']).to have_content('failed')
        expect(hash_body).to have_content('message')
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
