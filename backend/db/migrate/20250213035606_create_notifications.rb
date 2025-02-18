class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :aluno, null: false, foreign_key: true
      t.references :notifiable, polymorphic: true, null: false
      t.text :message
      t.boolean :read, default: false

      t.timestamps
    end
  end
end