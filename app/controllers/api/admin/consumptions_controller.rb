class Api::Admin::ConsumptionsController < Api::ConsumptionsController
  before_action :admin_required

  # Approval Consumption
  # Params:
  #   consumption_id  -> Indicate a consumption's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_consumption
    target_consumption = Consumption.find(params[:consumption_id])
    approval_status = params[:approved].blank? ? Consumption::AcceptStatusReject : Consumption::AcceptStatusApproved
    comment = params[:comment]
    participate_status = target_consumption.participation_status if approval_status == Consumption::AcceptStatusApproved
    participate_status = Consumption::ParticipationStatusPending if approval_status == Consumption::AcceptStatusReject
    target_consumption.update(accept_status: approval_status, participation_status: participate_status, comments: comment)
    if approval_status == Consumption::AcceptStatusApproved
      # UserMailer.approval_email(target_consumption).deliver_later
    elsif approval_status == Consumption::AcceptStatusReject
      # UserMailer.reject_email(target_consumption).deliver_later
    end
    render json: { consumption_info: target_consumption }, status:200
  end
end
