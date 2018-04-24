class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end

  protected

  def set_search_params(params)
    where_params = reject_params(params, %w[page_size page_index])
    where_conditions = []
    where_attributes = []
    where_params.each do |key, value|
      next if value[0] == ''
      table_name = get_table_name(value[2])
      if value[1] == 'like'
        where_conditions.push("#{table_name}#{key} ilike ?")
        where_attributes.push("%#{value[0]}%")
      end
      if value[1] == '='
        where_conditions.push("#{table_name}#{key} = ?")
        where_attributes.push(value[0])
      end
      next unless value[1] == 'date_between'
      date_time = Time.parse(value[0])
      where_conditions.push("#{table_name}#{key} between ? and ?")
      where_attributes.push(date_time.beginning_of_day)
      where_attributes.push(date_time.at_end_of_day)
    end
    where = []
    where.push(where_conditions.join(' and '))
    condition = where + where_attributes
    get_condition_last(condition)
  end


  def get_order_by_obj_str(sort_by, headers)
    field_name = sort_by[0]
    order = sort_by[1]
    sort_header = headers.select do |header|
      header[:field_name] == field_name
    end
    unless sort_header.nil?
      order_by_string = sort_header[0][:table_name].nil? ?
                            sort_header[0][:field_name] :
                            "#{sort_header[0][:table_name]}.#{sort_header[0][:field_name]}"
      order_by_string += (order == 'asc') ? ' ASC' : ' DESC'
    end
    order_by_string
  end

  def reject_params(params, reject_list)
    rejected_params = params.reject do |key|
      reject_list.include?(key)
    end
    rejected_params
  end

  def select_params(params, select_list)
    selected_params = params.select do |key|
      select_list.include?(key)
    end
    selected_params
  end

  def get_user_ids(objects)
    ids = []
    objects.each do |object|
      if object.class.to_s.underscore == 'arrangement' || object.class.to_s.underscore == 'consumption'
        ids.push(object[:user_id])
      end
    end
    ids
  end

  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end

  def retailer_required
    head :unauthorized unless current_user&.has_role?(:retailer)
  end

  def buyer_required
    head :unauthorized unless current_user&.has_role?(:buyer)
  end

  private

  def get_table_name(value)
    value.nil? ? nil : value + '.'
  end

  def get_condition_last(condition)
    if condition == ['']
      '1 = 1'
    else
      condition
    end
  end

end
