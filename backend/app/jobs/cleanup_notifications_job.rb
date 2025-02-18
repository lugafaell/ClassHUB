class CleanupNotificationsJob < ApplicationJob
    queue_as :default
  
    def perform
        Notification.where('created_at < ?', 15.days.ago).delete_all
        EventNotificationTracker.where('created_at < ?', 24.hours.ago).delete_all
        Tarefa.where('data_entrega < ?', 2.days.ago).destroy_all
        
        self.class.set(wait: 1.day).perform_later
    end
  end