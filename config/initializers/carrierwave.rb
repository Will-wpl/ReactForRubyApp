CarrierWave.configure do |config|
  if ENV['CARRIERWAVE_STORAGE'] == 'azure'
    config.storage :azure_rm
    config.azure_storage_account_name = ENV['AZURE_STORAGE_ACCOUNT_NAME']
    config.azure_storage_access_key = ENV['AZURE_STORAGE_ACCESS_KEY']
    config.azure_container = ENV['AZURE_CONTAINER']
  else
    config.storage :file
  end
end