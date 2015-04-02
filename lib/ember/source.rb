require 'ngular/version'

module Ngular
  module Source
    def self.bundled_path_for(distro)
      File.expand_path("../../../dist/#{distro}", __FILE__)
    end
  end
end
