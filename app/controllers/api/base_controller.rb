class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end

  protected

  def set_search_params(params)
    where_params = reject_params(params, %w(page_size page_index))
    where_conditions = []
    where_attributes = []
    where_params.each do |key,value|
      unless value[0] == ''
        if value[1] == 'like'
          where_conditions.push("#{key} like ?")
          where_attributes.push("%#{value[0]}%")
        end
        if value[1] == '='
          where_conditions.push("#{key} = ?")
          where_attributes.push(value[0])
        end
        if value[1] == 'date_between'
          date_time = Time.parse(value[0])
          where_conditions.push("#{key} between ? and ?")
          where_attributes.push(date_time.beginning_of_day)
          where_attributes.push(date_time.at_end_of_day)
        end
      end
    end
    where = []
    where.push(where_conditions.join(' and '))
    where + where_attributes
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


  def admin_required
    head :unauthorized unless current_user&.has_role?(:admin)
  end

  def retailer_required
    head :unauthorized unless current_user&.has_role?(:retailer)
  end
end
