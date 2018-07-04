require 'rails_helper'

RSpec.describe Api::Admin::LaTemplatesController, type: :controller do
  before {
    sign_in create(:user, :with_admin)
    FileUtils.cp(Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html'),
                 Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html_bak'))
  }
  after{
    FileUtils.cp(Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html_bak'),
                 Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html'))
    File.delete(Rails.root.join('app', 'assets', 'pdf', 'letter_of_award_template.html_bak'))
  }

  describe "GET #show" do
    it "returns http success", la_template_ctrl: true do
      get :show, params: { id: 1 }
      expect(response).to have_http_status(:success)
    end
  end

  describe "PUT #update" do
    it "returns http success", la_template_ctrl: true do
      put :update, params: { id: 1, body: "test body3" }
      expect(response).to have_http_status(:success)
    end
  end

end
