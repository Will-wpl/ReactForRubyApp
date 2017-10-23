require 'rails_helper'

RSpec.describe Admin::HomeController, type: :controller do
  before { sign_in create(:user, :with_admin) }

  describe '#index' do
    def do_request
      get :index
    end

    before { do_request }

    it { expect(response).to be_success }
  end
end
