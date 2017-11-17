SimpleForm.setup do |config|
  config.wrappers :horizontal_form, tag: 'div', class: 'lm--formItem lm--formItem--inline', error_class: 'is-error' do |wr|
    wr.use :html5
    wr.use :label, class: 'lm--formItem-left lm--formItem-label'
    wr.use :placeholder
    wr.optional :maxlength
    wr.optional :pattern
    wr.optional :min_max
    wr.optional :readonly

    wr.wrapper tag: 'div', class: 'lm--formItem-right lm--formItem-control' do |wr_in|
      wr_in.use :input
      wr_in.use :error, wrap_with: { class: 'error-block' }
      wr_in.use :hint,  wrap_with: { class: 'help-block' }
    end
  end
end
