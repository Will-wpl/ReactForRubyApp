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
    saved_entities = nil
    # update buyer registration information
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    ActiveRecord::Base.transaction do
      @user.update(update_user_params)
      # update buyer entity registration information
      buyer_entities = JSON.parse(params[:buyer_entities])
      # buyer_entities.push(build_default_entity( update_user_params )) unless buyer_entities.any?{ |v| v['is_default'] == 1 }
      saved_entities = update_buyer_entities(buyer_entities)
    end

    render json: { result: 'success', user: @user, entities: saved_entities }, status: 200

  rescue Exception => ex
    render json: { result: 'failed', message: ex.message }, status: 200
  end

  # Complete Sign up buyer registration information
  def sign_up
    saved_entities = nil
    update_user_params = model_params
    update_user_params = filter_user_password(update_user_params)
    user = User.find(params[:user]['id'])
    raise ActiveRecord::RecordNotFound if user.nil?

    buyer_entities = JSON.parse(params[:buyer_entities])

    # need admin approval if company name / UEN changed.
    if(user.approval_status == User::ApprovalStatusRegistering ||
        (user.company_name != update_user_params['company_name'] ||
          user.company_unique_entity_number != update_user_params['company_unique_entity_number'] ) ||
       buyer_entities.any?{ |e| e['user_entity_id'].to_i == 0 })
      update_user_params['approval_status'] = User::ApprovalStatusPending
    end
    ActiveRecord::Base.transaction do
      @user.update(update_user_params)
      # update buyer entity registration information
      # buyer_entities.push(build_default_entity( update_user_params )) unless buyer_entities.any?{ |v| v['is_default'] == 1 }
      saved_entities = update_buyer_entities(buyer_entities, true)
    end

    render json: { result: 'success', user: @user, entities: saved_entities }, status: 200

  rescue Exception => ex
    render json: { result: 'failed', message: ex.message }, status: 200
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
    validate_result, entity_indexes = validate_buyer_entities_info(validation_user, buyer_entities)
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

  def validate_buyer_entities_info(buyer, buyer_entities)
    entity_indexes = []
    user_emails = User.select(:id, :email, :company_name, :entity_id)
    # validate Entity' email must not be same with any user's email
    buyer_entities.each_index do |index|
      buyer_entity = buyer_entities[index]
      # is_duplicated_email = user_emails.any?{ |v| v.email == buyer_entity['contact_email'] }
      # is_duplicated_comp_name = user_emails.any?{ |v| v.company_name == buyer_entity['company_name'] }
      # if is_duplicated_email || buyer['email']==buyer_entity['contact_email']
      #   entity_indexes.push({'entity_index' => index, 'error_field_name' => 'contact_email'})
      # end
      # if is_duplicated_comp_name
      #   entity_indexes.push({'entity_index' => index, 'error_field_name' => 'company_name'})
      # elsif !buyer_entity['is_default'].equal?(1) && buyer['company_name']==buyer_entity['company_name']
      #   entity_indexes.push({'entity_index' => index, 'error_field_name' => 'company_name'})
      # end

      # Sub entity validation
      is_duplicated_email = user_emails.any?{ |v| v.email == buyer_entity['contact_email'] &&
          (v.entity_id == nil || v.entity_id != buyer_entity['id']) }
      is_duplicated_comp_name = user_emails.any?{ |v| v.company_name == buyer_entity['company_name'] &&
          (v.entity_id == nil || v.entity_id != buyer_entity['id']) }
      # Sub entity -> existed same entity with email & company name
      if !buyer_entity['is_default'].equal?(1) && is_duplicated_email
        entity_indexes.push({'entity_index' => index, 'error_field_name' => 'contact_email'})
      end
      if !buyer_entity['is_default'].equal?(1) && is_duplicated_comp_name
        entity_indexes.push({'entity_index' => index, 'error_field_name' => 'company_name'})
      end
      # Sub entity -> same entity email / company name with input buyer
      if !buyer_entity['is_default'].equal?(1) && buyer_entity['contact_email'].equal?(buyer['email'])
        entity_indexes.push({'entity_index' => index, 'error_field_name' => 'contact_email'})
      end
      if !buyer_entity['is_default'].equal?(1) && buyer_entity['company_name'].equal?(buyer['company_name'])
        entity_indexes.push({'entity_index' => index, 'error_field_name' => 'company_name'})
      end

      # Master entity validation
      is_duplicated_email = user_emails.any?{ |v| v.email == buyer_entity['contact_email'] &&
          v.id != buyer_entity['user_id']}
      # Master entity -> existed same entity with email
      if buyer_entity['is_default'].equal?(1) && is_duplicated_email
        entity_indexes.push({'entity_index' => index, 'error_field_name' => 'contact_email'})
      end
    end

    # validate Entity' email must be unique
    buyer_entities.each_index do |index| #entity_emails.push(x['contact_email'])
      target_entity = buyer_entities[index]
      if target_entity['is_default'].equal?(1)
        next
      end
      buyer_entities.each do |temp_entity|
        if target_entity.object_id != temp_entity.object_id && target_entity['contact_email'] == temp_entity['contact_email']
          entity_indexes.push({'entity_index' => index, 'error_field_name' => 'contact_email'})
        end
        if target_entity.object_id != temp_entity.object_id && target_entity['company_name'] == temp_entity['company_name']
          entity_indexes.push({'entity_index' => index, 'error_field_name' =>'company_name'})
        end
      end
    end
    entity_indexes = entity_indexes.uniq
    [entity_indexes.blank?, entity_indexes]
  end

  def update_buyer_entities( buyer_entities, need_create_user=false )

    ids = []
    buyer_entities.each do |buyer_entity|
      ids.push(buyer_entity['user_entity_id']) if buyer_entity['user_entity_id'].to_i != 0
    end
    # will_del_buyer_entity = current_user.company_buyer_entities.reject do |buyer_entity|
    #   ids.include?(buyer_entity.id.to_s)
    # end
    will_del_buyer_entity = []
    current_user.company_buyer_entities.each do |buyer_entity|
      will_del_buyer_entity.push(buyer_entity) unless ids.include?(buyer_entity.id)
    end
    saved_buyer_entities = []
    # ActiveRecord::Base.transaction do
    will_del_buyer_entity.each do |buyer_entity|
      CompanyBuyerEntity.find(buyer_entity.id).destroy
    end
    buyer_entities.each do |buyer_entity|
      save_result= update_buyer_entity(buyer_entity)
      if save_result[0]
        target_buyer_entity = save_result[1]
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
    # end
    saved_buyer_entities
  end

  def update_buyer_entity(buyer_entity)
    target_buyer_entity = if buyer_entity['user_entity_id'].to_i == 0
                            CompanyBuyerEntity.new
                          else
                            CompanyBuyerEntity.find(buyer_entity['user_entity_id'])
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
    if buyer_entity['user_entity_id'].to_i == 0
      target_buyer_entity.approval_status = CompanyBuyerEntity::ApprovalStatusPending
    end
    target_buyer_entity.user = current_user
    success_saved = (target_buyer_entity.save!)
    [success_saved, target_buyer_entity]
  end
end
