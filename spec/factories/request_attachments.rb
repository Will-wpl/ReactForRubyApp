FactoryBot.define do
  factory :request_attachment do
    file_name Faker::File.file_name
    file_path Faker::File.file_name('abc/def/')
  end
end
