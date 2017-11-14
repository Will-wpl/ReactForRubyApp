require 'spec_helper'

RSpec.describe 'horizontal_collection_select_input', type: :helper do
  include FormHelper

  describe '#input' do
    let(:obj) { FormHelper::Event.new }

    it 'styles with custom classes' do
      output = input_for(obj, :type, as: :select, collection: ['1', '2'])

      expect(output).to match /div class=.*lm--formItem lm--formItem--inline/
      expect(output).to match /label class=.*lm--formItem-left lm--formItem-label/
      expect(output).to match /div class=.*lm--formItem-right lm--formItem-control/
      expect(output).to match /select class=.*lm--select/
    end
  end
end
