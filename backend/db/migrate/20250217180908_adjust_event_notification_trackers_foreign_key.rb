class AdjustEventNotificationTrackersForeignKey < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :event_notification_trackers, :events if foreign_key_exists?(:event_notification_trackers, :events)
    
    add_foreign_key :event_notification_trackers, :events, on_delete: :cascade
  end
end