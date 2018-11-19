class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # for csrf ,do not open it
  # protect_from_forgery unless: -> { request.format.json? }
  # before_action :authenticate_user!
  before_action :basic_authenticate
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def is_zero(intake_peak, intake_off_peak)
    is_zero = false
    is_zero = true if (intake_peak == 0 || intake_peak.blank?) && (intake_off_peak == 0 || intake_off_peak.blank?)
    is_zero
  end

  def has_live_contract(contract)
    has_lt = !is_zero(contract.total_lt_peak, contract.total_lt_off_peak)
    has_hts = !is_zero(contract.total_hts_peak, contract.total_hts_off_peak)
    has_htl = !is_zero(contract.total_htl_peak, contract.total_htl_off_peak)
    has_eht = !is_zero(contract.total_eht_peak, contract.total_eht_off_peak)
    has_lt || has_hts || has_htl || has_eht
  end

  def get_unpublished_auction_contracts(auction)
    contracts = auction.auction_contracts.sort_by {|contract| contract.contract_duration.to_i}
    auction_contracts = []
    contracts.each do |contract|
      new_contract = contract.attributes.dup
      new_contract[:has_lt] = true
      new_contract[:has_hts] = true
      new_contract[:has_htl] = true
      new_contract[:has_eht] = true
      auction_contracts.push(new_contract)
    end
    auction_contracts
  end

  def get_consumptions_by_contracts(auction, contract_duration)
    consumptions = Consumption.find_by_user_consumer_type('2').find_by_auction_id(auction.id).is_participation.is_accpet
    consumptions = consumptions.where('contract_duration = ?', contract_duration)
    total_info = { consumption_count: 0, account_count: 0, lt_count: 0, hts_count: 0, htl_count: 0, eht_count:0 }
    consumptions.each do |consumption|
      next if consumption.accept_status != Consumption::AcceptStatusApproved
      details = ConsumptionDetail.find_by_consumption_id(consumption.id).order(account_number: :asc)
      details.each do |consumption_detail|
        total_info[:lt_count] += consumption_detail.intake_level == 'LT' ? 1 : 0
        total_info[:hts_count] += consumption_detail.intake_level == 'HTS' ? 1 : 0
        total_info[:htl_count] += consumption_detail.intake_level == 'HTL' ? 1 : 0
        total_info[:eht_count] += consumption_detail.intake_level == 'EHT' ? 1 : 0
      end
      count = details.count
      total_info[:consumption_count] += 1
      total_info[:account_count] += count
    end
    total_info
  end

  def get_lived_auction_contracts(auction, is_admin)
    contracts = auction.auction_contracts.sort_by {|contract| contract.contract_duration.to_i}
    auction_contracts = []
    contracts.each do |contract|
      has_lt = !is_zero(contract.total_lt_peak, contract.total_lt_off_peak)
      has_hts = !is_zero(contract.total_hts_peak, contract.total_hts_off_peak)
      has_htl = !is_zero(contract.total_htl_peak, contract.total_htl_off_peak)
      has_eht = !is_zero(contract.total_eht_peak, contract.total_eht_off_peak)
      if has_lt || has_hts || has_htl || has_eht
        base_contract = {has_lt: has_lt, has_hts: has_hts, has_htl: has_htl, has_eht: has_eht,
                         starting_price_lt_peak: contract.starting_price_lt_peak,
                         starting_price_lt_off_peak: contract.starting_price_lt_off_peak,
                         starting_price_hts_peak: contract.starting_price_hts_peak,
                         starting_price_hts_off_peak: contract.starting_price_hts_off_peak,
                         starting_price_htl_peak: contract.starting_price_htl_peak,
                         starting_price_htl_off_peak: contract.starting_price_htl_off_peak,
                         starting_price_eht_peak: contract.starting_price_eht_peak,
                         starting_price_eht_off_peak: contract.starting_price_eht_off_peak,
                         contract_period_end_date: contract.contract_period_end_date,
                         contract_duration: contract.contract_duration,
                         total_lt_peak: contract.total_lt_peak,
                         total_lt_off_peak: contract.total_lt_off_peak,
                         total_hts_peak: contract.total_hts_peak,
                         total_hts_off_peak: contract.total_hts_off_peak,
                         total_htl_peak: contract.total_htl_peak,
                         total_htl_off_peak: contract.total_htl_off_peak,
                         total_eht_peak: contract.total_eht_peak,
                         total_eht_off_peak: contract.total_eht_off_peak}
        admin_contract = {
            reserve_price_lt_peak: contract.reserve_price_lt_peak,
            reserve_price_lt_off_peak:contract.reserve_price_lt_off_peak,
            reserve_price_hts_peak:contract.reserve_price_hts_peak,
            reserve_price_hts_off_peak:contract.reserve_price_hts_off_peak,
            reserve_price_htl_peak:contract.reserve_price_htl_peak,
            reserve_price_htl_off_peak:contract.reserve_price_htl_off_peak,
            reserve_price_eht_peak:contract.reserve_price_eht_peak,
            reserve_price_eht_off_peak:contract.reserve_price_eht_off_peak
        }
        total_info = get_consumptions_by_contracts(auction , contract.contract_duration)
        base_contract = base_contract.merge(total_info)
        auction_contract_result = AuctionResultContract.where(auction_id: auction.id, contract_duration: contract.contract_duration).take
        unless auction_contract_result.blank?
          contract_result = {
              status: auction_contract_result.status
          }
        else
          contract_result = {
            status: nil
        }
        end
        result = is_admin ? base_contract.merge(admin_contract) : base_contract
        result = result.merge!(contract_result)
        auction_contracts.push(result)
      end
    end
    # auction_contracts.sort! {|a,b| a.contract_duration.to_i <=> b.contract_duration.to_i}
    auction_contracts
  end

  def basic_authenticate
    return if [ENV['BASIC_AUTH_USER'], ENV['BASIC_AUTH_PASSWORD']].any?(&:blank?)

    authenticate_or_request_with_http_basic('basement') do |username, password|
      ActiveSupport::SecurityUtils.secure_compare(username, ENV['BASIC_AUTH_USER']) &&
        ActiveSupport::SecurityUtils.secure_compare(password, ENV['BASIC_AUTH_PASSWORD'])
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up,        keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def set_action_breadcrumbs
    case params[:action]
    when 'new', 'create'
      add_breadcrumb 'New'
    when 'edit', 'update'
      add_breadcrumb 'Edit'
    end
  end

  def after_sign_in_path_for(resource)
    if resource.has_role?(:admin)
      stored_location_for(resource) || admin_home_index_path
    elsif resource.has_role?(:retailer)
      stored_location_for(resource) || retailer_home_index_path
    elsif resource.has_role?(:buyer)
      stored_location_for(resource) || buyer_home_index_path
    end
  end

  def after_sign_out_path_for(_resource)
    root_url
  end
end
