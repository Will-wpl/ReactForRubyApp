
module FormHelper
  class Event
    include ActiveModel::Model

    attr_accessor :type
  end

  def input_for(object, attr_name, options={})
    helper.simple_form_for object, url: '' do |f|
      f.input attr_name, options
    end
  end
end