# WickedPDF Global Configuration
#
# Use this to set up shared configuration options for your entire application.
# Any of the configuration options shown here can also be applied to single
# models by passing arguments to the `render :pdf` call.
#
# To learn more, check out the README:
#
# https://github.com/mileszs/wicked_pdf/blob/master/README.md



platform = RUBY_PLATFORM
if platform.include?("64-linux") # 64-bit linux machine
  host_os = RbConfig::CONFIG['host_os']
  case host_os
  when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
    :windows
  when /darwin|mac os/
    :macosx
  when /linux|solaris|bsd/
    os_name = `uname -a`
    case os_name
    when /Ubuntu/
      binary_path = Rails.root.join('bin', 'wkhtmltopdf-amd64').to_s
    when /Debian/
      binary_path = Rails.root.join('bin', 'wkhtmltopdf-debian-stretch-amd64').to_s
    else
      :linux
    end
  else
    raise Error::WebDriverError, "unknown os: #{host_os.inspect}"
  end
end

WickedPdf.config = {
    # Path to the wkhtmltopdf executable: This usually isn't needed if using
    # one of the wkhtmltopdf-binary family of gems.
    # exe_path: '/usr/local/bin/wkhtmltopdf',
    #   or
    # exe_path: Gem.bin_path('wkhtmltopdf-binary', 'wkhtmltopdf')
    :exe_path => binary_path
    # Layout file to be used for all PDFs
    # (but can be overridden in `render :pdf` calls)
    # layout: 'pdf.html',
}