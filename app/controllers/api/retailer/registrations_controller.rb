class Api::Retailer::RegistrationsController < Api::RegistrationsController
  before_action :retailer_required

  # get retailer registration information
  def index
    # get the last updated attachment
    user_attachment = UserAttachment.find_last_by_user(current_user.id)

    # get seller-buyer-t&c document
    seller_buyer_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_Buyer_TC)

    # get buyer-revv-t&c document
    seller_revv_tc_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Seller_REVV_TC)

    # get letter-of-authorisation document
    letter_of_authorisation_attachment = UserAttachment.find_last_by_type(UserAttachment::FileType_Letter_Authorisation)

    # return json
    render json: { user_base_info: current_user,
                   self_attachment: user_attachment,
                   seller_buyer_tc_attachment: seller_buyer_tc_attachment,
                   seller_revv_tc_attachment: seller_revv_tc_attachment,
                   letter_of_authorisation_attachment: letter_of_authorisation_attachment }, status: 200
  end

  # update retailer registration information
  def update
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    @user.update(update_user_params)
    render json: { user: @user }, status: 200
  end

  # Complete Sign up retailer registration information
  def sign_up
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    update_user_params['approval_status'] = User::ApprovalStatusPending
    @user.update(update_user_params)
    render json: { user: @user }, status: 200
  end

  # validate retailer info
  # params:
  #   user: {id: 'Buyer Id', company_name:'Company_name', email:'Email',company_unique_entity_number:'UEN'}
  # Logic:
  #   Unique check: User-> Company Name, Company UEN, Email
  def validate
    validation_user = params[:user]
    validate_final_result = true
    final_message = ''
    # validate Company name field
    validate_result, message = validate_user_field('company_name',
                                                   validation_user['company_name'],
                                                   [validation_user['id']])
    validate_final_result = validate_final_result & validate_result
    final_message = final_message + message + '\r' unless message.blank?

    # validate Email field
    validate_result, message = validate_user_field('email',
                                                   validation_user['email'],
                                                   [validation_user['id']])
    validate_final_result = validate_final_result & validate_result
    final_message = final_message + message + '\r' unless message.blank?

    # validate Company UEN field
    validate_result, message = validate_user_field('company_unique_entity_number',
                                                   validation_user['company_unique_entity_number'],
                                                   [validation_user['id']])

    validate_final_result = validate_final_result & validate_result
    final_message = final_message + message + '\r' unless message.blank?

    render json: { validate_result: validate_final_result, message: final_message }, status: 200
  end
end
