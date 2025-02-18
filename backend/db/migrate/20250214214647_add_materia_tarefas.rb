class AddMateriaTarefas < ActiveRecord::Migration[7.0]
  def change
    add_column :tarefas, :materia, :string, null: false
  end
end