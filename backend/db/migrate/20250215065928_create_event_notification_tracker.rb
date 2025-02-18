class CreateEventNotificationTracker < ActiveRecord::Migration[7.0]
  def change
    create_table :event_notification_trackers do |t|
      t.references :event, null: false, foreign_key: true
      t.references :aluno, null: false, foreign_key: true
      t.timestamps
      
      t.index [:event_id, :aluno_id], unique: true
    end
  end
end