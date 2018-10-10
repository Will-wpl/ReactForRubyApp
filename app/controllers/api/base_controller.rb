class Api::BaseController < ApplicationController
  before_action :authenticate_user!

  def heartbeat
    render json: nil, status: 200
  end

  protected

  def upload_file_url(dest_path)
    work_space_directories = dest_path.to_s.split("/")
    finial_file_path = []
    build_flag = false
    work_space_directories.each do |directory|
      if directory == "uploads"
        build_flag = true
      end
      finial_file_path.push(directory) if build_flag
    end
    File::join(finial_file_path)
  end

  def upload_file_path(dest_path,is_attachment = false)
    work_space_directories = Rails.root.join('public', 'uploads', 'attachments').to_s
    unless File.directory?(work_space_directories)
      Dir.mkdir(work_space_directories)
    end
    work_space_directories = File.join(work_space_directories,dest_path)
    work_space_directories

    # current_path = Pathname.new(File.dirname(__FILE__)).realpath
    # work_space_directories = current_path.to_s.split("/")
    # finial_file_path = []
    # work_space_directories.each do |directory|
    #   if directory != "app"
    #     finial_file_path.push(directory)
    #   else
    #     finial_file_path.push("public")
    #     finial_file_path.push("uploads").push("attachments") unless is_attachment
    #     finial_file_path.push(dest_path)
    #     break
    #   end
    # end
    # File::join(finial_file_path)
  end

  def zip_attachments(zip_file_path, attachments)
    require 'zip'
    Zip::File.open(zip_file_path, Zip::File::CREATE) {
        |zipfile|
      # path = "public" + attachments[0]
      attachments.each do |attachment|
        zipfile.get_output_stream(attachment.original_filename) { |f| f.puts attachment.read }
        # zipfile.add(File::basename(path), path){true}
      end
    }
  end

  def zip_attachments_remove(zip_file_path, attachments, is_keep = false)
    require 'zip'
    Zip::File.open(zip_file_path, Zip::File::CREATE) {
        |zipfile|
      # path = "public" + attachments[0]
      if is_keep
        remove_files = []
        zipfile.each do |f|
          file_name = File::basename(f.name)
          if !attachments.any?{ |attachment| File::basename(attachment) == file_name }
            remove_files.push(f.name)
          end
        end
        remove_files.each do |file|
          zipfile.remove(file)
        end
      else
        attachments.each do |attachment|
        file_name = File::basename(attachment)
          if zipfile.any?{ |f| File::basename(f.name) == file_name }
            zipfile.remove(file_name)
          end
        end
      end
    }
  end

  def get_search_where_array(params)
    search_params = reject_params(params, %w[controller action sort_by])
    set_search_params(search_params)
  end

  def set_search_params(params)
    where_params = reject_params(params, %w[page_size page_index])
    where_conditions = []
    where_attributes = []
    where_params.each do |key, value|
      next if value[0] == ''
      set_where_params(key, value, where_conditions, where_attributes)
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

  def set_where_params(key, value, where_conditions, where_attributes)
    table_name = get_table_name(value[2])
    if value[1] == 'like'
      where_conditions.push("#{table_name}#{key} ilike ?")
      where_attributes.push("%#{value[0]}%")
    end
    if value[1] == '='
      where_conditions.push("#{table_name}#{key} = ?")
      where_attributes.push(value[0])
    end
    if value[1] == 'date_between'
      date_time = Time.parse(value[0])
      where_conditions.push("#{table_name}#{key} between ? and ?")
      where_attributes.push(date_time.beginning_of_day)
      where_attributes.push(date_time.at_end_of_day)
    end
  end

  # @param [Object] intake_peak
  # @param [Object] intake_off_peak
  # def is_zero(intake_peak, intake_off_peak)
  #   is_zero = false
  #   is_zero = true if (intake_peak == 0 || intake_peak.blank?) && (intake_off_peak == 0 || intake_off_peak.blank?)
  #   is_zero
  # end
  #
  # def has_live_contract(contract)
  #   has_lt = !is_zero(contract.total_lt_peak, contract.total_lt_off_peak)
  #   has_hts = !is_zero(contract.total_hts_peak, contract.total_hts_off_peak)
  #   has_htl = !is_zero(contract.total_htl_peak, contract.total_htl_off_peak)
  #   has_eht = !is_zero(contract.total_eht_peak, contract.total_eht_off_peak)
  #   has_lt && has_hts && has_htl && has_eht
  # end

  # def get_lived_auction_contracts(auction, is_admin)
  #   contracts = auction.auction_contracts.sort_by {|contract| contract.contract_duration.to_i}
  #   auction_contracts = []
  #   contracts.each do |contract|
  #     has_lt = !is_zero(contract.total_lt_peak, contract.total_lt_off_peak)
  #     has_hts = !is_zero(contract.total_hts_peak, contract.total_hts_off_peak)
  #     has_htl = !is_zero(contract.total_htl_peak, contract.total_htl_off_peak)
  #     has_eht = !is_zero(contract.total_eht_peak, contract.total_eht_off_peak)
  #     if has_lt && has_hts && has_htl && has_eht
  #       base_contract = {has_lt: has_lt, has_hts: has_hts, has_htl: has_htl, has_eht: has_eht,
  #                        starting_price_lt_peak: contract.starting_price_lt_peak,
  #                        starting_price_lt_off_peak: contract.starting_price_lt_off_peak,
  #                        starting_price_hts_peak: contract.starting_price_hts_peak,
  #                        starting_price_hts_off_peak: contract.starting_price_hts_off_peak,
  #                        starting_price_htl_peak: contract.starting_price_htl_peak,
  #                        starting_price_htl_off_peak: contract.starting_price_htl_off_peak,
  #                        starting_price_eht_peak: contract.starting_price_eht_peak,
  #                        starting_price_eht_off_peak: contract.starting_price_eht_off_peak,
  #                        contract_period_end_date: contract.contract_period_end_date,
  #                        contract_duration: contract.contract_duration,
  #                        total_lt_peak: contract.total_lt_peak,
  #                        total_lt_off_peak: contract.total_lt_off_peak,
  #                        total_hts_peak: contract.total_hts_peak,
  #                        total_hts_off_peak: contract.total_hts_off_peak,
  #                        total_htl_peak: contract.total_htl_peak,
  #                        total_htl_off_peak: contract.total_htl_off_peak,
  #                        total_eht_peak: contract.total_eht_peak,
  #                        total_eht_off_peak: contract.total_eht_off_peak}
  #       admin_contract = {
  #           reserve_price_lt_peak: contract.reserve_price_lt_peak,
  #           reserve_price_lt_off_peak:contract.reserve_price_lt_off_peak,
  #           reserve_price_hts_peak:contract.reserve_price_hts_peak,
  #           reserve_price_hts_off_peak:contract.reserve_price_hts_off_peak,
  #           reserve_price_htl_peak:contract.reserve_price_htl_peak,
  #           reserve_price_htl_off_peak:contract.reserve_price_htl_off_peak,
  #           reserve_price_eht_peak:contract.reserve_price_eht_peak,
  #           reserve_price_eht_off_peak:contract.reserve_price_eht_off_peak
  #       }
  #       result = is_admin ? base_contract.merge(admin_contract) : base_contract
  #       auction_contracts.push(result)
  #     end
  #   end
  #   # auction_contracts.sort! {|a,b| a.contract_duration.to_i <=> b.contract_duration.to_i}
  #   auction_contracts
  # end

end
