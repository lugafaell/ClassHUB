class UpdateEventNotificationTrackerForPolymorphicAssociations < ActiveRecord::Migration[6.1]
  def up
    add_column :event_notification_trackers, :trackable_id, :integer
    add_column :event_notification_trackers, :trackable_type, :string

    execute <<-SQL
      UPDATE event_notification_trackers 
      SET trackable_id = aluno_id, 
          trackable_type = 'Aluno'
    SQL

    remove_column :event_notification_trackers, :aluno_id
    add_index :event_notification_trackers, [:trackable_id, :trackable_type], 
              name: 'index_event_trackers_on_trackable'
  end

  def down
    add_column :event_notification_trackers, :aluno_id, :integer

    execute <<-SQL
      UPDATE event_notification_trackers 
      SET aluno_id = trackable_id 
      WHERE trackable_type = 'Aluno'
    SQL

    remove_column :event_notification_trackers, :trackable_id
    remove_column :event_notification_trackers, :trackable_type
  end
end