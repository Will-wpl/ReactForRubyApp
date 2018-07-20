class Api::Admin::UsersController < Api::UsersController
  # Approval retailer
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_retailer
    result_json = approval_user
    render json: result_json, status: 200
  end

  # Approval retailer
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_buyer
    result_json = approval_user
    approval_status = params[:approved].blank? ? User::ApprovalStatusReject : User::ApprovalStatusApproved
    company_buyer_entity_ids = []
    CompanyBuyerEntity.find_by_user(params[:user_id]).each { |x| company_buyer_entity_ids.push(x.id) if x.is_default != 1}
    if approval_status == User::ApprovalStatusApproved
      # Update entity users approval status to approved
      User.where('entity_id in (?)', company_buyer_entity_ids).update(approval_status: User::ApprovalStatusApproved)
    elsif approval_status == User::ApprovalStatusReject
      # Remove entity users
      User.where('entity_id in (?)', company_buyer_entity_ids).delete_all
    end
    render json: result_json, status: 200
  end
end
