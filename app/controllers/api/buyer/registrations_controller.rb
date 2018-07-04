class Api::Buyer::RegistrationsController < Api::RegistrationsController
  before_action :buyer_required


  # get buyer registration information
  def index
    # get buyer base information
    user = @user
    # get the last uploaded business file
    user_attachment = UserAttachment.find_last_by_user(@user.id)

    # get buyer entities
    buyer_entities = user.company_buyer_entities

    # return json
    render json: { buyer_base_info: user, buyer_entities: buyer_entities, attachment: user_attachment }, status: 200
  end

  # update buyer registration information
  def update
    # update buyer registration information
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    @user.update(update_user_params)

    # update buyer entity registration information
    buyer_entities = JSON.parse(params[:buyer_entities])
    update_buyer_entities(buyer_entities)
    render json: { obj: @user }, status: 200

  end

  # Complete Sign up buyer registration information
  def sign_up
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    update_user_params['approval_status'] = User::ApprovalStatusPending
    @user.update(update_user_params)

    # update buyer entity registration information
    buyer_entities = JSON.parse(params[:buyer_entities])
    update_buyer_entities(buyer_entities)

    render json: { obj: @user }, status: 200
  end

  private

  def update_buyer_entities(buyer_entities)
    buyer_entities.each do |buyer_entity|
      if buyer_entity[:id].blank?
        new_buyer_entity = CompanyBuyerEntity.new
        new_buyer_entity.company_name = buyer_entity[:company_name] unless buyer_entity[:company_name].blank?
        new_buyer_entity.company_uen = buyer_entity[:company_uen] unless buyer_entity[:company_uen].blank?
        new_buyer_entity.company_address = buyer_entity[:company_address] unless buyer_entity[:company_address].blank?
        new_buyer_entity.billing_address = buyer_entity[:billing_address] unless buyer_entity[:billing_address].blank?
        new_buyer_entity.bill_attention_to = buyer_entity[:bill_attention_to] unless buyer_entity[:bill_attention_to].blank?
        new_buyer_entity.contact_name = buyer_entity[:contact_name] unless buyer_entity[:contact_name].blank?
        new_buyer_entity.contact_email = buyer_entity[:contact_email] unless buyer_entity[:contact_email].blank?
        new_buyer_entity.contact_mobile_no = buyer_entity[:contact_mobile_no] unless buyer_entity[:contact_mobile_no].blank?
        new_buyer_entity.contact_office_no = buyer_entity[:contact_office_no] unless buyer_entity[:contact_office_no].blank?
        new_buyer_entity.save
      else
        existed_buyer_entity = CompanyBuyerEntity.find(buyer_entity[:id])
        if existed_buyer_entity.blank?
          new_buyer_entity.company_name = buyer_entity[:company_name] unless buyer_entity[:company_name].blank?
          new_buyer_entity.company_uen = buyer_entity[:company_uen] unless buyer_entity[:company_uen].blank?
          new_buyer_entity.company_address = buyer_entity[:company_address] unless buyer_entity[:company_address].blank?
          new_buyer_entity.billing_address = buyer_entity[:billing_address] unless buyer_entity[:billing_address].blank?
          new_buyer_entity.bill_attention_to = buyer_entity[:bill_attention_to] unless buyer_entity[:bill_attention_to].blank?
          new_buyer_entity.contact_name = buyer_entity[:contact_name] unless buyer_entity[:contact_name].blank?
          new_buyer_entity.contact_email = buyer_entity[:contact_email] unless buyer_entity[:contact_email].blank?
          new_buyer_entity.contact_mobile_no = buyer_entity[:contact_mobile_no] unless buyer_entity[:contact_mobile_no].blank?
          new_buyer_entity.contact_office_no = buyer_entity[:contact_office_no] unless buyer_entity[:contact_office_no].blank?
          existed_buyer_entity.save
        end
      end
    end
  end

end
