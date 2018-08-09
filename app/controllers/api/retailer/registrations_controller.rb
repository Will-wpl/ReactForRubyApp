class Api::Retailer::RegistrationsController < Api::RegistrationsController
  before_action :retailer_required

  # get retailer registration information
  def index
    user_json = get_retailer_by_id(current_user.id)
    # return json
    render json: user_json, status: 200
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
  #   user: {id: 'Buyer Id',
  #         company_name:'Company_name',
  #         email:'Email',
  #         company_unique_entity_number:'UEN',
  #         company_license_number:'License Number'}
  # Logic:
  #   Unique check: User-> Company Name, Company UEN, Email, License Number
  def validate
    validation_user = params[:user]
    validate_final_result = true
    error_fields = []
    # validate Company Licesnce Number
    validate_result = validate_user_field('company_license_number',
                                          validation_user['company_license_number'],
                                          [validation_user['id']],'Retailer')
    validate_final_result = validate_final_result & validate_result
    error_fields.push('company_license_number') unless validate_result

    # validate Company UEN field
    validate_result = validate_user_field('company_unique_entity_number',
                                          validation_user['company_unique_entity_number'],
                                          [validation_user['id']],'Retailer')
    validate_final_result = validate_final_result & validate_result
    error_fields.push('company_unique_entity_number') unless validate_result

    # validate Company name field
    validate_result = validate_user_field('company_name',
                                                   validation_user['company_name'],
                                                   [validation_user['id']],'Retailer')
    validate_final_result = validate_final_result & validate_result
    error_fields.push('company_name') unless validate_result

    # validate Email field
    validate_result = validate_user_field('email',
                                                   validation_user['email'],
                                                   [validation_user['id']])
    validate_final_result = validate_final_result & validate_result
    error_fields.push('email') unless validate_result


    render json: { validate_result: validate_final_result, error_fields: error_fields }, status: 200
  end

end
