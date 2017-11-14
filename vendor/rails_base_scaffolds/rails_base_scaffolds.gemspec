lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'rails_base_scaffolds/version'

Gem::Specification.new do |spec|
  spec.name         = 'rails_base_scaffolds'
  spec.version      = RailsBaseScaffolds::VERSION
  spec.authors      = ['SP-Digital']
  spec.email        = ['example@spgroup.com.sg']

  spec.summary      = 'Scaffolds for rails-base.'
  spec.description  = 'Scaffolds for rails-base.'

  raise 'RubyGems 2.0 or newer is required to protect against public gem pushes.' unless spec.respond_to?(:metadata)

  spec.metadata['allowed_push_host'] = 'http://nexus.in.spdigital.io/repository/rubygems-internal'

  spec.bindir       = 'exe'
  spec.executables  = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.files          = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(spec|tmp|pkg)/})
  end
  spec.test_files     = Dir['test/**/*.rb']
  spec.require_paths  = ['lib']
end