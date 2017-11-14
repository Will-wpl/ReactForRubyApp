# RailsBaseScaffold

Default Scaffold for RailsBase

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'rails_base_scaffolds'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install rails_base_scaffolds

## Usage

Generating Scaffold for Public Resource

```
rails g rails_base_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..]
```

Generating Scaffold for Admin Resource

```
rails g rails_base_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..] --model-name=MODEL_NAME --admin=true
```

## Contributing

1. Fork
2. New Branch
3. Issue Pull Request upstream
