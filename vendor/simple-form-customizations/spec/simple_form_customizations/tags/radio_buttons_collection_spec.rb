require 'spec_helper'

RSpec.describe 'RadioButtonsCollection', type: :helper do
  include FormHelper

  describe '#input' do
    let(:obj) { FormHelper::Event.new }

    it 'styles with custom classes' do
      output = input_for(obj, :type, as: :radio_buttons, collection: ['1', '2'])

      expect(output).to match /class=.*lm--radio-input/
      expect(output).to match /class=.*lm--radio-label/
    end
  end
end
