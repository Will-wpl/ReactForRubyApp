class Api::Retailer::UserAttachmentsController < Api::UserAttachmentsController
  before_action :retailer_required
end
