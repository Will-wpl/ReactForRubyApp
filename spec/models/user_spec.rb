require 'rails_helper'

RSpec.describe User, type: :model do
  context 'factory' do
    it { expect(build(:user)).to be_valid }
  end

  context 'validations' do
    it { is_expected.to validate_presence_of :name }
  end
end
