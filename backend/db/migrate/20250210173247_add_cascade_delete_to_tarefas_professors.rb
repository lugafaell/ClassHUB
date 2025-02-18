class AddCascadeDeleteToTarefasProfessors < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :tarefas, :professors
    
    add_foreign_key :tarefas, :professors, on_delete: :cascade
  end
end