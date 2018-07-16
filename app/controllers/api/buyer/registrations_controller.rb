class Api::Buyer::RegistrationsController < Api::RegistrationsController
  before_action :buyer_required


  # get buyer registration information
  def index
    # get buyer base information
    user = @user
    user_json = get_buyer_by_id(user)
    # return json
    render json: user_json, status: 200
  end

  # update buyer registration information
  def update
    # update buyer registration information
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    @user.update(update_user_params)

    # update buyer entity registration information
    buyer_entities = JSON.parse(params[:buyer_entities])
    buyer_entities.push(build_default_entity( update_user_params )) unless buyer_entities.any?{ |v| v['is_default'] == 1 }
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
    buyer_entities.push(build_default_entity( update_user_params )) unless buyer_entities.any?{ |v| v['is_default'] == 1 }
    update_buyer_entities(buyer_entities, true)

    render json: { user: @user }, status: 200
  end

  # validate retailer info
  # params:
  #   user: {id: 'Buyer Id', company_name:'Company_name', email:'Email',company_unique_entity_number:'UEN'}
  #   buyer_entities: JSON array -> [{contact_email:'Entity email'}]
  # Logic:
  #   Unique check: User-> Company Name, Company UEN, Email
  #   Email Check:
  #     a. Buyer email must be difference with it's entity contact email.
  #     b. Buyer entities's emails must be unique.
  def validate
    validation_user = params[:user]
    validate_final_result = true
    error_fields = []
    error_entity_indexes = []
    # validate Company name field
    validate_result = validate_user_field('company_name',
                                                   validation_user['company_name'],
                                                   [validation_user['id']])
    validate_final_result = validate_final_result & validate_result
    error_fields.push('company_name') unless validate_result

    # validate Email field
    validate_result = validate_user_field('email',
                                                   validation_user['email'],
                                                   [validation_user['id']])
    validate_final_result = validate_final_result & validate_result
    error_fields.push('email') unless validate_result

    # validate Company UEN field
    validate_result = validate_user_field('company_unique_entity_number',
                                                   validation_user['company_unique_entity_number'],
                                                   [validation_user['id']])

    validate_final_result = validate_final_result & validate_result
    error_fields.push('company_unique_entity_number') unless validate_result

    # validate user entities
    buyer_entities = JSON.parse(params[:buyer_entities])
    validate_result, entity_indexes = validate_buyer_entities_info(validation_user['email'], buyer_entities)
    validate_final_result = validate_final_result & validate_result
    error_entity_indexes = entity_indexes unless validate_result
    render json: { validate_result: validate_final_result,
                   error_fields: error_fields,
                   error_entity_indexes: error_entity_indexes }, status: 200
  end

  private

  def build_default_entity(update_user_params)
    buyer_entity = Hash[
        'id'=> nil,
        'company_name'=> update_user_params['company_name'],
        'company_uen'=> update_user_params['company_unique_entity_number'],
        'company_address'=> update_user_params['company_address'],
        'billing_address'=> update_user_params['billing_address'],
        'contact_name'=> update_user_params['name'],
        'contact_email'=> update_user_params['email'],
        'user_id'=> current_user.id,
        'is_default'=> 1
    ]
    buyer_entity
  end

  def validate_buyer_entities_info(buyer_email, buyer_entities)
    entity_indexes = []
    user_emails = User.select(:email)
    # validate Entity' email must not be same with any user's email
    buyer_entities.each_index do |index|
      buyer_entity = buyer_entities[index]
      if user_emails.any?{ |v| v.email == buyer_entity['contact_email'] } || buyer_email==buyer_entity['contact_email']
        entity_indexes.push(index)
      end
    end

    # validate Entity' email must be unique
    buyer_entities.each_index do |index| #entity_emails.push(x['contact_email'])
      target_entity = buyer_entities[index]
      buyer_entities.each do |temp_entity|
        if target_entity.object_id != temp_entity.object_id && target_entity['contact_email'] == temp_entity['contact_email']
          entity_indexes.push(index)
        end
      end
    end
    entity_indexes = entity_indexes.uniq
    [entity_indexes.blank?, entity_indexes]
  end

  def update_buyer_entities( buyer_entities, need_create_user=false )
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
        target_buyer_entity.is_default = buyer_entity['is_default'].blank? ? 0 : buyer_entity['is_default']
        target_buyer_entity.user = current_user
        if target_buyer_entity.save!
          saved_buyer_entities.push(target_buyer_entity)
          if need_create_user && !target_buyer_entity.is_default then
            new_entity_user = User.new
            new_entity_user.name = target_buyer_entity.company_name
            new_entity_user.email = target_buyer_entity.contact_email
            new_entity_user.consumer_type = User::ConsumerTypeBuyerEntity
            new_entity_user.approval_status = User::ApprovalStatusDisable
            new_entity_user.password = 'password'
            new_entity_user.password_confirmation = 'password'
            new_entity_user.entity_id = target_buyer_entity.id
            new_entity_user.add_role(:entity) if new_entity_user.save
          elsif need_create_user && target_buyer_entity.is_default then
            user = current_user
            user.entity_id = target_buyer_entity.id
            user.save!
          end
        end
      end
    end
    saved_buyer_entities
  end

end
