class CreateAdmins < ActiveRecord::Migration[8.0]
  def change
    create_table :admins do |t|
      t.string :email
      t.string :password_digest
      t.references :escola, null: false, foreign_key: true

      t.timestamps
    end
  end
end
