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

    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)

    # get buyer-revv-t&c document
    buyer_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Buyer_REVV_TC)

    # get letter-of-authorisation document
    letter_of_authorisation_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation)
    # return json
    render json: { user_base_info: user,
                   buyer_entities: buyer_entities,
                   self_attachment: user_attachment,
                   seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                   buyer_revv_tc_attachment: buyer_revv_tc_attachment,
                   letter_of_authorisation_attachment: letter_of_authorisation_attachment}, status: 200
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
    render json: { user: @user }, status: 200

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

    render json: { user: @user }, status: 200
  end

  private

  def update_buyer_entities(buyer_entities)
    ids = []
    buyer_entities.each do |buyer_entity|
      ids.push(buyer_entity['id']) if buyer_entity['id'].to_i != 0
    end
    will_del_buyer_entity = current_user.company_buyer_entities.reject do |buyer_entity|
      ids.include?(buyer_entity.id.to_s)
    end
    will_del_buyer_entity.each do |buyer_entity|
      CompanyBuyerEntity.find(buyer_entity.id).destroy
    end
    saved_buyer_entities = []
    ActiveRecord::Base.transaction do
      buyer_entities.each do |buyer_entity|
        target_buyer_entity = if buyer_entity['id'].to_i == 0
                              CompanyBuyerEntity.new
                             else
                               CompanyBuyerEntity.find(buyer_entity['id'])
                             end
        target_buyer_entity.company_name = buyer_entity['company_name'] unless buyer_entity['company_name'].blank?
        target_buyer_entity.company_uen = buyer_entity['company_uen'] unless buyer_entity['company_uen'].blank?
        target_buyer_entity.company_address = buyer_entity['company_address'] unless buyer_entity['company_address'].blank?
        target_buyer_entity.billing_address = buyer_entity['billing_address'] unless buyer_entity['billing_address'].blank?
        target_buyer_entity.bill_attention_to = buyer_entity['bill_attention_to'] unless buyer_entity['bill_attention_to'].blank?
        target_buyer_entity.contact_name = buyer_entity['contact_name'] unless buyer_entity['contact_name'].blank?
        target_buyer_entity.contact_email = buyer_entity['contact_email'] unless buyer_entity['contact_email'].blank?
        target_buyer_entity.contact_mobile_no = buyer_entity['contact_mobile_no'] unless buyer_entity['contact_mobile_no'].blank?
        target_buyer_entity.contact_office_no = buyer_entity['contact_office_no'] unless buyer_entity['contact_office_no'].blank?
        target_buyer_entity.user = current_user
        saved_buyer_entities.push(target_buyer_entity) if target_buyer_entity.save!
      end
    end
    saved_buyer_entities
  end

end
