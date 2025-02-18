class AddTurmaToAlunos < ActiveRecord::Migration[8.0]
  def change
    add_column :alunos, :turma, :string
  end
end
