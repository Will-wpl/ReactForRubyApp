class Api::Buyer::UserAttachmentsController < Api::UserAttachmentsController
  before_action :buyer_required

  # Update consumption detail id according to param ids
  def patch_update_consumption_detail_id
    id_array = JSON.parse(params[:ids])
    consumption_detail_id = params[:consumption_detail_id]
    UserAttachment.find_by_ids(id_array).update(consumption_detail_id: consumption_detail_id)
    consumption_detail_attachments = UserAttachment.find_by_ids(id_array)
    render json: { result: 'success', consumption_detail_attachments:consumption_detail_attachments }, status: 200
  end
end
