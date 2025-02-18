class AddEscolaToAlunos < ActiveRecord::Migration[8.0]
  def change
    add_reference :alunos, :escola, null: false, foreign_key: true
  end
end
