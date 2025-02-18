class AddDiasAulaToProfessor < ActiveRecord::Migration[7.0]
  def change
    add_column :professors, :dias_aula, :string, array: true, default: []
  end
end