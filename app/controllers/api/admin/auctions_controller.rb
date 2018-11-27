class Api::Admin::AuctionsController < Api::AuctionsController
  before_action :admin_required
  before_action :set_auction, only: %i[update publish hold confirm destroy]


  def pdf
    start_time, end_time = params[:start_time], params[:end_time]
    start_time2, end_time2 = params[:start_time2], params[:end_time2]
    start_price, end_price = params[:start_price], params[:end_price]
    uid, uid2 = params[:uid], params[:uid2]
    color, color2 = params[:color], params[:color2]
    contract_duration = params[:contract_duration]
    # auction
    auction = Auction.find_by id: params[:id]

    (send_no_data_pdf;return) if auction.nil?

    uid, uid2 = PdfUtils.to_array(uid), PdfUtils.to_array(uid2)


    end_time, end_time2 = PdfUtils.datetime_millisecond(end_time), PdfUtils.datetime_millisecond(end_time2)
    start_time, start_time2 = PdfUtils.datetime_millisecond(start_time, 0), PdfUtils.datetime_millisecond(start_time2, 0)

    data_param = {:auction => auction,
                  :start_time => start_time,
                  :end_time => end_time,
                  :min_price => start_price.to_f,
                  :max_price => end_price.to_f + 0.00009,
                  :uid => uid,
                  :start_time2 => start_time2,
                  :end_time2 => end_time2,
                  :uid2 => uid2,
                  :contract_duration => contract_duration}
    auction_result, histories_achieved, achieved, histories, histories_2, auction_contract = get_data(data_param)
    (send_no_data_pdf;return) if auction_result.nil?
    #
    ra_param = {
        :start_time => start_time,
        :end_time => end_time,
        :start_time2 => start_time2,
        :end_time2 => end_time2,
        :start_price => start_price,
        :end_price => end_price,
        :uid => uid,
        :uid2 => uid2,
        :color => color,
        :color2 => color2,
        :auction => auction,
        :auction_result => auction_result,
        :achieved => achieved,
        :histories => histories,
        :histories_2 => histories_2,
        :histories_achieved => histories_achieved,
        :auction_contract => auction_contract

    }
    if contract_duration.blank?
      pdf_filename, output_filename = RAReport.new(ra_param).pdf
    else

      pdf_filename, output_filename = RAReportV2.new(ra_param).pdf
    end

    send_data IO.read(Rails.root.join(pdf_filename)), filename: output_filename
    File.delete Rails.root.join(pdf_filename)
  end


  private

  def send_no_data_pdf
    pdf_filename, output_filename =PdfUtils.get_no_data_pdf("B4", :landscape, 'NO_DATA_ADMIN_REPORT.pdf')
    send_data IO.read(Rails.root.join(pdf_filename)), filename: output_filename
    File.delete Rails.root.join(pdf_filename)
  end


  def get_data(param)
    auction = param[:auction]
    contract_duration = param[:contract_duration]
    auction_id = auction.id
    if contract_duration.blank?
      histories_achieved, auction_result, achieved, histories, histories_2, auction_contract = get_ra_report_data_v0(param)
    else
      histories_achieved, auction_result, achieved, histories, histories_2, auction_contract = get_ra_report_data_v2(param)
    end
    return auction_result, histories_achieved, achieved, histories, histories_2, auction_contract
  end

  def get_ra_report_data_v0(param)
    auction = param[:auction]
    start_time = param[:start_time]
    end_time = param[:end_time]
    min_price = param[:min_price]
    max_price = param[:max_price]
    uid = param[:uid]
    start_time2 = param[:start_time2]
    end_time2 = param[:end_time2]
    uid2 = param[:uid2]
    auction_id = auction.id
    auction_result = AuctionResult.find_by(auction_id: auction_id)
    histories_achieved = AuctionHistory
                             .find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc, actual_bid_time asc ', auction_id]
    achieved = histories_achieved[0].average_price <= auction.reserve_price if !histories_achieved.empty?
    histories = AuctionHistory
                    .select('users.id, users.name, users.company_name, auction_histories.*')
                    .joins(:user)
                    .where('auction_id = ? and bid_time BETWEEN ? AND ? and average_price BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time, end_time, min_price, max_price, uid)
                    .order(bid_time: :asc)
    histories_2 = AuctionHistory
                      .select('users.id, users.name, users.company_name, auction_histories.*')
                      .joins(:user)
                      .where('auction_id = ? and bid_time BETWEEN ? AND ? AND user_id in (?)', auction_id, start_time2, end_time2, uid2)
                      .order(bid_time: :asc)

    return histories_achieved, auction_result, achieved, histories, histories_2, nil
  end

  def get_ra_report_data_v2(param)
    auction = param[:auction]
    start_time = param[:start_time]
    end_time = param[:end_time]
    min_price = param[:min_price]
    max_price = param[:max_price]
    uid = param[:uid]
    start_time2 = param[:start_time2]
    end_time2 = param[:end_time2]
    uid2 = param[:uid2]
    contract_duration = param[:contract_duration]
    auction_id = auction.id
    auction_result = AuctionResultContract.find_by auction_id: auction_id, contract_duration: contract_duration
    histories = AuctionHistory
                    .select('users.id, users.name, users.company_name, auction_histories.*')
                    .joins(:user)
                    .where('auction_id = ? and bid_time BETWEEN ? AND ? and average_price BETWEEN ? AND ? AND user_id in (?) AND contract_duration = ?', auction_id, start_time, end_time, min_price, max_price, uid, contract_duration)
                    .order(bid_time: :asc)
    histories_2 = AuctionHistory
                      .select('users.id, users.name, users.company_name, auction_histories.*')
                      .joins(:user)
                      .where('auction_id = ? and bid_time BETWEEN ? AND ? AND user_id in (?) AND contract_duration = ?', auction_id, start_time2, end_time2, uid2, contract_duration)
                      .order(bid_time: :asc)
    auction_contract = AuctionContract.find_by auction_id: auction_id, contract_duration: contract_duration
    histories_achieved = AuctionHistory
                             .find_by_sql ['select auction_histories.* ,users.company_name from auction_histories LEFT OUTER JOIN users ON users.id = auction_histories.user_id where flag = (select flag from auction_histories where auction_id = ? and contract_duration = ? and is_bidder = true order by bid_time desc LIMIT 1) order by ranking asc, actual_bid_time asc ', auction_id, contract_duration]

    return histories_achieved, auction_result, false, histories, histories_2, auction_contract
  end

end
