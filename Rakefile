require 'bundler/setup'
require './lib/ngular/version'
require 'zlib'
require 'fileutils'
require 'pathname'
require 'json'

### RELEASE TASKS ###

namespace :release do

  def pretend?
    ENV['PRETEND']
  end

  task :gem do
    sh 'npm run-script build'
    sh 'gem build ngular-source.gemspec'
    sh "gem push ngular-source-#{Ngular::VERSION.gsub('-','.')}.gem"
  end

  namespace :starter_kit do
    ngular_output = "tmp/starter-kit/js/libs/ngular-#{Ngular::VERSION}.js"

    task :pull => "tmp/starter-kit" do
      cd("tmp/starter-kit") do
        sh "git pull origin master"
      end
    end

    task :clean => :pull do
      cd("tmp/starter-kit") do
        rm_rf Dir["js/libs/ngular*.js"]
      end
    end

    file "dist/ngular.js" => :dist
    file "dist/ngular.min.js" => :dist

    task "dist/starter-kit.#{Ngular::VERSION}.zip" => ["tmp/starter-kit/index.html"] do
      mkdir_p "dist"

      cd("tmp") do
        sh %{zip -r ../dist/starter-kit.#{Ngular::VERSION}.zip starter-kit -x "starter-kit/.git/*"}
      end
    end

    file ngular_output => [:clean, "tmp/starter-kit", "dist/ngular.js"] do
      sh "cp dist/ngular.js #{ngular_output}"
    end

    file "tmp/starter-kit" do
      mkdir_p "tmp"

      cd("tmp") do
        sh "git clone git@github.com:ngularjs/starter-kit.git"
      end
    end

    file "tmp/starter-kit/index.html" => [ngular_output] do
      index = File.read("tmp/starter-kit/index.html")
      index.gsub! %r{<script src="js/libs/ngular-\d\.\d.*</script>},
        %{<script src="js/libs/ngular-#{Ngular::VERSION}.js"></script>}

      open("tmp/starter-kit/index.html", "w") { |f| f.write index }
    end

    task :index => "tmp/starter-kit/index.html"

    desc "Update starter-kit repo"
    task :update => :index do
      puts "Updating starter-kit repo"
      unless pretend?
        cd("tmp/starter-kit") do
          sh "git add -A"
          sh "git commit -m 'Updated to #{Ngular::VERSION}'"
          sh "git tag v#{Ngular::VERSION}"

          print "Are you sure you want to push the starter-kit repo to github? (y/N) "
          res = STDIN.gets.chomp
          if res == 'y'
            sh "git push origin master"
            sh "git push --tags"
          else
            puts "Not pushing"
          end
        end
      end
    end

    desc "Build the Ngular.js starter kit"
    task :build => "dist/starter-kit.#{Ngular::VERSION}.zip"

    desc "Prepare starter-kit for release"
    task :prepare => [:clean, :build]

    desc "Release starter-kit"
    task :deploy => [:build, :update]
  end

  namespace :website do
    file "tmp/website" do
      mkdir_p "tmp"

      cd("tmp") do
        sh "git clone https://github.com/ngularjs/website.git"
      end
    end

    task :pull => "tmp/website" do
      cd("tmp/website") do
        sh "git pull origin master"
      end
    end

    task :about => [:pull, :dist] do
      about = File.read("tmp/website/source/about.html.erb")
      min_gz = Zlib::Deflate.deflate(File.read("dist/ngular.min.js")).bytes.count / 1024

      about.gsub!(/(\d+\.\d+\.\d+-rc(?:\.?\d+)?)/, Ngular::VERSION)
      about.gsub!(/min \+ gzip \d+kb/, "min + gzip  #{min_gz}kb")

      open("tmp/website/source/about.html.erb", "w") { |f| f.write about }
    end

    desc "Update website repo"
    task :update => :about do
      puts "Updating website repo"
      unless pretend?
        cd("tmp/website") do
          sh "git add -A"
          sh "git commit -m 'Updated to #{Ngular::VERSION}'"

          print "Are you sure you want to push the website repo to github? (y/N) "
          res = STDIN.gets.chomp
          if res == 'y'
            sh "git push origin master"
            sh "git push --tags"
          else
            puts "Not pushing"
          end
        end
        puts "NOTE: You still need to run `rake deploy` from within the website repo."
      end
    end

    desc "Prepare website for release"
    task :prepare => [:about]

    desc "Update website repo"
    task :deploy => [:update]
  end

  desc "Prepare Ngular for new release"
  task :prepare => ['ngular:clean', 'ngular:release:prepare', 'starter_kit:prepare', 'website:prepare']

  desc "Deploy a new Ngular release"
  task :deploy => ['ngular:release:deploy', 'starter_kit:deploy', 'website:deploy']
end
