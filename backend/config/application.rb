require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module EduProject
  class Application < Rails::Application
    config.jwt_secret_key = 'sua_key'
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    config.autoload_paths << Rails.root.join('app/lib')

     config.action_cable.mount_path = '/cable'
     config.action_cable.disable_request_forgery_protection = true
     
     if Rails.env.development?
       config.action_cable.allowed_request_origins = [
         'http://localhost:3000',
         'http://localhost:5173', # se estiver usando Vite
         /http:\/\/localhost:*/
       ]
     end

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    config.active_job.queue_adapter = :async
  end
end
