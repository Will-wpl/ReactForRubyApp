require 'rails_helper'

RSpec.describe Api::Admin::EmailTemplatesController, type: :controller do
  before { sign_in create(:user, :with_admin) }
  before :each do
    EmailTemplate.all.delete_all
    @email_template = create(:email_template, subject: 'subject', body: 'body', template_type: '1')
  end

  describe "GET #index" do
    it "returns http success", emailctrl: true do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #show" do
    it "returns http success", emailctrl: true do
      get :show, params: { id: @email_template.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #update" do
    it "returns http success", emailctrl: true do
      get :update, params: { id: @email_template.id, email_template: {subject: "test subject3", body: "test body3"} }
      expect(response).to have_http_status(:success)
    end
  end

end
