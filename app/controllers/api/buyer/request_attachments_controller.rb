class Api::Buyer::RequestAttachmentsController < Api::RequestAttachmentsController
  before_action :buyer_required

end
