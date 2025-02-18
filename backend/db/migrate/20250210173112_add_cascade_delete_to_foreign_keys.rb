class AddCascadeDeleteToForeignKeys < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :tarefa_alunos, :alunos
    
    add_foreign_key :tarefa_alunos, :alunos, on_delete: :cascade
  end
end