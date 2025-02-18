class CreateTarefaAlunos < ActiveRecord::Migration[7.0]
  def change
    create_table :tarefa_alunos do |t|
      t.references :tarefa, null: false, foreign_key: true
      t.references :aluno, null: false, foreign_key: true
      t.boolean :concluida, default: false
      t.datetime :data_conclusao
      t.timestamps
    end
    
    add_index :tarefa_alunos, [:tarefa_id, :aluno_id], unique: true
  end
end