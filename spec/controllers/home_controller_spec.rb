require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  describe '#index' do
    def do_request
      get :index
    end

    before { do_request }

    it { expect(response).to be_success }
  end
end
