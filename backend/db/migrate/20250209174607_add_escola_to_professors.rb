class AddEscolaToProfessors < ActiveRecord::Migration[8.0]
  def change
    add_reference :professors, :escola, null: false, foreign_key: true
  end
end
