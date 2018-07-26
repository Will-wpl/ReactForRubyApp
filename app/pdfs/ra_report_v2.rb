require 'ra_report/pdf_lowest_didder_info'
require 'ra_report/pdf_chart'
require 'ra_report/pdf_price_chart'
require 'ra_report/pdf_price_table'
require 'ra_report/pdf_rank_chart'
require 'ra_report/pdf_ranking_table'
require 'ra_report/pdf_title'
require 'ra_report/pdf_total_info'
require 'ra_report/pdf_title_v2'
require 'ra_report/pdf_total_info_v2'
require 'ra_report/pdf_aggregate_consumption'
require 'ra_report/pdf_reverse_price_table'

class RAReportV2 < RAReport
  def pdf_draw_title(param)
    PdfTitleV2.new(param).title
  end

  def pdf_draw_right_info(param)
    pdf = param[:pdf]
    pdf.move_down 60; PdfLowestDidderInfo.new({:pdf => pdf, :auction_result => param[:auction_result]}).info
    pdf.move_down 15; PdfPriceTable.new({:pdf => pdf, :price_table => param[:price_table]}).table
    pdf.move_down 35; PdfReversePriceTable.new(param.merge({:pdf => pdf, :visibilities => @visibilities})).table
    pdf.move_down 35; PdfTotalInfoV2.new({:pdf => pdf, :auction => param[:auction], :auction_result => param[:auction_result]}).info
    pdf.start_new_page; PdfRankingTable.new({:pdf => pdf, :histories_achieved => param[:histories_achieved]}).table
    pdf.move_down 15; PdfAggregateConsumption.new({:pdf => pdf, :auction_contract => param[:auction_contract]}).aggregate
  end

  def get_price_table_data(param, visibility = false, price_data = false)
    auction_contract, auction_result = param[:auction_contract], param[:auction_result]
    price_table_data, visibilities, price_hash = get_contract_duration_price(auction_contract, auction_result)
    @visibilities = visibilities
    price_table_data
  end
end