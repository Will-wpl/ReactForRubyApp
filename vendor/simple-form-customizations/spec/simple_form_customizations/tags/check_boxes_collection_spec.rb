require 'spec_helper'

RSpec.describe 'CheckBoxesCollection', type: :helper do
  include FormHelper

  describe '#input' do
    let(:obj) { FormHelper::Event.new }

    it 'styles with custom classes' do
      output = input_for(obj, :type, as: :check_boxes, collection: ['1', '2'])

      expect(output).to match /class=.*lm--checkbox-label/
      expect(output).to match /class=.*lm--checkbox-input/
    end
  end
end
