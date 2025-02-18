class AddPasswordDigestToProfessors < ActiveRecord::Migration[8.0]
  def change
    add_column :professors, :password_digest, :string
  end
end
