require 'rails_helper'

RSpec.describe Api::Buyer::ConsumptionsController, type: :controller do
  let!(:buyer_user){ create(:user, :with_buyer, :with_company_buyer) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:entity) { create(:company_buyer_entity, user: buyer_user, approval_status: '1') }
  let!(:consumption) { create(:consumption, :init, user: buyer_user, auction: auction, participation_status: '1', accept_status: '1' ) }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id, company_buyer_entity_id: entity.id) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id, company_buyer_entity_id: entity.id) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }



  describe '#show' do
    before { sign_in buyer_user }

    def do_request
      get :show, params: { id: consumption.id }
    end

    before { do_request }

    it "success" do
      expect(response).to be_success
      hash = JSON.parse(response.body)
      expect(hash['count']).to eq(4)
    end
  end

  describe '#show with entity_id' do
    before { sign_in buyer_user }

    def do_request
      get :show, params: { id: consumption.id , entity_id: entity.id}
    end

    before { do_request }

    it "success" do
      expect(response).to be_success
      hash = JSON.parse(response.body)
      expect(hash['count']).to eq(2)
    end
  end

end
