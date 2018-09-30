namespace :user_attachment do
  desc "Buyer / Retailer log init"

  task :init => :environment do
    # Remove zip file record from DB
    zip_file_name = 'letter_authorisation.zip'
    attachments = UserAttachment.where('file_type = ?', UserAttachment::FileType_Letter_Authorisation)
    attachments.destroy_all unless attachments.blank?
    # Upload a new empty zip file to replace the old one.
    require 'zip'
    destination_file_path = Rails.root.join('public', 'uploads', 'attachments', zip_file_name).to_s #upload_file_path(zip_file_name)

    puts(destination_file_path)
    Zip::File.open(destination_file_path, Zip::File::CREATE) {
        |zipfile|
      # Remove every file in the zip file.
      puts(zipfile.count)
      file_names = []
      zipfile.each do |f|
        file_name = File::basename(f.name)
        puts(file_name)
        file_names.push(file_name)
      end
      file_names.each do |file_name|
        zipfile.remove(file_name)
      end
    }
    uploader = AvatarUploader.new(UserAttachment, [])
    file = File.open(destination_file_path)
    uploader.store!(file)
    uploader

  end
end
