namespace :user_attachment do
  desc "Buyer / Retailer log init"

  task :init => :environment do
    # Remove zip file record from DB
    zip_file_name = 'letter_authorisation.zip'
    UserAttachment.where(' file_name = ? ', zip_file_name).destroy_all

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
