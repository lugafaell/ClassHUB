class AddMateriaAndTurmasToProfessor < ActiveRecord::Migration[8.0]
  def change
    add_column :professors, :materia, :string
    add_column :professors, :turmas, :string
  end
end
