FactoryBot.define do
  factory :email_template do
    subject { "MyString" }
    body { "MyText" }
    template_type { "MyString" }
  end
end
