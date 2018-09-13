namespace :user_attachment do
  desc "Buyer / Retailer log init"

  task :init => :environment do
    # Remove zip file record from DB
    zip_file_name = 'letter_authorisation.zip'
    attachments = UserAttachment.find_by_file_type(UserAttachment::FileType_Letter_Authorisation)
    attachments.destroy_all unless attachments.blank?
    # Upload a new empty zip file to replace the old one.
    require 'zip'
    destination_file_path = zip_file_name #upload_file_path(zip_file_name)
    puts(destination_file_path)
    Zip::File.open(destination_file_path, Zip::File::CREATE) {
        |zipfile|
      # Do not Compress any file into the zip file.
    }
    uploader = AvatarUploader.new(UserAttachment, [])
    file = File.open(destination_file_path)
    uploader.store!(file)
    uploader

  end
end
