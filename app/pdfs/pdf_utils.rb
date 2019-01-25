class PdfUtils

  HEAD_STRING_HASH = {"LT" => '<b>LT<br/>(kWh)</b>', 'HTS' => '<b>HTS<br/>(kWh)</b>', 'HTL' => '<b>HTL<br/>(kWh)</b>', 'EHT' => '<b>EHT<br/>(kWh)</b>'}.freeze


  def self.number_helper
    ActiveSupport::NumberHelper
  end

  def self.number_format(number, precision = 0, unit = '')
    PdfUtils.number_helper.number_to_currency(number, precision: precision, unit: unit)
  end


  def self.to_array(str)
    str.to_s.split(',').map! {|item| item = item.to_i} unless str.nil?
  end

  def self.datetime_millisecond(datetime, flag = 1)
    unless datetime.index('.').nil?
      datetime[datetime.index('.'), 6] = flag == 1 ? '.' + '9' * 6 + 'Z' : '.' + '0' * 6 + 'Z'
    else
      datetime['Z'] = flag == 1 ? '.' + '9' * 6 + 'Z' : '.' + '0' * 6 + 'Z'
    end
    datetime
  end

  def self.get_format_number(number, unit, precision = 0)
    number_helper.number_to_currency(number, precision: precision, unit: unit)
  end

  def self.get_wicked_pdf_data(content, output_filename, page_size = 'B5')
    pdf = WickedPdf.new.pdf_from_string(content, encoding: 'UTF-8', page_size: page_size)
    return pdf, output_filename
  end

  def self.get_no_data_pdf(page_size, page_layout, output_filename)
    pdf_filename = Time.new.strftime('%Y%m%d%H%M%S%L')
    background_img = Rails.root.join('app', 'assets', 'pdf', 'bk.png')
    Prawn::Document.generate(Rails.root.join(pdf_filename),
                             background: background_img,
                             page_size: page_size,
                             page_layout: page_layout) do
      fill_color 'ffffff'
      draw_text 'no data', at: [15, bounds.top - 22]
    end
    return pdf_filename, output_filename
  end

  def self.time_le_3500(start_time_i, end_time_i)
    if end_time_i - start_time_i <= 3500.0
      percentage_x = 350.0 / (end_time_i - start_time_i)
      type_x = 0
      len_x = 5
      time_format = "%H:%M:%S.%L"
    else
      percentage_x = (end_time_i - start_time_i) / 350.0
      type_x = 1
      len_x = 0
      time_format = "%H:%M:%S"
    end
    return percentage_x, type_x, len_x, time_format
  end

  def self.get_chart_color(param)
    uid = param[:uid]
    color = param[:color]
    unless color.nil?
      color = color.to_s.gsub(/#/, '').split(',')
      user_color_hash = {}
      uid.each_with_index {|user_id, index|
        user_color_hash[user_id] = index < color.size ? color[index] : get_color(param)
      }
      user_color_hash
    else
      get_color param
    end
  end

  def self.draw_axis(param)
    pdf = param[:pdf]
    len_x = param[:len_x]
    base_x = param[:base_x]
    number_x = param[:number_x]
    str_time = param[:str_time]
    step_number = param[:step_number]
    # Y
    pdf.vertical_line 20, 20 + 210, :at => number_x[0]
    # X
    pdf.horizontal_line number_x[0], number_x[0] + 360, :at => 20
    pdf.fill_color "000000"
    (1..number_x.size - 1).each do |i|
      pdf.vertical_line 20, 25, :at => number_x[i]
      #font_size(7) { text_box str_date[i], :at => [base_x + (350.0/step_number)*i-14, 20-4]}
      #font_size(7) { text_box str_time[i], :at => [base_x + (350.0/step_number)*i-12-len_x, 20-10]}
      pdf.font_size(8) {pdf.text_box str_time[i], :at => [base_x + (350.0 / step_number) * i - 14 - len_x, 20 - 5]}
    end
    #font_size(7) { text_box str_date[0], :at => [base_x-12, 20-3]}
    #font_size(7) { text_box str_time[0], :at => [base_x-12-len_x, 20-10]}
    pdf.font_size(8) {pdf.text_box str_time[0], :at => [base_x - 14 - len_x, 20 - 5]}
  end

  private

  def self.get_color(param)
    user_hash = param[:hash]
    user_hash2 = param[:hash2]
    user_hash = user_hash.clone
    temp_hash2 = user_hash2.clone
    temp_hash2.each {|key, list|
      user_hash[key] = list unless user_hash.has_key?(key)
    }

    #color = ["28FF28","9F35FF", "FF359A", "2828FF", "EAC100", "FF5809"]
    color = ['22ad38', 'ffff00', 'f53d0b', '8ff830', 'f13de8',
             '37b8ff', 'ffffff', 'ffc000', '3366ff', '9933ff',
             '868686', '0ba55c', 'fa9106', 'ffafff', 'c00000',
             '46f0f0', '49702e', 'ffff99', '993300', '8e8cf4',
             '28FF28', '9F35FF', 'FF359A', '2828FF', 'EAC100',
             'FF5809']
    user_color_hash = {}
    user_color_hash = if user_hash.size <= color.size
                        user_hash.keys().each_with_index do |key, index|
                          user_color_hash[key] = color[index]
                        end
                        user_color_hash
                      else
                        keys = user_hash.keys()
                        (color.size..keys.size - 1).each do |item|
                          value = 0xff000000 | keys[item].to_s.hash
                          value = value.to_s(16)
                          color_value = value[value.size - 6, 6]
                          color_value = value[1, 6] if color.include?(color_value)
                          color.push(color_value)
                          user_color_hash[keys[item]] = color_value
                        end
                        user_color_hash
                      end
  end

end