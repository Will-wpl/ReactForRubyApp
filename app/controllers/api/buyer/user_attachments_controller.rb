class Api::Buyer::UserAttachmentsController < Api::UserAttachmentsController
  before_action :buyer_required
end
