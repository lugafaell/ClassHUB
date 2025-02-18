class UpdateNotificationsForPolymorphicAssociations < ActiveRecord::Migration[6.1]
  def up
    add_column :notifications, :recipient_id, :integer
    add_column :notifications, :recipient_type, :string

    execute <<-SQL
      UPDATE notifications 
      SET recipient_id = aluno_id, 
          recipient_type = 'Aluno'
    SQL

    remove_column :notifications, :aluno_id
    add_index :notifications, [:recipient_id, :recipient_type]
  end

  def down
    add_column :notifications, :aluno_id, :integer

    execute <<-SQL
      UPDATE notifications 
      SET aluno_id = recipient_id 
      WHERE recipient_type = 'Aluno'
    SQL

    remove_column :notifications, :recipient_id
    remove_column :notifications, :recipient_type
  end
end