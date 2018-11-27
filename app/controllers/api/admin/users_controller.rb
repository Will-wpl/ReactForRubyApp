class Api::Admin::UsersController < Api::UsersController
  # Approval retailer
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_retailer
    result_json = approval_user
    approval_status = params[:approved].blank? ? User::ApprovalStatusReject : User::ApprovalStatusApproved
    if approval_status == User::ApprovalStatusReject
      Arrangement.where(user_id: params[:user_id], action_status: Consumption::ActionStatusPending).destroy_all #.delete_all
    end
    render json: result_json, status: 200
  end

  # Approval Buyer Entities
  # Params:
  #   entity_statuses ->  this is json string to indicate some entity status.
  #       include:  'enitiy_id' ~ buyer entity id
  #                 'approved_status' ~ approval status
  def approval_buyer_entities
    company_buyer_entities = []
    buyer_entities = JSON.parse(params[:entity_statuses])
    buyer_entities.each do |temp_entity_status|
      entity_id = temp_entity_status['entity_id']
      approved_status = CompanyBuyerEntity::ApprovalStatusPending if temp_entity_status['approved_status'].blank?
      approved_status = temp_entity_status['approved_status'].to_s unless temp_entity_status['approved_status'].blank?
      company_buyer_entity = approval_buyer_entity(entity_id, approved_status)
      company_buyer_entities.push(company_buyer_entity)
    end
    render json: { company_buyer_entities: company_buyer_entities }, status: 200
  end

  # Approval buyer
  # Params:
  #   user_id  -> Indicate a user's id which will be approved or rejected
  #   approved -> Indicate this is approval operation if this param is not nil. Otherwise, it is reject operation.
  #   comment -> Indicate a comment to this operation.
  def approval_buyer
    target_user = User.find(params[:user_id])
    original_status = target_user.approval_status
    result_json = approval_user
    approval_status = params[:approved].blank? ? User::ApprovalStatusReject : User::ApprovalStatusApproved
    if approval_status == User::ApprovalStatusReject
      # Update entity approval status to approved
      entites = CompanyBuyerEntity.find_by_user(params[:user_id])
      entites.update(approval_status: CompanyBuyerEntity::ApprovalStatusReject)
      # Remove consumption
      Consumption.where(user_id: params[:user_id], action_status: Consumption::ActionStatusPending).destroy_all #.delete_all
      # Remove entity users
      entity_user_ids = []
      entites.each { |x| entity_user_ids.push(x.user_entity_id) unless x.user_entity_id.blank? }
      entity_user_ids.delete(params[:user_id].to_i)
      User.where('id in (?)', entity_user_ids).destroy_all #.delete_all
    end
    if approval_status == User::ApprovalStatusApproved && original_status == User::ApprovalStatusReject
      CompanyBuyerEntity.find_by_user(params[:user_id]).update(approval_status: CompanyBuyerEntity::ApprovalStatusPending)
    end
    # company_buyer_entity_ids = []
    # CompanyBuyerEntity.find_by_user(params[:user_id]).each { |x| company_buyer_entity_ids.push(x.id) if x.is_default != 1 && x.approval_status = CompanyBuyerEntity::ApprovalStatusPending}
    # if approval_status == User::ApprovalStatusApproved
    #   # Update entity approval status to approved
    #   CompanyBuyerEntity.find_by_user(params[:user_id]).update(approval_status: CompanyBuyerEntity::ApprovalStatusApproved)
    #   # Update entity users approval status to approved
    #   User.where('entity_id in (?)', company_buyer_entity_ids).update(approval_status: User::ApprovalStatusApproved, approval_date_time: DateTime.current)
    # elsif approval_status == User::ApprovalStatusReject
    #   # Update entity approval status to approved
    #   entites = CompanyBuyerEntity.find_by_status_user(CompanyBuyerEntity::ApprovalStatusPending, params[:user_id])
    #   entites.update(approval_status: CompanyBuyerEntity::ApprovalStatusReject)
    #   # Remove entity users
    #   entity_user_ids = []
    #   entites.each { |x| entity_user_ids.push(x.user_entity_id) unless x.user_entity_id.blank? }
    #   User.where('id in (?)', entity_user_ids).delete_all
    # end

    render json: result_json, status: 200
  end

  private


  def approval_buyer_entity(entity_id, approved_status)
    approval_status = approved_status #params[:approved].blank? ? CompanyBuyerEntity::ApprovalStatusReject : CompanyBuyerEntity::ApprovalStatusApproved
    company_buyer_entity_id = entity_id # params[:entity_id].to_i
    company_buyer_entity = CompanyBuyerEntity.find(company_buyer_entity_id)
    if approval_status == CompanyBuyerEntity::ApprovalStatusApproved
      # Update entity approval status to approved
      company_buyer_entity.update(approval_status: CompanyBuyerEntity::ApprovalStatusApproved)
      # Update entity users approval status to approved
      unless company_buyer_entity.user_entity_id.blank?
        User.find(company_buyer_entity.user_entity_id).update(approval_status: User::ApprovalStatusApproved, approval_date_time: DateTime.current)
      end
    elsif approval_status == CompanyBuyerEntity::ApprovalStatusReject
      # Remove entity users
      unless company_buyer_entity.user_entity_id.blank?
        if CompanyBuyerEntity.where(user_entity_id: company_buyer_entity.user_entity_id).count <= 1 && company_buyer_entity.user_id != company_buyer_entity.user_entity_id
          User.find(company_buyer_entity.user_entity_id).destroy #unless company_buyer_entity.user_entity_id.blank?
        end
      end
      # Update entity approval status to approved
      company_buyer_entity.update(approval_status: CompanyBuyerEntity::ApprovalStatusReject, user_entity_id: nil)
    end
    company_buyer_entity
  end

end
