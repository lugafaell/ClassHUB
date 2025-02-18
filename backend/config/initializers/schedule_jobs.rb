Rails.application.config.after_initialize do
    CleanupNotificationsJob.perform_later unless defined?(Rails::Console)
  end