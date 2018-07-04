class Api::Admin::UserAttachmentsController < Api::UserAttachmentsController
  before_action :admin_required

end
