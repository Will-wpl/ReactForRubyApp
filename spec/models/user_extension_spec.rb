require 'rails_helper'

RSpec.describe UserExtension, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe '.save_or_update_login_status' do
    let!(:user) { create(:user) }

    it "saves user's last known location" do
      expect{
        UserExtension.save_or_update_login_status(user, 'logged in', 'foo', 'bar')
      }.to change{
        UserExtension.count
      }

      user.reload
      UserExtension.save_or_update_login_status(user, 'logged in', 'hello', 'done')

      user.reload
      expect(user.user_extension.current_room).to eq 'hello'
      expect(user.user_extension.current_page).to eq 'done'
    end
  end
end
