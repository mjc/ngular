# -*- encoding: utf-8 -*-
require "./lib/ngular/version"

Gem::Specification.new do |gem|
  gem.name          = "ngular-source"
  gem.authors       = ["Yehuda Katz"]
  gem.email         = ["wycats@gmail.com"]
  gem.date          = Time.now.strftime("%Y-%m-%d")
  gem.summary       = %q{Ngular.js source code wrapper.}
  gem.description   = %q{Ngular.js source code wrapper for use with Ruby libs.}
  gem.homepage      = "https://github.com/ngularjs/ngular.js"
  gem.license       = 'MIT'

  gem.version       = Ngular.rubygems_version_string

  gem.files = %w(VERSION) + Dir['dist/*.js', 'lib/ngular/*.rb']
end
