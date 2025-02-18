class UpdateTarefaAlunosForeignKey < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :tarefa_alunos, :tarefas
    
    add_foreign_key :tarefa_alunos, :tarefas, on_delete: :cascade
  end
end