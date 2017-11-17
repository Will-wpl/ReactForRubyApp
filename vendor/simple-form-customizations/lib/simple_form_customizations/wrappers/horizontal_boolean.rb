SimpleForm.setup do |config|
  config.wrappers :horizontal_boolean, tag: 'div', class: 'lm--formItem lm--formItem--inline', error_class: 'is-error' do |wr|
    wr.use :html5
    wr.optional :readonly

    wr.wrapper tag: 'div', class: 'lm--formItem-right-push lm--formItem-control' do |wr_in|
      wr_in.use :input, class: 'lm--checkbox-input'
      wr_in.use :label, class: 'lm--checkbox-label'

      wr_in.use :error, wrap_with: { class: 'error-block' }
      wr_in.use :hint,  wrap_with: { class: 'help-block' }
    end
  end
end
