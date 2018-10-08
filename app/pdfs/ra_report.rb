require 'ra_report/pdf_lowest_didder_info'
require 'ra_report/pdf_chart'
require 'ra_report/pdf_price_chart'
require 'ra_report/pdf_price_table'
require 'ra_report/pdf_rank_chart'
require 'ra_report/pdf_ranking_table'
require 'ra_report/pdf_title'
require 'ra_report/pdf_total_info'



class RAReport < Pdf
  attr_reader :param, :background_img, :step_number, :base_x, :pdf_filename

  def initialize(param)
    @param = param
    @background_img = Rails.root.join("app", "assets", "pdf", "bk.png")
    @step_number = 6.0
    @base_x = 30.0
    @pdf_filename = Time.new.strftime("%Y%m%d%H%M%S%L")
  end

  def pdf
    return PdfUtils.get_no_data_pdf("B4", :landscape, 'NO_DATA_ADMIN_REPORT.pdf') if param[:auction].nil?
    start_datetime, end_datetime = Time.parse(param[:start_time]), Time.parse(param[:end_time])
    start_time_i, end_time_i = start_datetime.to_i, end_datetime.to_i
    start_datetime2, end_datetime2 = Time.parse(param[:start_time2]), Time.parse(param[:end_time2])
    start_time2_i, end_time2_i = start_datetime2.to_i, end_datetime2.to_i
    min_price, max_price = param[:start_price].to_f, param[:end_price].to_f
    hash, user_company_name_hash = get_histories_hash(param[:histories])
    hash2, user_company_name_hash2, ranking = get_histories_hash(param[:histories_2], true)
    uid, uid2 = param[:uid], param[:uid2]
    color, color2 = param[:color], param[:color2]
    chart_color = PdfUtils.get_chart_color({:hash => hash, :hash2 => hash2, :uid => uid, :color => color}).merge PdfUtils.get_chart_color({:hash => hash, :hash2 => hash2, :uid => uid2, :color => color2})
    auction, auction_result = param[:auction], param[:auction_result]
    price_table = get_price_table_data(param)
    Prawn::Document.generate(Rails.root.join(pdf_filename), :background => background_img, :page_size => "B4", :page_layout => :landscape) do |pdf|
      pdf.define_grid(:columns => 30, :rows => 23, :gutter => 2)
      pdf_draw_title({:pdf => pdf, :achieved => param[:achieved], :auction => param[:auction], :zone_time => get_pdf_datetime_zone})
      chart_param = get_price_chart_data({:pdf => pdf, :start_datetime => start_datetime, :end_datetime => end_datetime, :start_time_i => start_time_i, :end_time_i => end_time_i, :min_price => min_price, :max_price => max_price,
                                          :hash => hash, :user_company_name_hash => user_company_name_hash, :chart_color => chart_color, :uid => uid})
      PdfPriceChart.new(chart_param).chart
      ranking_param = get_ranking_chart_data({:hash => hash2, :user_company_name_hash => user_company_name_hash2, :chart_color => chart_color, :uid => uid2, :ranking => ranking, :pdf => pdf, :start_datetime => start_datetime2, :end_datetime => end_datetime2,
                                              :start_time_i => start_time2_i, :end_time_i => end_time2_i, :min_price => min_price, :max_price => max_price})
      PdfRankChart.new(ranking_param).chart
      pdf_draw_left_info(param.merge({:pdf => pdf,  :price_table => price_table}))
      unless param[:auction_result].nil?
        pdf.grid([0, 19], [22, 29]).bounding_box do
          pdf_draw_right_info(param.merge({:pdf => pdf, :auction_contract => param[:auction_contract], :auction_result => auction_result, :price_table => price_table,
                               :auction => auction,:histories_achieved => param[:histories_achieved]}))
        end
      end
    end
    return pdf_filename, auction.published_gid.to_s + '_ADMIN_REPORT.pdf'
  end

  def pdf_draw_title(param)
    PdfTitle.new(param).title
  end

  def pdf_draw_right_info(param)
    pdf = param[:pdf]
    pdf.move_down 60; PdfLowestDidderInfo.new({:pdf => pdf, :auction_result => param[:auction_result]}).info
    pdf.move_down 15; PdfPriceTable.new({:pdf => pdf, :price_table => param[:price_table]}).table
    pdf.move_down 15; PdfTotalInfo.new({:pdf => pdf, :auction => param[:auction], :auction_result => param[:auction_result]}).info
    pdf.move_down 15; PdfRankingTable.new({:pdf => pdf, :histories_achieved => param[:histories_achieved]}).table
  end

  def pdf_draw_left_info(param)

  end

  private

  def get_number_x(param)
    step_number = param[:step_number]
    step_time = param[:step_time]
    start_datetime = param[:start_datetime]
    start_time_i = param[:start_time_i]
    len_x = param[:len_x]
    percentage_x = param[:percentage_x]
    base_x = param[:base_x]
    type_x = param[:type_x]
    number_x = []
    str_date = []
    str_time = []
    (1..step_number).each do |i|
      number_x[i] = if type_x == 0
                      ((start_datetime + step_time * i).to_f - start_time_i) * percentage_x + base_x
                    else
                      ((start_datetime + step_time * i).to_f - start_time_i) / percentage_x
                    end
    end
    number_x[0] = number_x[1] - (number_x[2] - number_x[1])
    offset_x = (base_x - number_x[0])
    (0..number_x.size - 1).each do |i|
      number_x[i] = number_x[i] + offset_x
    end
    zone_time = get_pdf_datetime_zone
    is_int = true
    (1..number_x.size - 1).each do |i|
      str_date[i] = (start_datetime + zone_time + step_time * i).strftime("%Y-%m-%d")
      str_time[i] = (start_datetime + zone_time + step_time * i).strftime(param[:time_format])
      if type_x == 0 && is_int && str_time[i].split('.')[1] != '000'
        is_int = false
      end
    end
    start_datetime_zone = start_datetime + zone_time
    str_date[0] = start_datetime_zone.strftime("%Y-%m-%d")
    str_time[0] = start_datetime_zone.strftime("%H:%M:%S.%L")
    if is_int
      len_x = 0
      (0..number_x.size - 1).each do |i|
        str_time[i] = str_time[i].split('.')[0]
      end
    end
    return number_x, str_date, str_time, len_x, offset_x
  end

  def get_number_y(param)
    step_number = param[:step_number]
    step_price = param[:step_price]
    min_price = param[:min_price]
    is_int = false
    number_y = []
    (1..step_number).each do |i|
      number_y[i] = step_price * i + min_price #
      if number_y[i].to_i == number_y[i] && is_int == false
        is_int = true
      end
    end
    if is_int
      (1..step_number).each do |i|
        number_y[i] = number_y[i].round.to_s
      end
      number_y[0] = min_price.round.to_s
    else
      (1..step_number).each do |i|
        number_y[i] = ((number_y[i].to_f * 10000.0).floor / (10000.0)).to_s
      end
      number_y[0] = ((min_price.to_f * 10000.0).floor / (10000.0)).to_s
    end
    number_y
  end

  def get_histories_hash(histories, ranking = false)
    hash = {}
    user_company_name_hash = {}
    ranking = 0
    histories.each {|history|
      user_company_name_hash[history.user_id] = (history.company_name) unless user_company_name_hash.has_key?(history.user_id)
      hash[history.user_id] = [] unless hash.has_key?(history.user_id)
      hash[history.user_id].push(history)
      ranking = history.ranking if history.ranking > ranking
    }
    if ranking
      return hash, user_company_name_hash, ranking
    else
      return hash, user_company_name_hash
    end
  end

  def get_price_chart_data(param)
    pdf = param[:pdf]
    start_datetime, end_datetime = param[:start_datetime], param[:end_datetime]
    start_time_i, end_time_i= param[:start_time_i], param[:end_time_i]
    min_price, max_price = param[:min_price], param[:max_price]
    hash = param[:hash]
    user_company_name_hash = param[:user_company_name_hash]
    chart_color = param[:chart_color]
    uid = param[:uid]
    percentage_x, type_x, len_x, time_format = PdfUtils.time_le_3500(start_time_i, end_time_i)
    percentage_y = (max_price - min_price) / 200.0
    step_time = ((end_datetime.to_i - start_datetime.to_i) / step_number)
    step_price = (max_price - min_price) / step_number
    zone_time = get_pdf_datetime_zone
    x_param = {:step_number => step_number, :step_time => step_time, :zone_time => zone_time, :start_datetime => start_datetime,
               :start_time_i => start_time_i, :len_x => len_x, :percentage_x => percentage_x, :base_x => base_x, :type_x => type_x, :time_format => time_format}
    y_param = {:step_number => step_number, :step_price => step_price, :min_price => min_price}
    number_x, str_date, str_time, len_x, offset_x = get_number_x(x_param)
    number_y = get_number_y(y_param)
    {
        :pdf => pdf, :len_x => len_x, :base_x => base_x,
        :number_x => number_x, :number_y => number_y, :str_time => str_time,
        :step_number => step_number, :hash => hash, :start_time_i => start_time_i,
        :percentage_x => percentage_x, :offset_x => offset_x, :min_price => min_price, :percentage_y => percentage_y,
        :user_company_name_hash => user_company_name_hash, :chart_color => chart_color,
        :type_x => type_x, :uid => uid
    }
  end

  def get_ranking_chart_data(param)
    pdf = param[:pdf]
    start_time_i, end_time_i= param[:start_time_i], param[:end_time_i]
    percentage_x, type_x, len_x, time_format = PdfUtils.time_le_3500(start_time_i, end_time_i)
    min_price, max_price = param[:min_price], param[:max_price]
    hash = param[:hash]
    user_company_name_hash = param[:user_company_name_hash]
    chart_color = param[:chart_color]
    uid = param[:uid]
    start_datetime, end_datetime = param[:start_datetime], param[:end_datetime]
    step_time = ((end_datetime.to_i - start_datetime.to_i) / step_number)
    percentage_y = (max_price - min_price) / 200.0
    x_param = {
        :step_number => step_number,
        :step_time => step_time,
        :zone_time => get_pdf_datetime_zone,
        :start_datetime => start_datetime,
        :start_time_i => start_time_i,
        :len_x => len_x,
        :percentage_x => percentage_x,
        :base_x => base_x,
        :type_x => type_x,
        :time_format => time_format
    }
    number_x, str_date2, str_time, len_x, offset_x = get_number_x(x_param)
    number_y = []
    (0..param[:ranking]).each do |i|
      number_y[i] = i.to_s
    end
    {:pdf => pdf, :len_x => len_x, :base_x => base_x, :number_x => number_x, :number_y => number_y,
     :str_time => str_time, :step_number => step_number, :hash => hash, :start_time_i => start_time_i,
     :percentage_x => percentage_x, :offset_x => offset_x, :percentage_y => percentage_y,
     :user_company_name_hash => user_company_name_hash, :chart_color => chart_color,
     :type_x => type_x, :uid => uid, :ranking => param[:ranking]}
  end
end