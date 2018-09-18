require 'rails_helper'

RSpec.describe Api::Admin::TemplatesController, type: :controller do
  before {
    sign_in create(:user, :with_admin)
    create(:rich_template, type:1, content: 'test')
  }


  describe "GET #show" do
    it "returns http success", template_ctrl: true do
      get :show, params: { id: 1 }
      expect(response).to have_http_status(:success)
    end
  end

  describe "PUT #update" do
    it "returns http success", template_ctrl: true do
      put :update, params: { id: 1, body: "test body3" }
      expect(response).to have_http_status(:success)
    end
  end

end
