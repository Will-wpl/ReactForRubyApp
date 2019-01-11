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
require 'ra_report/pdf_reserve_price_table.rb'
require 'ra_report/pdf_total_award_sum_v2'

class RAReportV2 < RAReport
  def pdf_draw_title(param)
    PdfTitleV2.new(param).title
  end


  def pdf_draw_left_info(param)
    pdf = param[:pdf]
    pdf.grid([0, 0], [22, 17]).bounding_box do
      pdf.move_down 650
      PdfReservePriceTable.new(param.merge({:pdf => pdf, :visibilities => @visibilities})).table
    end

  end

  def pdf_draw_right_info(param)
    pdf = param[:pdf];pdf.go_to_page(1)
    pdf.move_down 60; PdfLowestDidderInfo.new({:pdf => pdf, :auction_result => param[:auction_result]}).info
    pdf.move_down 15; PdfPriceTable.new({:pdf => pdf, :price_table => param[:price_table]}).table

    pdf.move_down 35; PdfTotalInfoV2.new({:pdf => pdf, :auction => param[:auction], :auction_result => param[:auction_result]}).info
    pdf.move_down 5; PdfAggregateConsumption.new({:pdf => pdf, :auction_contract => param[:auction_contract]}).aggregate
    pdf.move_down 5; PdfTotalAwardSumV2.new({:pdf => pdf, :auction => param[:auction], :auction_result => param[:auction_result]}).info
    pdf.move_down 55; PdfRankingTable.new({:pdf => pdf, :histories_achieved => param[:histories_achieved]}).table

  end

  def get_price_table_data(param, visibility = false, price_data = false)
    auction_contract, auction_result = param[:auction_contract], param[:auction_result]
    price_table_data, visibilities, price_hash, price_data = get_contract_duration_price(auction_contract, auction_result)
    @visibilities = visibilities
    price_table_data
  end
end