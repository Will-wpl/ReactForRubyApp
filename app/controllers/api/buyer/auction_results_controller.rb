require 'logger'
class Api::Buyer::AuctionResultsController < Api::BaseController
  before_action :buyer_required
  include ActionView::Helpers::NumberHelper
  def index
    if params.key?(:page_size) && params.key?(:page_index)
      search_params = reject_params(params, %w[controller action sort_by])
      search_where_array = set_search_params(search_params)
      result = AuctionResult.find_by_consumptions(current_user).where(search_where_array)
                            .page(params[:page_index]).per(params[:page_size]).select("auction_results.*, consumptions.participation_status, consumptions.acknowledge")
      total = result.total_count
    else
      result = AuctionResult.all
      total = result.count
    end
    headers = get_headers
    data = []
    results = get_order_list(params, headers, result)
    results.each do |result|
      if result.auction_result_contracts.blank?
        data.push(published_gid: result.auction.published_gid,
                  name: result.auction.name,
                  start_datetime: result.auction.start_datetime,
                  acknowledge: get_acknowledge(result) ,
                  report: get_report(result) ,
                  award: get_award(result))
      else
        consumption = Consumption.find_by_auction_and_user(result.auction_id, current_user.id).take
        contract_result = result.auction_result_contracts.where(contract_duration: consumption.contract_duration).take
        data.push(published_gid: result.auction.published_gid,
                  name: result.auction.name,
                  start_datetime: result.auction.start_datetime,
                  acknowledge: get_new_acknowledge(result, contract_result) ,
                  report: get_new_report(result, contract_result) ,
                  award: get_new_awrd(result, contract_result))
      end

    end
    bodies = { data: data, total: total }
    render json: { headers: headers, bodies: bodies, actions: nil }, status: 200
  end

  private

  def show_award?(result, current_user)
    consumption = Consumption.find_by_auction_and_user(result.auction_id, current_user.id).first
    user = User.find(current_user.id)
    result.status != 'void' && consumption.participation_status == Consumption::ParticipationStatusParticipate && user.consumer_type == User::ConsumerTypeCompany && consumption.accept_status == Consumption::AcceptStatusApproved
  end

  def get_headers
    headers = [
      { name: 'Reference ID', field_name: 'published_gid', table_name: 'auctions'},
      { name: 'Name', field_name: 'name', table_name: 'auctions' },
      { name: 'Date', field_name: 'start_datetime', table_name: 'auctions' }
    ]
    # user = User.find(current_user.id)
    if current_user.consumer_type == '2'
      headers.push(name: 'Reverse Auction Report', field_name: 'report', is_sort: false)
      headers.push(name: 'Closing of Electricity Purchase Contract', field_name: 'award', is_sort: false)
    else
      headers.push(name: 'Reverse Auction Report', field_name: 'report', is_sort: false)
    end
  end

  def get_order_list(params, headers, result)
    if params.key?(:sort_by)
      order_by_string = get_order_by_obj_str(params[:sort_by], headers)
      result.order(order_by_string)
    else
      result.order(created_at: :desc)
    end
  end

  def get_acknowledge(result)
    show_award?(result, current_user) ? result.acknowledge : nil
  end

  def get_report(result)
    result.participation_status=='1' ? "api/buyer/auctions/#{result.auction_id}/pdf" : ''
  end

  def get_award(result)
    show_award?(result, current_user) ? result.participation_status=='1' ? ["api/buyer/auctions/#{result.auction_id}/letter_of_award_pdf"] : [] : []
  end

  def get_new_acknowledge(result, contract_result)
    show_award?(contract_result, current_user) ? result.acknowledge : nil
  end

  def get_new_report(result, contract_result)
    show_award?(contract_result, current_user) && result.participation_status=='1' ? "api/buyer/auctions/#{result.auction_id}/pdf" : ''
  end

  def get_new_award(result, contract_result)
    show_award?(contract_result, current_user) ? result.participation_status=='1' ? ["api/buyer/auctions/#{result.auction_id}/letter_of_award_pdf"] : [] : []
  end

  def get_new_awrd(result, contract_result)
    awards = []
    if show_award?(contract_result, current_user) then
      if result.participation_status == '1'
        consumption = Consumption.find_by_auction_and_user(result.auction_id, current_user.id).first
        consumption.consumption_details.select(:company_buyer_entity_id).distinct.each do |detail|
          logger.debug(detail.to_json)
          cb_entity = CompanyBuyerEntity.find(detail.company_buyer_entity_id).attributes.dup
          awards.push({url: "api/buyer/auctions/#{result.auction_id}/letter_of_award_pdf?entity_id=#{detail.company_buyer_entity_id}&contract_duration=#{consumption.contract_duration}"}.merge!(cb_entity))
        end
      end
    end
    awards
  end
end
